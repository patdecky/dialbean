// --- ENUMS & SCALARS ---
export type RoastLevel = | 'Light'
    | 'Light-Medium'
    | 'Medium'
    | 'Medium-Dark'
    | 'Dark';
export type BrewerType =
    | 'V60'
    | 'Flat-Bottom'
    | 'Chemex'
    | 'AeroPress'
    | 'French-Press'
    | 'Moka-Pot'
    | 'Lever-Espresso'
    | 'Semi-Auto-Espresso'
    | 'Super-Auto-Espresso'
    | 'Drip-Machine'
    | 'Cold-Brew-Vessel'
    | 'Siphon'
    | 'Custom';
export type ItemType = Brewer | Bag | Grinder | Recipe;
export type MachineType = Brewer | Bag | Grinder;



export interface Rating {
    sweetness: number;  // 1 to 5
    acidity: number;    // 1 to 5
    bitterness: number; // 1 to 5
    body: number;       // 1 to 5
    strength: number;   // 1 to 5
}

// --- DOMAIN ENTITIES ---
export interface Bag {
    id: string;
    name: string;
    iconId?: string;
    roaster?: string;
    roastLevel: RoastLevel;
    roastDate?: string; // ISO String
    dateOpened?: string; // ISO String
    isFinished: boolean;
    isBase: boolean; // true for base bags, false for user-defined bags
    active: boolean;
}


export interface Grinder {
    id: string;
    name: string;
    iconId?: string;
    scaleMin: number;
    scaleMax: number;
    stepSize: number; // e.g., 0.5 or 1.0
    cleanedDate?: string;
    isBase: boolean; // true for base grinders, false for user-defined grinders
    active: boolean;
}


export interface Brewer {
    id: string;
    name: string;
    iconId?: string;
    type: BrewerType;
    cleanedDate?: string;
    isBase: boolean; // true for base brewers, false for user-defined brewers
    active: boolean;
}


export interface Recipe {
    id: string;
    name: string;
    type: BrewerType;
    waterMl: number;
    doseGrams: number;
    tempC: number;
    grindPct: number; // 0% to 100% relative scale
    instructions: string; // Free-text instructions or markdown
    isBase: boolean; // true for base recipes, false for user-defined recipes
    active: boolean;
}



export interface Evaluation {
    id: string;
    timestamp: string; // ISO String
    ratings: Rating;
    notes?: string;
}

export interface DialIn {
    waterDelta: number;
    doseDelta: number;
    tempDelta: number;
    grinderDelta: number;
    isDisgusting?: boolean;
    evaluations: Evaluation[];
    timestamp: string; // ISO String
    lastUsedTimestamp?: string; // ISO String
}

export interface Brew {
    id: string;
    name: string;
    bagId: string;
    brewerId: string;
    grinderId: string;
    recipeId: string;
    timestamp: string; // ISO String
    dialIns: DialIn[];
}


// --- DATABASE ROOT SCHEMA (for LocalStorage / JSON export) ---
export interface DialBeanSchema {
    version: number;
    bags: Bag[];
    grinders: Grinder[];
    brewers: Brewer[];
    recipes: Recipe[];
    brews: Brew[];
}