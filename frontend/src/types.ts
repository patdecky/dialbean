// --- ENUMS & SCALARS ---
export type RoastLevel = 'Light' | 'Medium' | 'Dark';
export type BrewMethod = 'Pour-Over' | 'Espresso' | 'Immersion' | 'Hybrid' | 'Batch';

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
    roaster?: string;
    roastLevel: RoastLevel;
    roastDate?: string; // ISO String
    dateOpened?: string; // ISO String
    isFinished: boolean;
    isBaseBag: boolean; // true for base bags, false for user-defined bags
    active: boolean;
}


export interface Grinder {
    id: string;
    name: string;
    scaleMin: number;
    scaleMax: number;
    stepSize: number; // e.g., 0.5 or 1.0
    cleanedDate?: string;
    isBaseGrinder: boolean; // true for base grinders, false for user-defined grinders
    active: boolean;
}


export interface Brewer {
    id: string;
    name: string;
    method: BrewMethod;
    cleanedDate?: string;
    isBaseBrewer: boolean; // true for base brewers, false for user-defined brewers
    active: boolean;
}


export interface Recipe {
    id: string;
    name: string;
    brewMethod: BrewMethod;
    waterMl: number;
    doseGrams: number;
    tempC: number;
    grindPct: number; // 0% to 100% relative scale
    instructions: string; // Free-text instructions or markdown
    isBaseRecipe: boolean; // true for base recipes, false for user-defined recipes
    active: boolean;
}



export interface Evaluation {
    id: string;
    timestamp: string; // ISO String
    ratings: Rating;
    notes?: string;
}

export interface Brew {
    id: string;
    name: string;
    bagId: string;
    brewerId: string;
    grinderId: string;
    recipeId: string;
    timestamp: string; // ISO String
    lastUsedTimestamp?: string; // ISO String
    
    // Active Dial-In Levers (Adjusted over time)
    waterDelta: number; // Fixed anchor set by user
    doseDelta: number;
    tempDelta: number;
    grinderDelta: number; // Converted from relative % to actual grinder units
    isDisgusting?: boolean;

    evaluations: Evaluation[];
}

// --- DATABASE ROOT SCHEMA (for LocalStorage / JSON export) ---
export interface DileBeanSchema {
    version: number;
    bags: Bag[];
    grinders: Grinder[];
    brewers: Brewer[];
    recipes: Recipe[];
    brews: Brew[];
}