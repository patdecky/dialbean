import type { JSX } from "react/jsx-runtime";
import type { BrewerType } from "./types";

export type Icon = (props: React.ComponentProps<"img">) => JSX.Element;

const makeIcon = (source: string, alt: string) => (props: React.ComponentProps<"img">) => (
    <img src={`/icons/${source}`} alt={alt} {...props} />
);

export const AcidityIcon = makeIcon("acidity.svg", "Acidity");
export const AeropressIcon = makeIcon("aeropress.svg", "Aeropress");
export const AutoEspressoIcon = makeIcon("auto_espresso.svg", "Auto Espresso");
export const AutoGrinderIcon = makeIcon("auto_grinder.svg", "Automatic Grinder");
export const BagDoneCustomIcon = makeIcon("bag_done_custom.svg", "Finished Custom Roast Bag");
export const BagDoneDarkIcon = makeIcon("bag_done_dark.svg", "Finished Dark Roast Bag");
export const BagDoneLightIcon = makeIcon("bag_done_light.svg", "Finished Light Roast Bag");
export const BagDoneLightMidIcon = makeIcon("bag_done_light_mid.svg", "Finished Light-Medium Roast Bag");
export const BagDoneMidIcon = makeIcon("bag_done_mid.svg", "Finished Medium Roast Bag");
export const BagDoneMidDarkIcon = makeIcon("bag_done_mid_dark.svg", "Finished Medium-Dark Roast Bag");
export const BagNewCustomIcon = makeIcon("bag_new_custom.svg", "New Custom Roast Bag");
export const BagNewDarkIcon = makeIcon("bag_new_dark.svg", "New Dark Roast Bag");
export const BagNewLightMidIcon = makeIcon("bag_new_light_mid.svg", "New Light-Medium Roast Bag");
export const BagNewLightIcon = makeIcon("bag_new_light.svg", "New Light Roast Bag");
export const BagNewMidIcon = makeIcon("bag_new_mid.svg", "New Medium Roast Bag");
export const BagNewMidDarkIcon = makeIcon("bag_new_mid_dark.svg", "New Medium-Dark Roast Bag");
export const BagOpenCustomIcon = makeIcon("bag_open_custom.svg", "Open Custom Roast Bag");
export const BagOpenDarkIcon = makeIcon("bag_open_dark.svg", "Open Dark Roast Bag");
export const BagOpenLightIcon = makeIcon("bag_open_light.svg", "Open Light Roast Bag");
export const BagOpenLightMidIcon = makeIcon("bag_open_light_mid.svg", "Open Light-Medium Roast Bag");
export const BagOpenMidIcon = makeIcon("bag_open_mid.svg", "Open Medium Roast Bag");
export const BagOpenMidDarkIcon = makeIcon("bag_open_mid_dark.svg", "Open Medium-Dark Roast Bag");
export const BitterIcon = makeIcon("bitter.svg", "Bitter");
export const BodyIcon = makeIcon("body.svg", "Body");
export const BrewIcon = makeIcon("brew.svg", "Brew");
export const ChemexIcon = makeIcon("chemex.svg", "Chemex");
export const ColdBrewIcon = makeIcon("cold_brew.svg", "Cold Brew");
export const CookbookIcon = makeIcon("cookbook.svg", "Cookbook");
export const CounterIcon = makeIcon("counter.svg", "Counter");
export const CupboardIcon = makeIcon("cupboard.svg", "Cupboard");
export const CustomBrewerIcon = makeIcon("custom.svg", "Custom Brewer");
export const DripIcon = makeIcon("drip.svg", "Drip");
export const DialIcon = makeIcon("dial.svg", "Dial");
export const DialBeanLargeIcon = makeIcon("dial_bean_lg.svg", "Dial Bean Large");
export const DialBeanMediumIcon = makeIcon("dial_bean_md.svg", "Dial Bean Medium");
export const DialBeanSmallIcon = makeIcon("dial_bean_sm.svg", "Dial Bean Small");
export const EvaluationIcon = makeIcon("eval.svg", "Evaluation");
export const FrenchPressIcon = makeIcon("french_press.svg", "French Press");
export const FlatBottomIcon = makeIcon("flat_bottom.svg", "Flat Bottom");
export const GrindIcon = makeIcon("grind.svg", "Grind");
export const KettleIcon = makeIcon("kettle.svg", "Kettle");
export const ManualGrinderIcon = makeIcon("manual_grinder.svg", "Manual Grinder");
export const LeverEspressoIcon = makeIcon("lever_espresso.svg", "Lever Espresso");
export const MocaIcon = makeIcon("moca.svg", "Moca");
export const SemiEspressoIcon = makeIcon("semi_espresso.svg", "Semi Espresso");
export const SemiGrinderIcon = makeIcon("semi_grinder.svg", "Semi-Automatic Grinder");
export const SiphonIcon = makeIcon("siphon.svg", "Siphon");
export const StrengthIcon = makeIcon("strength.svg", "Strength");
export const SweetIcon = makeIcon("sweet.svg", "Sweet");
export const TemperatureIcon = makeIcon("temp.svg", "Temperature");
export const V60Icon = makeIcon("v60.svg", "V60");
export const VintageGrinderIcon = makeIcon("vintage_grinder.svg", "Vintage Grinder");
export const WaterIcon = makeIcon("water.svg", "Water");
export const WeightIcon = makeIcon("weight.svg", "Weight");
type IconRegistryEntry = { id: string; icon: Icon; name: string; };
type BagIconRegistryEntry = { id: string; icon_new: Icon; icon_open: Icon; icon_done: Icon; name: string; };
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
        type: "Moka Pot"
    },
    "7": {
        id: "7",
        icon: LeverEspressoIcon,
        name: "Lever Espresso",
        type: "Lever Espresso"
    },
    "8": {
        id: "8",
        icon: SemiEspressoIcon,
        name: "Semi Auto Espresso",
        type: "Semi Auto Espresso"
    },
    "9": {
        id: "9",
        icon: AutoEspressoIcon,
        name: "Super Auto Espresso",
        type: "Super Auto Espresso"
    },
    "10": {
        id: "10",
        icon: DripIcon,
        name: "Drip Machine",
        type: "Drip Machine"
    },
    "11": {
        id: "11",
        icon: ColdBrewIcon,
        name: "Cold Brew Vessel",
        type: "Cold Brew Vessel"
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
        icon: ManualGrinderIcon,
        name: "Manual Grinder"
    },
    "2": {
        id: "2",
        icon: SemiGrinderIcon,
        name: "Semi-Automatic Grinder"
    },
    "3": {
        id: "3",
        icon: AutoGrinderIcon,
        name: "Automatic Grinder"
    },
    "4": {
        id: "4",
        icon: VintageGrinderIcon,
        name: "Vintage Grinder"
    }
};

export const bag_icons: Record<string, BagIconRegistryEntry> = {
    "1": {
        id: "1",
        icon_new: BagNewLightIcon,
        icon_open: BagOpenLightIcon,
        icon_done: BagDoneLightIcon,
        name: "Light Roast Bag"
    },
    "2": {
        id: "2",
        icon_new: BagNewLightMidIcon,
        icon_open: BagOpenLightMidIcon,
        icon_done: BagDoneLightMidIcon,
        name: "Light-Medium Roast Bag"
    },
    "3": {
        id: "3",
        icon_new: BagNewMidIcon,
        icon_open: BagOpenMidIcon,
        icon_done: BagDoneMidIcon,
        name: "Medium Roast Bag"
    },
    "4": {
        id: "4",
        icon_new: BagNewMidDarkIcon,
        icon_open: BagOpenMidDarkIcon,
        icon_done: BagDoneMidDarkIcon,
        name: "Medium-Dark Roast Bag"
    },
    "5": {
        id: "5",
        icon_new: BagNewDarkIcon,
        icon_open: BagOpenDarkIcon,
        icon_done: BagDoneDarkIcon,
        name: "Dark Roast Bag"
    },
    "6": {
        id: "6",
        icon_new: BagNewCustomIcon,
        icon_open: BagOpenCustomIcon,
        icon_done: BagDoneCustomIcon,
        name: "Custom Roast Bag"
    }
};






