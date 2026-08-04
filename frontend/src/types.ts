// --- ENUMS & SCALARS ---
export type RoastLevel = 'Light' | 'Medium' | 'Dark';
export type BrewMethod = 'Pour-Over' | 'Espresso' | 'Immersion' | 'Hybrid' | 'Batch';
export type ItemLocation = 'Countertop' | 'Shelf' | 'TrashBin';

export interface SensoryRating {
    sweetness: number;  // 1 to 5
    acidity: number;    // 1 to 5
    bitterness: number; // 1 to 5
    body: number;       // 1 to 5
    strength: number;   // 1 to 5
}

// --- DOMAIN ENTITIES ---
export interface CoffeeBag {
    id: string;
    name: string;
    roaster?: string;
    roastLevel: RoastLevel;
    roastDate?: string; // ISO String
    dateOpened: string; // ISO String
    isFinished: boolean;
    location: ItemLocation;
    // Keeps track of past anchor settings if reopened/restocked
    savedAnchorDialInId?: string;
}

export interface Grinder {
    id: string;
    name: string;
    scaleMin: number;
    scaleMax: number;
    stepSize: number; // e.g., 0.5 or 1.0
    lastCleanedDate?: string;
    location: ItemLocation;
}

export interface Brewer {
    id: string;
    name: string;
    method: BrewMethod;
    maxCapacityMl: number;
    lastCleanedDate?: string;
    location: ItemLocation;
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
}

export interface BrewEvaluation {
    id: string;
    timestamp: string; // ISO String
    ratings: SensoryRating;
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

    // State flags & engine tracking
    isDelicious: boolean;
    evaluations: BrewEvaluation[];
    activeDeadZoneGrindClicks: number[]; // Clicks flagged as "isDisgusting"
}

// --- DATABASE ROOT SCHEMA (for LocalStorage / JSON export) ---
export interface DileBeanStorageSchema {
    version: number;
    bags: CoffeeBag[];
    grinders: Grinder[];
    brewers: Brewer[];
    recipes: Recipe[];
    dialIns: DialIn[];
}