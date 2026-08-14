// import type { Brew, Grinder, Recipe, DialIn, DialInRequest, Evaluation } from "./types";


// const calculateAverageEvaluation = (evaluations: Evaluation[]): Omit<Evaluation, 'timestamp'|"notes"> | null => {
//     if (evaluations.length === 0) return null;
//     const sum = evaluations.reduce((acc, eval) => {
//         acc.sweetness += eval.sweetness;
//         acc.acidity += eval.acidity;
//         acc.bitterness += eval.bitterness;
//         acc.body += eval.body;
//         acc.strength += eval.strength;
//         return acc;
//     }, { sweetness: 0, acidity: 0, bitterness: 0, body: 0, strength: 0 });

//     const count = evaluations.length;
//     return {
//         sweetness: sum.sweetness / count,
//         acidity: sum.acidity / count,
//         bitterness: sum.bitterness / count,
//         body: sum.body / count,
//         strength: sum.strength / count,
//     };
// };

// /**
//  * Helper to round grinder clicks to the nearest valid step increment
//  */
// const roundToStep = (value: number, stepSize: number): number => {
//   if (stepSize <= 0) return Math.round(value * 10) / 10;
//   const steps = Math.round(value / stepSize);
//   return Math.round(steps * stepSize * 100) / 100;
// };

// /**
//  * Checks if the brewer is a pressure-based espresso method
//  */
// const isEspressoMethod = (type: string): boolean => {
//   return (
//     type === 'Semi Auto Espresso' ||
//     type === 'Lever Espresso' ||
//     type === 'Super Auto Espresso'
//   );
// };

// const suggestDialIn = ({ brew, recipe, grinder, request }:
//     {
//         brew: Brew;
//         recipe: Recipe;
//         grinder: Grinder;
//         request: DialInRequest;
//     }): DialIn => {


//     const lastDialIn = brew.dialIns.length > 0 ? brew.dialIns[brew.dialIns.length - 1] : null;
//     const lastDialInAvEval = lastDialIn && lastDialIn.evaluations.length > 0 ? calculateAverageEvaluation(lastDialIn.evaluations) : null;
//     const secondToLastDialIn = brew.dialIns.length > 1 ? brew.dialIns[brew.dialIns.length - 2] : null;
//     const secondToLastDialInAvEval = secondToLastDialIn && secondToLastDialIn.evaluations.length > 0 ? calculateAverageEvaluation(secondToLastDialIn.evaluations) : null;

//     const evaluationChange = lastDialInAvEval && secondToLastDialInAvEval ? {
//         sweetness: lastDialInAvEval.sweetness - secondToLastDialInAvEval.sweetness,
//         acidity: lastDialInAvEval.acidity - secondToLastDialInAvEval.acidity,
//         bitterness: lastDialInAvEval.bitterness - secondToLastDialInAvEval.bitterness,
//         body: lastDialInAvEval.body - secondToLastDialInAvEval.body,
//         strength: lastDialInAvEval.strength - secondToLastDialInAvEval.strength,
//     } : null;

//     const dialInChange = lastDialIn && secondToLastDialIn ? {
//         doseDelta: lastDialIn.doseDelta - secondToLastDialIn.doseDelta,
//         tempDelta: lastDialIn.tempDelta - secondToLastDialIn.tempDelta,
//         grinderDelta: lastDialIn.grinderDelta - secondToLastDialIn.grinderDelta,
//     } : null;

//     switch (request) {
//         case 'Less Bitter':
//             break;
//         case 'More Bitter':
//             break;
//         case 'Less Sweet':
//             break;
//         case 'More Sweet':
//             break;
//         case 'Less Acidic':
//             break;
//         case 'More Acidic':
//             break;
//         case 'Less Body':
//             break;
//         case 'More Body':
//             break;
//         case 'Less Strength':
//             break;
//         case 'More Strength':
//             break;
//     }

// }








import type { Brew, Grinder, Recipe, DialIn, DialInRequest, Evaluation } from "./types";

const calculateAverageEvaluation = (
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
        sweetness: sum.sweetness / count,
        acidity: sum.acidity / count,
        bitterness: sum.bitterness / count,
        body: sum.body / count,
        strength: sum.strength / count,
    };
};

/**
 * Helper to round grinder clicks to the nearest valid step increment
 */
const roundToStep = (value: number, stepSize: number): number => {
    if (stepSize <= 0) return Math.round(value * 10) / 10;
    const steps = Math.round(value / stepSize);
    return Math.round(steps * stepSize * 100) / 100;
};

/**
 * Checks if the brewer is a pressure-based espresso method
 */
const isEspressoMethod = (type: string): boolean => {
    return (
        type === 'Semi Auto Espresso' ||
        type === 'Lever Espresso' ||
        type === 'Super Auto Espresso'
    );
};

export const suggestDialIn = ({
    brew,
    recipe,
    grinder,
    request,
}: {
    brew: Brew;
    recipe: Recipe;
    grinder: Grinder;
    request: DialInRequest;
}): Omit<DialIn, 'timestamp'> => {
    // 1. Establish Current Baseline Deltas
    const lastDialIn =
        brew.dialIns.length > 0 ? brew.dialIns[brew.dialIns.length - 1] : null;

    let currentDoseDelta = lastDialIn ? lastDialIn.doseDelta : 0;
    let currentTempDelta = lastDialIn ? lastDialIn.tempDelta : 0;
    let currentGrinderDelta = lastDialIn ? lastDialIn.grinderDelta : 0;

    const isEspresso = isEspressoMethod(recipe.type);

    // 2. Grinder Bounds & Conversions
    // Convert recipe relative grind % (0-100%) to actual physical clicks
    const minClick = grinder.scaleMin;
    const maxClick = grinder.scaleMax;
    const step = grinder.stepSize > 0 ? grinder.stepSize : 1.0;

    const baseGrindClick = minClick + (recipe.grindPct / 100) * (maxClick - minClick);
    const currentActualClick = baseGrindClick + currentGrinderDelta;

    // Standard step increments based on brewer type
    // Espresso requires finer step adjustments than coarse immersion/filter
    const defaultGrinderStep = isEspresso ? step : Math.max(step, step * 2);
    const defaultTempStep = 1.0; // Minimum 1°C
    const defaultDoseStep = isEspresso ? 0.2 : 0.5; // Minimum 0.1g to 0.5g

    // 3. Analyze Historical Delta Response
    const secondToLastDialIn =
        brew.dialIns.length > 1 ? brew.dialIns[brew.dialIns.length - 2] : null;

    const lastEval =
        lastDialIn && lastDialIn.evaluations.length > 0
            ? calculateAverageEvaluation(lastDialIn.evaluations)
            : null;

    const prevEval =
        secondToLastDialIn && secondToLastDialIn.evaluations.length > 0
            ? calculateAverageEvaluation(secondToLastDialIn.evaluations)
            : null;

    // Did the previous change yield positive progress?
    const deltaGrindHistory =
        lastDialIn && secondToLastDialIn
            ? lastDialIn.grinderDelta - secondToLastDialIn.grinderDelta
            : null;

    // Check emergency 'isDisgusting' multiplier
    const lastWasDisgusting = lastDialIn?.isDisgusting ?? false;
    const emergencyMultiplier = lastWasDisgusting ? 2.0 : 1.0;

    // 4. Extraction Mechanics Matrix (Goal-Driven Tuning)
    let doseAdjustment = 0;
    let tempAdjustment = 0;
    let grinderAdjustment = 0;

    switch (request) {
        case 'Less Bitter':
            // Over-extraction -> Need Coarser Grind (Primary), Lower Temp (Secondary)
            if (
                deltaGrindHistory &&
                deltaGrindHistory > 0 &&
                lastEval &&
                prevEval &&
                lastEval.bitterness < prevEval.bitterness
            ) {
                // Last coarsen worked well, continue in that direction with momentum
                grinderAdjustment = defaultGrinderStep * 1.5 * emergencyMultiplier;
            } else {
                grinderAdjustment = defaultGrinderStep * emergencyMultiplier;
            }

            // If grind is getting very coarse, drop temperature instead
            if (currentActualClick + grinderAdjustment > maxClick * 0.85) {
                grinderAdjustment = 0;
                tempAdjustment = -defaultTempStep * emergencyMultiplier;
            }
            break;

        case 'More Bitter':
            // Under-extracted / flat -> Need Finer Grind or Higher Temp
            grinderAdjustment = -defaultGrinderStep * emergencyMultiplier;
            if (currentActualClick + grinderAdjustment < minClick * 0.15) {
                grinderAdjustment = 0;
                tempAdjustment = defaultTempStep * emergencyMultiplier;
            }
            break;

        case 'Less Acidic':
            // Sharp sourness -> Need Finer Grind (Increases extraction to balance sourness with sweetness)
            grinderAdjustment = -defaultGrinderStep * emergencyMultiplier;
            if (currentActualClick + grinderAdjustment < minClick * 0.15) {
                grinderAdjustment = 0;
                tempAdjustment = defaultTempStep * emergencyMultiplier;
            }
            break;

        case 'More Acidic':
            // Lacks brightness -> Coarser Grind or Lower Temp
            grinderAdjustment = defaultGrinderStep * emergencyMultiplier;
            break;

        case 'More Sweet':
            // Peak extraction window -> Slight finer adjustment or small temp boost
            // If espresso, slight dose boost also unlocks sweetness
            if (isEspresso) {
                doseAdjustment = defaultDoseStep;
            } else {
                grinderAdjustment = -defaultGrinderStep;
                tempAdjustment = defaultTempStep;
            }
            break;

        case 'Less Sweet':
            // Unusual edge request -> Coarsen grind slightly to reduce extraction yield
            grinderAdjustment = defaultGrinderStep;
            break;

        case 'More Strength':
            // Low solubles ratio -> Increase Dose (Primary lever)
            doseAdjustment = defaultDoseStep * emergencyMultiplier * (isEspresso ? 1.5 : 2.0);
            break;

        case 'Less Strength':
            // Too heavy/concentrated -> Decrease Dose
            doseAdjustment = -defaultDoseStep * emergencyMultiplier * (isEspresso ? 1.5 : 2.0);
            break;

        case 'More Body':
            // Watery mouthfeel -> Increase Dose + Finer Grind
            doseAdjustment = defaultDoseStep * 1.5;
            grinderAdjustment = -defaultGrinderStep * 0.5;
            break;

        case 'Less Body':
            // Heavy/muddy -> Decrease Dose + Coarser Grind
            doseAdjustment = -defaultDoseStep * 1.5;
            grinderAdjustment = defaultGrinderStep * 0.5;
            break;

        default:
            break;
    }

    // 5. Apply Adjustments & Respect Physical Bounds

    // A. Dose Limits (Clamp relative dose between -10g and +15g)
    let newDoseDelta = Math.round((currentDoseDelta + doseAdjustment) * 10) / 10;
    const absoluteDose = recipe.doseGrams + newDoseDelta;
    if (absoluteDose < 5.0) {
        newDoseDelta = 5.0 - recipe.doseGrams;
    }

    // B. Temp Limits (Clamp absolute temperature between 80°C and 100°C)
    let newTempDelta = Math.round(currentTempDelta + tempAdjustment);
    const absoluteTemp = recipe.tempC + newTempDelta;
    if (absoluteTemp > 100) {
        newTempDelta = 100 - recipe.tempC;
    } else if (absoluteTemp < 80) {
        newTempDelta = 80 - recipe.tempC;
    }

    // C. Grinder Limits (Ensure new click stays strictly between scaleMin and scaleMax)
    let proposedActualClick = currentActualClick + grinderAdjustment;

    // Snap to valid physical step increments
    const stepsFromMin = Math.round((proposedActualClick - minClick) / step);
    proposedActualClick = minClick + stepsFromMin * step;

    // Hard Clamp to Grinder Bounds
    if (proposedActualClick > maxClick) {
        proposedActualClick = maxClick;
    } else if (proposedActualClick < minClick) {
        proposedActualClick = minClick;
    }

    // Convert absolute click back to grinderDelta relative to base recipe
    const newGrinderDelta = roundToStep(proposedActualClick - baseGrindClick, step);

    // 6. Return New DialIn Instance
    return {
        doseDelta: newDoseDelta,
        tempDelta: newTempDelta,
        grinderDelta: newGrinderDelta,
        isDisgusting: false,
        evaluations: [],
    };
};


