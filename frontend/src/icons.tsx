import { GiManualMeatGrinder } from "react-icons/gi";
import { PiCoffeeBean, PiCoffeeBeanDuotone, PiCoffeeBeanFill } from "react-icons/pi";
import type { IconType } from "react-icons";
import type { JSX } from "react/jsx-runtime";
import type { BrewerType } from "./types";

type Icon = IconType | ((props: React.ComponentProps<"img">) => JSX.Element);

export const AeropressIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_aeropress.svg" alt="Aeropress" {...props} />
);
export const AutoEspressoIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_auto_espresso.svg" alt="Auto Espresso" {...props} />
);
export const ChemexIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_chemex.svg" alt="Chemex" {...props} />
);
export const ColdBrewIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_cold_brew.svg" alt="Cold Brew" {...props} />
);
export const DripIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_drip.svg" alt="Drip" {...props} />
);
export const FrenchPressIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_french_press.svg" alt="French Press" {...props} />
);
export const LeverEspressoIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_lever_espresso.svg" alt="Lever Espresso" {...props} />
);
export const MocaIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_moca.svg" alt="Moca" {...props} />
);
export const FlatBottomIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_flat_bottom.svg" alt="Flat Bottom" {...props} />
);
export const SemiEspressoIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_semi_espresso.svg" alt="Semi Espresso" {...props} />
);
export const V60Icon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_v60.svg" alt="V60" {...props} />
);
export const SiphonIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_siphon.svg" alt="Siphon" {...props} />
);
export const CustomBrewerIcon = (props: React.ComponentProps<"img">) => (
    <img src="/icons/machine_icons_custom.svg" alt="Custom Brewer" {...props} />
);


type IconRegistryEntry = { id: string; icon: Icon; name: string; };
type BrewerIconRegistryEntry = { id: string; icon: Icon; name: string; type: BrewerType };

export const brewer_icons: Record<string, BrewerIconRegistryEntry> = {
    "1": {
        id: "1",
        icon: AeropressIcon,
        name: "AeroPress",
        type: "AeroPress"
    },
    "2": {
        id: "2",
        icon: V60Icon,
        name: "V60",
        type: "V60"
    },
    "3": {
        id: "3",
        icon: FlatBottomIcon,
        name: "Flat-Bottom",
        type: "Flat-Bottom"
    },
    "4": {
        id: "4",
        icon: ChemexIcon,
        name: "Chemex",
        type: "Chemex"
    },
    "5": {
        id: "5",
        icon: FrenchPressIcon,
        name: "French-Press",
        type: "French-Press"
    },
    "6": {
        id: "6",
        icon: MocaIcon,
        name: "Moka Pot",
        type: "Moka-Pot"
    },
    "7": {
        id: "7",
        icon: LeverEspressoIcon,
        name: "Lever Espresso",
        type: "Lever-Espresso"
    },
    "8": {
        id: "8",
        icon: SemiEspressoIcon,
        name: "Semi Auto Espresso",
        type: "Semi-Auto-Espresso"
    },
    "9": {
        id: "9",
        icon: AutoEspressoIcon,
        name: "Super Auto Espresso",
        type: "Super-Auto-Espresso"
    },
    "10": {
        id: "10",
        icon: DripIcon,
        name: "Drip Machine",
        type: "Drip-Machine"
    },
    "11": {
        id: "11",
        icon: ColdBrewIcon,
        name: "Cold Brew Vessel",
        type: "Cold-Brew-Vessel"
    },
    "12": {
        id: "12",
        icon: SiphonIcon,
        name: "Siphon",
        type: "Siphon"
    },
    "13": {
        id: "13",
        icon: CustomBrewerIcon,
        name: "Custom",
        type: "Custom"
    }
};

export const grinder_icons: Record<string, IconRegistryEntry> = {
    "1": {
        id: "1",
        icon: GiManualMeatGrinder,
        name: "Manual Meat Grinder"
    }
};

export const bag_icons: Record<string, IconRegistryEntry> = {
    "1": {
        id: "1",
        icon: PiCoffeeBean,
        name: "Coffee Light"
    },
    "2": {
        id: "2",
        icon: PiCoffeeBeanDuotone,
        name: "Coffee Medium"
    },
    "3": {
        id: "3",
        icon: PiCoffeeBeanFill,
        name: "Coffee Dark"
    }
};






