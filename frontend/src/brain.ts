
import type { Brew, Grinder, Recipe, DialIn, DialInRequest, Evaluation, DialInSuggestion, BrewerType, BrewerCategory, Bag } from "./types";

export const calculateAverageEvaluation = (
    evaluations: Evaluation[]
): Omit<Evaluation, 'timestamp' | 'notes'> | null => {
    if (!evaluations || evaluations.length === 0) return null;
    const sum = evaluations.reduce(
        (acc, evalItem) => {
            acc.sweetness += evalItem.sweetness;
            acc.acidity += evalItem.acidity;
            acc.bitterness += evalItem.bitterness;
            acc.body += evalItem.body;
            acc.strength += evalItem.strength;
            return acc;
        },
        { sweetness: 0, acidity: 0, bitterness: 0, body: 0, strength: 0 }
    );

    const count = evaluations.length;
    return {
        sweetness: Math.round(sum.sweetness / count * 10) / 10,
        acidity: Math.round(sum.acidity / count * 10) / 10,
        bitterness: Math.round(sum.bitterness / count * 10) / 10,
        body: Math.round(sum.body / count * 10) / 10,
        strength: Math.round(sum.strength / count * 10) / 10,
    };
};



export const isEspressoMethod = (type: string): boolean => {
    return (
        type === 'Semi Auto Espresso' ||
        type === 'Lever Espresso' ||
        type === 'Super Auto Espresso'
    );
};

export const getBrewerCategory = (brewerType: BrewerType): BrewerCategory => {
    switch (brewerType) {
        case 'V60':
        case 'Flat-Bottom':
        case 'Chemex':
        case 'Drip Machine':
            return 'Pour-Over / Drip';
        case 'AeroPress':
        case 'French-Press':
        case 'Moka Pot':
        case 'Siphon':
        case 'Cold Brew Vessel':
            return 'Immersion / Hybrid';
        case 'Lever Espresso':
        case 'Semi Auto Espresso':
        case 'Super Auto Espresso':
            return 'Espresso';
        case 'Custom':
            return 'Custom';
    }
};


export const getDecimals = (num: number): number => {
    if (Number.isInteger(num)) return 0;
    const str = num.toString();
    return str.includes('.') ? str.split('.')[1].length : 0;
};

export const getGrindPrecision = (grinder: Grinder): number => {
    return Math.max(getDecimals(grinder.stepSize), getDecimals(grinder.scaleMin));
};

export const roundToStep = (
    value: number,
    grinder: Grinder,
): number => {
    // 1. Enforce strict boundary clipping
    const clampedValue = Math.max(grinder.scaleMin, Math.min(grinder.scaleMax, value));

    if (grinder.stepSize <= 0) {
        const precision = getGrindPrecision(grinder) || 1;
        const factor = Math.pow(10, precision);
        return Math.round(clampedValue * factor) / factor;
    }

    // 2. Calculate nearest discrete step relative to scaleMin
    const offsetValue = clampedValue - grinder.scaleMin;
    const steps = Math.round(offsetValue / grinder.stepSize);
    const rawResult = grinder.scaleMin + steps * grinder.stepSize;

    // 3. Ensure step rounding didn't overflow scaleMax
    const finalValue = Math.min(grinder.scaleMax, rawResult);

    // 4. Clean JS floating-point noise using scale-aware precision
    const precision = getGrindPrecision(grinder);
    const factor = Math.pow(10, precision);

    return Math.round(finalValue * factor) / factor;
};



export const getGrind = (grinder: Grinder, recipe: Recipe, grindDelta: number = 0): number => {
    const targetGrind = grinder.scaleMin + (grinder.scaleMax - grinder.scaleMin) * (recipe.grindPct / 100);
    return roundToStep(roundToStep(targetGrind, grinder) + grindDelta, grinder);
};


export const getGrindDelta = (grinder: Grinder, recipe: Recipe, grindDelta: number): number => {
    const roundBaseGrind = getGrind(grinder, recipe);
    const newGrind = roundToStep(roundBaseGrind + grindDelta, grinder);
    return newGrind - roundBaseGrind;
};



export const suggestRequest = (
    brew: Brew,
    recipe: Recipe,
    grinder: Grinder,
    bag: Bag
): DialInSuggestion => {
    if (!brew || !recipe || !grinder || !bag) {
        throw new Error("Missing required parameters for suggestRequest");
    }

    if (!brew.dialIns || brew.dialIns.length === 0) {
        return { request: null, comment: "Not yet dialed-in." };
    }

    const lastDialIn = brew.dialIns[brew.dialIns.length - 1];

    if (!lastDialIn?.evaluations || lastDialIn.evaluations.length === 0) {
        return { request: null, comment: "Last Dial-In has no evaluations." };
    }

    // Calculate Average Evaluation (Will equal exact values if length === 1)
    const sum = lastDialIn.evaluations.reduce(
        (acc, evalItem) => {
            acc.sweetness += evalItem.sweetness;
            acc.acidity += evalItem.acidity;
            acc.bitterness += evalItem.bitterness;
            acc.body += evalItem.body;
            acc.strength += evalItem.strength;
            return acc;
        },
        { sweetness: 0, acidity: 0, bitterness: 0, body: 0, strength: 0 }
    );

    const count = lastDialIn.evaluations.length;
    const avgEval = {
        sweetness: sum.sweetness / count,
        acidity: sum.acidity / count,
        bitterness: sum.bitterness / count,
        body: sum.body / count,
        strength: sum.strength / count,
    };

    const brewerCategory = getBrewerCategory(recipe.type);
    const roastLevel = bag.roastLevel;

    // Emergency Disgusting Flag Check
    if (lastDialIn.isDisgusting) {
        if (avgEval.bitterness >= avgEval.acidity) {
            return { request: 'Less Bitter', comment: "It was disgusting!" };
        }
        return { request: 'Less Acidic', comment: "It was disgusting!" };
    }

    // Group A: Defect Overrides (Check First)
    if (brewerCategory === 'Espresso') {
        if (avgEval.bitterness >= 4.0) return { request: 'Less Bitter', comment: "A little over-extracted." };
        if (avgEval.acidity >= 4.5 && avgEval.sweetness <= 2.0) return { request: 'Less Acidic', comment: "A little under-extracted." };
    }

    if (brewerCategory === 'Pour-Over / Drip') {
        if (avgEval.bitterness >= 3.5) return { request: 'Less Bitter', comment: "A little too bitter." };
        if ((roastLevel === 'Medium' || roastLevel === 'Medium-Dark' || roastLevel === 'Dark') && avgEval.acidity >= 4.0) {
            return { request: 'Less Acidic', comment: "A little too acidic." };
        }
    }

    if (brewerCategory === 'Immersion / Hybrid') {
        if (avgEval.body >= 4.5 && avgEval.bitterness >= 3.5) return { request: 'Less Body', comment: "A little too muddy." };
        if (avgEval.bitterness >= 3.5) return { request: 'Less Bitter', comment: "A little too bitter." };
    }

    if (brewerCategory === 'Custom') {
        if (avgEval.bitterness >= 4.0) return { request: 'Less Bitter', comment: "A little too bitter." };
        if (avgEval.acidity >= 4.5) return { request: 'Less Acidic', comment: "A little too sour." };
    }

    // Group B: Intensity & Strength Check
    if (brewerCategory === 'Espresso') {
        if (avgEval.strength <= 3.0) return { request: 'More Strength', comment: "Not strong enough." };
    }
    if (brewerCategory === 'Pour-Over / Drip') {
        if (avgEval.strength <= 2.0) return { request: 'More Strength', comment: "Not strong enough." };
        if (avgEval.strength >= 4.5) return { request: 'Less Strength', comment: "A little too strong." };
    }
    if (brewerCategory === 'Immersion / Hybrid') {
        if (avgEval.strength <= 2.0) return { request: 'More Strength', comment: "Not strong enough." };
        if (avgEval.strength >= 4.5) return { request: 'Less Strength', comment: "A little too strong." };
    }

    // Group C: Mouthfeel & Body Tuning
    if (brewerCategory === 'Espresso') {
        if (avgEval.body <= 2.5) return { request: 'More Body', comment: "Lacks thickness." };
    }
    if (brewerCategory === 'Pour-Over / Drip') {
        if (avgEval.body <= 1.5) return { request: 'More Body', comment: "Lacks mouthfeel." };
        if (avgEval.body >= 4.0) return { request: 'Less Body', comment: "A little too heavy." };
    }
    if (brewerCategory === 'Immersion / Hybrid') {
        if (avgEval.body <= 2.5) return { request: 'More Body', comment: "Lacks mouthfeel." };
    }

    // Group D: Flavor Balance & Optimization (Fallback)
    if (roastLevel === 'Light' || roastLevel === 'Light-Medium') {
        if (avgEval.acidity <= 2.0) return { request: 'More Acidic', comment: "Lacks brightness." };
        if (avgEval.sweetness <= 3.0) return { request: 'More Sweet', comment: "Not sweet enough." };
    }

    if (roastLevel === 'Dark' || roastLevel === 'Medium-Dark') {
        // Check bitterness first for dark roasts before checking low sweetness
        if (avgEval.bitterness >= 3.0) return { request: 'Less Bitter', comment: "A little too bitter." };
        if (avgEval.sweetness <= 3.0) return { request: 'More Sweet', comment: "Not sweet enough." };
    }

    if (roastLevel === 'Medium' || roastLevel === 'Custom') {
        if (avgEval.sweetness <= 3.0) return { request: 'More Sweet', comment: "Not sweet enough." };
    }

    // Fallback: If coffee is well balanced (3-3.5 across the board)
    return { request: null, comment: "Looks well balanced." };
};

// ============================================================================
// MAIN RECOMMENDATION ENGINE
// ============================================================================

export const suggestDialIn = ({
    brew,
    recipe,
    grinder,
    bag,
    request,
}: {
    brew: Brew;
    recipe: Recipe;
    grinder: Grinder;
    bag: Bag;
    request: DialInRequest;
}): Omit<DialIn, 'timestamp'> => {
    if (!brew || !recipe || !grinder || !bag) {
        throw new Error("Missing required parameters for suggestDialIn");
    }

    // 1. Establish Category & Hardware Context
    const brewerCategory = getBrewerCategory(recipe.type);
    const roastLevel = bag.roastLevel;
    const step = grinder.stepSize > 0 ? grinder.stepSize : 1.0;

    // 2. Extract Last Known State (Default to zero deltas relative to base recipe if no history)
    const lastDialIn = brew.dialIns.length > 0 ? brew.dialIns[brew.dialIns.length - 1] : null;
    const secondToLastDialIn = brew.dialIns.length > 1 ? brew.dialIns[brew.dialIns.length - 2] : null;

    const currentDoseDelta = lastDialIn ? lastDialIn.doseDelta : 0;
    const currentTempDelta = lastDialIn ? lastDialIn.tempDelta : 0;
    const currentGrinderDelta = lastDialIn ? lastDialIn.grinderDelta : 0;

    // Calculate physical starting points for this iteration
    const currentPhysicalDose = recipe.doseGrams + currentDoseDelta;
    const currentPhysicalTemp = recipe.tempC + currentTempDelta;
    const currentPhysicalGrind = getGrind(grinder, recipe, currentGrinderDelta);
    const baseRecipeGrind = getGrind(grinder, recipe, 0);

    // 3. Evaluate Trends & Emergency Multipliers
    const lastEval = lastDialIn?.evaluations.length
        ? calculateAverageEvaluation(lastDialIn.evaluations)
        : null;
    const prevEval = secondToLastDialIn?.evaluations.length
        ? calculateAverageEvaluation(secondToLastDialIn.evaluations)
        : null;

    const lastGrindChange =
        lastDialIn && secondToLastDialIn
            ? lastDialIn.grinderDelta - secondToLastDialIn.grinderDelta
            : 0;

    const emergencyMultiplier = lastDialIn?.isDisgusting ? 2.0 : 1.0;

    // 4. Define Method & Roast Sensitive Step Sizes
    const isEspresso = brewerCategory === 'Espresso';

    let doseStep = isEspresso ? 0.2 : 0.5;
    let tempStep = 1.0;
    let grinderStep = isEspresso ? step : Math.max(step, step * 2);

    // Fine-tune steps for Roast Profile
    if (roastLevel === 'Dark' || roastLevel === 'Medium-Dark') {
        grinderStep *= 1.2; // Coarsen faster on dark roasts to eliminate ashiness
    } else if (roastLevel === 'Light' || roastLevel === 'Light-Medium') {
        tempStep = 0.5; // Finer temperature control to preserve delicate acidity
    }

    // 5. Calculate Physical Target Modifications
    let targetDose = currentPhysicalDose;
    let targetTemp = currentPhysicalTemp;
    let targetGrind = currentPhysicalGrind;

    switch (request) {
        case 'Less Bitter': {
            // Check if last coarsen yielded positive reduction in bitterness
            const didCoarsenWork =
                lastGrindChange > 0 &&
                lastEval &&
                prevEval &&
                lastEval.bitterness < prevEval.bitterness;

            const coarsenAmount = didCoarsenWork
                ? grinderStep * 1.5 * emergencyMultiplier
                : grinderStep * emergencyMultiplier;

            // If grinder is nearing maximum limit, switch lever to lower water temperature
            if (currentPhysicalGrind + coarsenAmount > grinder.scaleMax * 0.85) {
                targetTemp -= tempStep * 2 * emergencyMultiplier;
            } else {
                targetGrind += coarsenAmount;
            }
            break;
        }

        case 'More Bitter': {
            const fineAmount = grinderStep * emergencyMultiplier;
            if (currentPhysicalGrind - fineAmount < grinder.scaleMin * 0.15) {
                targetTemp += tempStep * 2 * emergencyMultiplier;
            } else {
                targetGrind -= fineAmount;
            }
            break;
        }

        case 'Less Acidic': {
            // Under-extraction: Grind finer or increase temperature
            const fineAmount = grinderStep * emergencyMultiplier;
            if (currentPhysicalGrind - fineAmount < grinder.scaleMin * 0.15) {
                targetTemp += tempStep * emergencyMultiplier;
            } else {
                targetGrind -= fineAmount;
            }
            break;
        }

        case 'More Acidic': {
            // Over-extracted or muted: Coarsen grind or drop temp
            if (roastLevel === 'Light' || roastLevel === 'Light-Medium') {
                targetTemp -= tempStep; // Temperature drop preserves fruit clarity better on light roasts
            } else {
                targetGrind += grinderStep * emergencyMultiplier;
            }
            break;
        }

        case 'More Sweet': {
            if (isEspresso) {
                targetDose += doseStep;
            } else {
                targetGrind -= grinderStep * 0.5;
                targetTemp += tempStep;
            }
            break;
        }

        case 'Less Sweet': {
            targetGrind += grinderStep;
            break;
        }

        case 'More Strength': {
            targetDose += doseStep * (isEspresso ? 1.5 : 2.0) * emergencyMultiplier;
            break;
        }

        case 'Less Strength': {
            targetDose -= doseStep * (isEspresso ? 1.5 : 2.0) * emergencyMultiplier;
            break;
        }

        case 'More Body': {
            targetDose += doseStep * 1.5;
            targetGrind -= grinderStep * 0.5;
            break;
        }

        case 'Less Body': {
            targetDose -= doseStep * 1.5;
            targetGrind += grinderStep * 0.5;
            break;
        }

        default:
            break;
    }

    // 6. Apply Safety Clamps to Absolute Physical Targets
    const clampedDose = Math.max(5.0, Math.min(40.0, targetDose));
    const clampedTemp = Math.max(80.0, Math.min(100.0, targetTemp));
    const clampedGrind = roundToStep(targetGrind, grinder);

    // 7. Re-calculate Output Deltas Relative to Immutable Base Recipe
    const finalDoseDelta = Math.round((clampedDose - recipe.doseGrams) * 10) / 10;
    const finalTempDelta = Math.round(clampedTemp - recipe.tempC);
    const finalGrinderDelta = Math.round((clampedGrind - baseRecipeGrind) * 100) / 100;

    return {
        doseDelta: finalDoseDelta,
        tempDelta: finalTempDelta,
        grinderDelta: finalGrinderDelta,
        isDisgusting: false,
        evaluations: [],
    };
};
