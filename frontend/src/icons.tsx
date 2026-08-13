import type { JSX } from "react/jsx-runtime";
import type { BrewerType } from "./types";

type Icon = (props: React.ComponentProps<"img">) => JSX.Element;

const machineIcon = (source: string, alt: string) => (props: React.ComponentProps<"img">) => (
    <img src={`/icons/${source}`} alt={alt} {...props} />
);

export const AcidityIcon = machineIcon("machine_icons_acidity.svg", "Acidity");
export const AddIcon = machineIcon("machine_icons_add.svg", "Add");
export const AeropressIcon = machineIcon("machine_icons_aeropress.svg", "Aeropress");
export const AutoEspressoIcon = machineIcon("machine_icons_auto_espresso.svg", "Auto Espresso");
export const AutoGrinderIcon = machineIcon("machine_icons_auto_grinder.svg", "Automatic Grinder");
export const BagClosedLightIcon = machineIcon("machine_icons_bag_closed_light.svg", "Closed Coffee Bag");
export const BagDoneCustomIcon = machineIcon("machine_icons_bag_done_custom.svg", "Custom Finished Coffee Bag");
export const BagDoneDarkIcon = machineIcon("machine_icons_bag_done_dark.svg", "Dark Finished Coffee Bag");
export const BagDoneLightIcon = machineIcon("machine_icons_bag_done_light.svg", "Light Finished Coffee Bag");
export const BagDoneLightMidIcon = machineIcon("machine_icons_bag_done_light_mid.svg", "Light-Medium Finished Coffee Bag");
export const BagDoneMidIcon = machineIcon("machine_icons_bag_done_mid.svg", "Medium Finished Coffee Bag");
export const BagDoneMidDarkIcon = machineIcon("machine_icons_bag_done_mid_dark.svg", "Medium-Dark Finished Coffee Bag");
export const BagNewCustomIcon = machineIcon("machine_icons_bag_new_custom.svg", "Custom New Coffee Bag");
export const BagNewDarkIcon = machineIcon("machine_icons_bag_new_dark.svg", "Dark New Coffee Bag");
export const BagNewLightMidIcon = machineIcon("machine_icons_bag_new_light_mid.svg", "Light-Medium New Coffee Bag");
export const BagNewMidIcon = machineIcon("machine_icons_bag_new_mid.svg", "Medium New Coffee Bag");
export const BagNewMidDarkIcon = machineIcon("machine_icons_bag_new_mid_dark.svg", "Medium-Dark New Coffee Bag");
export const BagOpenCustomIcon = machineIcon("machine_icons_bag_open_custom.svg", "Custom Open Coffee Bag");
export const BagOpenDarkIcon = machineIcon("machine_icons_bag_open_dark.svg", "Dark Open Coffee Bag");
export const BagOpenLightIcon = machineIcon("machine_icons_bag_open_light.svg", "Light Open Coffee Bag");
export const BagOpenLightMidIcon = machineIcon("machine_icons_bag_open_light_mid.svg", "Light-Medium Open Coffee Bag");
export const BagOpenMidIcon = machineIcon("machine_icons_bag_open_mid.svg", "Medium Open Coffee Bag");
export const BagOpenMidDarkIcon = machineIcon("machine_icons_bag_open_mid_dark.svg", "Medium-Dark Open Coffee Bag");
export const BitterIcon = machineIcon("machine_icons_bitter.svg", "Bitter");
export const BodyIcon = machineIcon("machine_icons_body.svg", "Body");
export const BrewIcon = machineIcon("machine_icons_brew.svg", "Brew");
export const ChemexIcon = machineIcon("machine_icons_chemex.svg", "Chemex");
export const ColdBrewIcon = machineIcon("machine_icons_cold_brew.svg", "Cold Brew");
export const CustomBrewerIcon = machineIcon("machine_icons_custom.svg", "Custom Brewer");
export const CloseIcon = machineIcon("machine_icons_close.svg", "Close");
export const CookbookIcon = machineIcon("machine_icons_cookbook.svg", "Cookbook");
export const CounterIcon = machineIcon("machine_icons_counter.svg", "Counter");
export const CupboardIcon = machineIcon("machine_icons_cupboard.svg", "Cupboard");
export const DripIcon = machineIcon("machine_icons_drip.svg", "Drip");
export const DialIcon = machineIcon("machine_icons_dial.svg", "Dial");
export const DialBeanLargeIcon = machineIcon("machine_icons_dial_bean_lg.svg", "Dial Bean Large");
export const DialBeanMediumIcon = machineIcon("machine_icons_dial_bean_md.svg", "Dial Bean Medium");
export const DialBeanSmallIcon = machineIcon("machine_icons_dial_bean_sm.svg", "Dial Bean Small");
export const EvaluationIcon = machineIcon("machine_icons_eval.svg", "Evaluation");
export const FrenchPressIcon = machineIcon("machine_icons_french_press.svg", "French Press");
export const FlatBottomIcon = machineIcon("machine_icons_flat_bottom.svg", "Flat Bottom");
export const GrindIcon = machineIcon("machine_icons_grind.svg", "Grind");
export const InfoIcon = machineIcon("machine_icons_info.svg", "Information");
export const KettleIcon = machineIcon("machine_icons_kettle.svg", "Kettle");
export const ManualGrinderIcon = machineIcon("machine_icons_manual_grinder.svg", "Manual Grinder");
export const LeverEspressoIcon = machineIcon("machine_icons_lever_espresso.svg", "Lever Espresso");
export const MocaIcon = machineIcon("machine_icons_moca.svg", "Moca");
export const SemiEspressoIcon = machineIcon("machine_icons_semi_espresso.svg", "Semi Espresso");
export const SemiGrinderIcon = machineIcon("machine_icons_semi_grinder.svg", "Semi-Automatic Grinder");
export const SiphonIcon = machineIcon("machine_icons_siphon.svg", "Siphon");
export const StrengthIcon = machineIcon("machine_icons_strength.svg", "Strength");
export const SweetIcon = machineIcon("machine_icons_sweet.svg", "Sweet");
export const TemperatureIcon = machineIcon("machine_icons_temp.svg", "Temperature");
export const V60Icon = machineIcon("machine_icons_v60.svg", "V60");
export const VintageGrinderIcon = machineIcon("machine_icons_vintage_grinder.svg", "Vintage Grinder");
export const WaterIcon = machineIcon("machine_icons_water.svg", "Water");
export const WeightIcon = machineIcon("machine_icons_weight.svg", "Weight");
export const XIcon = machineIcon("machine_icons_x.svg", "Close");
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

export const bag_icons: Record<string, IconRegistryEntry> = {
    "1": {
        id: "1",
        icon: BagNewLightMidIcon,
        name: "Light New Coffee Bag"
    },
    "2": {
        id: "2",
        icon: BagNewMidIcon,
        name: "Medium New Coffee Bag"
    },
    "3": {
        id: "3",
        icon: BagNewDarkIcon,
        name: "Dark New Coffee Bag"
    },
    "4": {
        id: "4",
        icon: BagClosedLightIcon,
        name: "Closed Coffee Bag"
    },
    "5": {
        id: "5",
        icon: BagNewCustomIcon,
        name: "Custom New Coffee Bag"
    },
    "6": {
        id: "6",
        icon: BagNewMidDarkIcon,
        name: "Medium-Dark New Coffee Bag"
    },
    "7": {
        id: "7",
        icon: BagOpenCustomIcon,
        name: "Custom Open Coffee Bag"
    },
    "8": {
        id: "8",
        icon: BagOpenLightIcon,
        name: "Light Open Coffee Bag"
    },
    "9": {
        id: "9",
        icon: BagOpenLightMidIcon,
        name: "Light-Medium Open Coffee Bag"
    },
    "10": {
        id: "10",
        icon: BagOpenMidIcon,
        name: "Medium Open Coffee Bag"
    },
    "11": {
        id: "11",
        icon: BagOpenMidDarkIcon,
        name: "Medium-Dark Open Coffee Bag"
    },
    "12": {
        id: "12",
        icon: BagOpenDarkIcon,
        name: "Dark Open Coffee Bag"
    },
    "13": {
        id: "13",
        icon: BagDoneCustomIcon,
        name: "Custom Finished Coffee Bag"
    },
    "14": {
        id: "14",
        icon: BagDoneLightIcon,
        name: "Light Finished Coffee Bag"
    },
    "15": {
        id: "15",
        icon: BagDoneLightMidIcon,
        name: "Light-Medium Finished Coffee Bag"
    },
    "16": {
        id: "16",
        icon: BagDoneMidIcon,
        name: "Medium Finished Coffee Bag"
    },
    "17": {
        id: "17",
        icon: BagDoneMidDarkIcon,
        name: "Medium-Dark Finished Coffee Bag"
    },
    "18": {
        id: "18",
        icon: BagDoneDarkIcon,
        name: "Dark Finished Coffee Bag"
    }
};






