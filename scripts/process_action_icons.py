import re
import xml.etree.ElementTree as ET


def sanitize_svg_colors_only(svg_string: str) -> str:
    """
    Sanitizes ONLY colors in an Inkscape SVG:
    - Preserves stroke-width, stroke-linecap, stroke-linejoin, and transforms
    - Converts black/default fills on stroked shapes to 'currentColor' (matching stroke color)
    - Converts fill and stroke colors to 'currentColor' or 'none'
    - Strips Inkscape metadata and comments
    """
    # Register default namespace to prevent unwanted 'ns0:' tags
    ET.register_namespace("", "http://www.w3.org/2000/svg")
    root = ET.fromstring(svg_string)

    # Remove Inkscape/metadata metadata and root ID
    root.attrib.pop("id", None)
    root.attrib.pop("version", None)

    BLACK_FILLS = {"#000000", "black", "#000", "#808080", "#000000ff"}

    for elem in root.iter():
        # Parse inline style if present (Inkscape stores colors in style="...")
        style_attr = elem.attrib.get("style", "")
        styles = {}
        if style_attr:
            for item in style_attr.split(";"):
                if ":" in item:
                    k, v = item.split(":", 1)
                    styles[k.strip()] = v.strip()

        # Handle Stroke first to determine if element has an active stroke
        stroke_val = styles.get("stroke", elem.attrib.get("stroke"))
        has_stroke = stroke_val is not None and stroke_val != "none"
        if has_stroke:
            elem.set("stroke", "currentColor")

        # Handle Fill
        fill_val = styles.get("fill", elem.attrib.get("fill"))
        if fill_val:
            if fill_val.lower() in BLACK_FILLS:
                # If fill is black, use stroke color (currentColor) if stroked, else 'none'
                elem.set("fill", "currentColor" if has_stroke else "none")
            else:
                elem.set("fill", fill_val)

        # Preserve structural attributes from inline style verbatim
        for attr in [
            "stroke-width",
            "stroke-linecap",
            "stroke-linejoin",
            "stroke-dasharray",
        ]:
            if attr in styles:
                elem.set(attr, styles[attr])

        # Strip 'style' and Inkscape-specific metadata attributes
        elem.attrib.pop("style", None)
        keys_to_remove = [
            k for k in elem.attrib if "inkscape" in k or "sodipodi" in k or k == "id"
        ]
        for k in keys_to_remove:
            del elem.attrib[k]

    # Remove empty <defs> tags
    for defs in list(root):
        if defs.tag.endswith("defs") and len(defs) == 0:
            root.remove(defs)

    return ET.tostring(root, encoding="utf-8").decode("utf-8")


def generate_icon_tsx(icon_data: list[tuple[str, str]]) -> str:
    """
    Generates a TypeScript React (.tsx) file string containing individual named icon components.

    :param icon_data: List of tuples -> [("close-icon", "<svg>...</svg>"), ("cupboard", "<svg>...</svg>")]
    :return: A formatted string representing the contents of an `icons.tsx` file.
    """

    def to_pascal_case(name: str) -> str:
        """Converts strings like 'close-icon' or 'cupboard_icon' to 'CloseActionIcon'."""
        clean_name = re.sub(r"[^a-zA-Z0-9]", " ", name)
        pascal = "".join(word.capitalize() for word in clean_name.split())
        if not pascal.endswith("Icon"):
            pascal += "Icon"
        return pascal

    def format_svg_for_jsx(svg_str: str) -> str:
        """Replaces JSX incompatible attributes and replaces hardcoded strokes/fills with props."""
        # Convert SVG hyphens to camelCase for React JSX
        jsx_replacements = {
            r"\bstroke-width=": "strokeWidth=",
            r"\bstroke-linecap=": "strokeLinecap=",
            r"\bstroke-linejoin=": "strokeLinejoin=",
            r"\bstroke-dasharray=": "strokeDasharray=",
            r"\bfill-opacity=": "fillOpacity=",
            r"\bstroke-opacity=": "strokeOpacity=",
            r"\bviewbox=": "viewBox=",
            r"\bclass=": "className=",
        }

        jsx_svg = svg_str
        for pattern, replacement in jsx_replacements.items():
            jsx_svg = re.sub(pattern, replacement, jsx_svg, flags=re.IGNORECASE)

        # Replace stroke="currentColor" with component prop variable
        jsx_svg = re.sub(
            r'stroke=["\']currentColor["\']', "stroke={strokeColor}", jsx_svg
        )
        
        # Replace fill="currentColor" (shapes taking the stroke color) with strokeColor prop
        jsx_svg = re.sub(
            r'fill=["\']currentColor["\']', "fill={strokeColor}", jsx_svg
        )
        
        # Replace remaining fill attributes (e.g. fill="none") with fillColor prop
        jsx_svg = re.sub(r'fill=["\'][^"\']*["\']', "fill={fillColor}", jsx_svg)

        # Clean out top-level width and height if present so prop sizing works dynamically
        jsx_svg = re.sub(r'\bwidth=["\'][^"\']*["\']', "width={size}", jsx_svg, count=1)
        jsx_svg = re.sub(
            r'\bheight=["\'][^"\']*["\']', "height={size}", jsx_svg, count=1
        )

        # Inject className and {...props} spreading onto the opening <svg> tag
        jsx_svg = re.sub(
            r"<svg\b", "<svg className={className} {...props}", jsx_svg, count=1
        )

        return jsx_svg

    # 1. Boilerplate header
    tsx_output = [
        "import React, { type SVGProps } from 'react';\n",
        "export interface IconProps extends SVGProps<SVGSVGElement> {",
        "  size?: number | string;",
        "  strokeColor?: string;",
        "  fillColor?: string;",
        "}\n",
    ]

    # 2. Process each icon and append component definition
    for name, raw_svg in icon_data:
        component_name = to_pascal_case(name)
        jsx_svg = format_svg_for_jsx(raw_svg)

        # Extract default width/height or fallback to 24
        viewbox_match = re.search(
            r'viewBox=["\']0 0 (\d+) (\d+)["\']', raw_svg, re.IGNORECASE
        )
        default_size = viewbox_match.group(1) if viewbox_match else "24"

        component_code = f"""export const {component_name}: React.FC<IconProps> = ({{
            size = {default_size},
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }}) => (
            {jsx_svg.strip()}
            );
            """
        tsx_output.append(component_code)

    return "\n".join(tsx_output)


if __name__ == "__main__":
    from pathlib import Path

    icon_dir = Path(__file__).parent.parent / "frontend" / "public" / "icons"
    all_icons = list(icon_dir.glob("*_action.svg"))

    icon_names = []
    icons_data = []

    for icon_file in all_icons:
        with open(icon_file, "r", encoding="utf-8") as f:
            svg_content = f.read()
        sanitized_svg = sanitize_svg_colors_only(svg_content)
        icon_names.append(icon_file.stem)
        icons_data.append((icon_file.stem, sanitized_svg))

    # Generate the TypeScript React components for the icons
    icons_tsx_content = generate_icon_tsx(icons_data)
    target_file = Path(__file__).parent.parent / "frontend" / "src" / "action_icons.tsx"
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(icons_tsx_content)