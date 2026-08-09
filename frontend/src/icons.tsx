import { MdCoffeeMaker, MdOutlineCoffeeMaker } from "react-icons/md";
import { GiCoffeePot, GiManualMeatGrinder } from "react-icons/gi";
import { PiCoffeeBean, PiCoffeeBeanDuotone, PiCoffeeBeanFill } from "react-icons/pi";



export const brewer_icons: Record<string, { id: string, icon: React.ComponentType, name: string }> = {
    "1": {
        id: "1",
        icon: MdCoffeeMaker,
        name: "Coffee Maker"
    },
    "2": {
        id: "2",
        icon: GiCoffeePot,
        name: "Coffee Pot"
    },
    "3": {
        id: "3",
        icon: MdOutlineCoffeeMaker,
        name: "Coffee Pot 2"
    }
};

export const grinder_icons: Record<string, { id: string, icon: React.ComponentType, name: string }> = {
    "1": {
        id: "1",
        icon: GiManualMeatGrinder,
        name: "Manual Meat Grinder"
    }
};

export const bag_icons: Record<string, { id: string, icon: React.ComponentType, name: string }> = {
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






