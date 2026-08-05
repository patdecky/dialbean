// --- ENUMS & SCALARS ---
export type RoastLevel = 'Light' | 'Medium' | 'Dark';
export type BrewMethod = 'Pour-Over' | 'Espresso' | 'Immersion' | 'Hybrid' | 'Batch';
export type ItemLocation = 'Countertop' | 'Shelf' | 'TrashBin';

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
    isBaseBag: boolean; // true if this is a base bag, false if it's a user-created variant
    roaster?: string;
    roastLevel: RoastLevel;
    roastDate?: string; // ISO String
    dateOpened: string; // ISO String
    isFinished: boolean;
}

export interface Grinder {
    id: string;
    name: string;
    isBaseGrinder: boolean; // true if this is a base grinder, false if it's a user-created variant
    scaleMin: number;
    scaleMax: number;
    stepSize: number; // e.g., 0.5 or 1.0
    cleanedDate?: string;
}

export interface Brewer {
    id: string;
    isBaseBrewer: boolean; // true if this is a base brewer, false if it's a user-created variant
    name: string;
    method: BrewMethod;
    maxCapacityMl: number;
    cleanedDate?: string;
    location: ItemLocation;
}


export interface Recipe {
    id: string;
    name: string;
    isBaseRecipe: boolean; // true if this is a base recipe, false if it's a user-created variant
    brewMethod: BrewMethod;
    waterMl: number;
    doseGrams: number;
    tempC: number;
    grindPct: number; // 0% to 100% relative scale
    instructions: string; // Free-text instructions or markdown
}

export interface Evaluation {
    id: string;
    timestamp: string; // ISO String
    ratings: Rating;
    isDelicious: boolean;
    isDisgusting: boolean;
    notes?: string;
}

export interface DialIn {
    id: string;
    bagId: string;
    brewerId: string;
    grinderId: string;
    baseRecipeId: string;

    // Active Dial-In Levers (Adjusted over time)
    currentWaterMl: number; // Fixed anchor set by user
    currentDoseGrams: number;
    currentTempC: number;
    currentGrindClick: number; // Converted from relative % to actual grinder units

    evaluations: Evaluation[];
}

// --- DATABASE ROOT SCHEMA (for LocalStorage / JSON export) ---
export interface DileBeanSchema {
    version: number;
    bags: Bag[];
    grinders: Grinder[];
    brewers: Brewer[];
    recipes: Recipe[];
    dialIns: DialIn[];
}