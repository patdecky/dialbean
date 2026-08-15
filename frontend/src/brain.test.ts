import { describe, test, expect } from 'vitest';
import { roundToStep, getGrindPrecision, getGrind, getGrindDelta, calculateAverageEvaluation, getDecimals, suggestRequest } from './brain';
import type { Bag, Brew, DialIn, Evaluation, Grinder, Recipe } from './types';


describe('Grind Step Calculation Logic', () => {

    describe('getGrindPrecision', () => {
        test('returns correct decimal for values', () => {
            expect(getDecimals(1.23)).toBe(2);
            expect(getDecimals(-1.23)).toBe(2);
            expect(getDecimals(1)).toBe(0);
            expect(getDecimals(0)).toBe(0);
            expect(getDecimals(0.001)).toBe(3);
        });
        test('returns correct precision based on max decimal depth', () => {
            const grinder = { stepSize: 0.25, scaleMin: 0.05 } as Grinder;
            expect(getGrindPrecision(grinder)).toBe(2);
            const grinder2 = { stepSize: 1, scaleMin: 0.5 } as Grinder;
            expect(getGrindPrecision(grinder2)).toBe(1);
            const grinder3 = { stepSize: 2, scaleMin: 3 } as Grinder;
            expect(getGrindPrecision(grinder3)).toBe(0);
            const grinder4 = { stepSize: 0.001, scaleMin: 1 } as Grinder;
            expect(getGrindPrecision(grinder4)).toBe(3);
            const grinder5 = { stepSize: 1, scaleMin: 0.001 } as Grinder;
            expect(getGrindPrecision(grinder5)).toBe(3);
        });
        test("returns correct decimal places for negative stepSize or scaleMin", () => {
            const grinder = { stepSize: -0.25, scaleMin: 0.5 } as Grinder;
            expect(getGrindPrecision(grinder)).toBe(2);
            const grinder2 = { stepSize: 1, scaleMin: -0.5 } as Grinder;
            expect(getGrindPrecision(grinder2)).toBe(1);
        });

    });

    describe('roundToStep', () => {
        test('aligns steps to scaleMin baseline offset', () => {
            // Valid clicks for step 1.5 with min 10: 10, 11.5, 13.0, 14.5...
            const grinder = { scaleMin: 10, scaleMax: 30, stepSize: 1.5 } as Grinder;
            expect(roundToStep(14.5, grinder)).toBe(14.5);
            expect(roundToStep(14.0, grinder)).toBe(14.5);
            expect(roundToStep(13.8, grinder)).toBe(14.5);
            expect(roundToStep(13.75001, grinder)).toBe(14.5);
            expect(roundToStep(13.6, grinder)).toBe(13.0);
        });

        test('clips values exceeding scaleMax', () => {
            const grinder = { scaleMin: 10, scaleMax: 30, stepSize: 1.5 } as Grinder;
            expect(roundToStep(42, grinder)).toBe(29.5);
        });

        test('clips values below scaleMin', () => {
            const grinder = { scaleMin: 0, scaleMax: 30, stepSize: 1 } as Grinder;
            expect(roundToStep(-5, grinder)).toBe(0);
        });

        test('prevents floating-point noise artifacts', () => {
            const grinder = { scaleMin: 1.1, scaleMax: 5.5, stepSize: 0.1 } as Grinder;
            expect(roundToStep(1.3, grinder)).toBe(1.3);
        });
    });

    describe('getGrind', () => {
        test('calculates correct base grind click for recipe percentage', () => {
            const grinder = { scaleMin: 10, scaleMax: 30, stepSize: 1.5 } as Grinder;
            const recipe = { grindPct: 20 } as Recipe; // 10 + (20) * 0.2 = 14.0 -> rounded to 14.5

            expect(getGrind(grinder, recipe, 0)).toBe(14.5);
        });

        test('calculates correct base grind with delta', () => {
            const grinder = { scaleMin: 10, scaleMax: 30, stepSize: 1.5 } as Grinder;
            const recipe = { grindPct: 20 } as Recipe; // 10 + (20) * 0.2 = 14.0 -> rounded to 14.5

            expect(getGrind(grinder, recipe, 0)).toBe(14.5);
            expect(getGrind(grinder, recipe, 1)).toBe(16.0); // delta shall work on top of the base grind
        });

    });

    describe('getGrindDelta', () => {
        test('calculates correct grind delta', () => {
            const grinder = { scaleMin: 10, scaleMax: 30, stepSize: 1.5 } as Grinder;
            const recipe = { grindPct: 20 } as Recipe; // 10 + (20) * 0.2 = 14.0 -> rounded to 14.5
            expect(getGrindDelta(grinder, recipe, 1)).toBe(1.5);
            // might seem like recipe is rounded to 14, so -1.5 would be 12.5, 
            // resulting in a delta of -2 from 14.5, but the correct is -1.5, since we care only about the real percieved step
            expect(getGrindDelta(grinder, recipe, -1.5)).toBe(-1.5);
        });
    });
});

describe("Evaluation Logic Tests", () => {
    describe("Evaluation Average", () => {
        test("calculates average evaluation correctly", () => {
            const evaluations = [
                { sweetness: 3, acidity: 4, bitterness: 2, body: 5, strength: 3 } as Evaluation,
                { sweetness: 4, acidity: 3, bitterness: 3, body: 4, strength: 4 } as Evaluation,
                { sweetness: 2, acidity: 5, bitterness: 1, body: 3, strength: 2 } as Evaluation
            ];
            const averageEvaluation = calculateAverageEvaluation(evaluations);
            expect(averageEvaluation).toEqual({
                sweetness: 3,
                acidity: 4,
                bitterness: 2,
                body: 4,
                strength: 3
            });
        });
        test("round to one decimal place", () => {
            const evaluations = [
                { sweetness: 1, acidity: 1, bitterness: 2, body: 2, strength: 1 } as Evaluation,
                { sweetness: 2, acidity: 2, bitterness: 2, body: 2, strength: 3 } as Evaluation,
                { sweetness: 4, acidity: 5, bitterness: 4, body: 5, strength: 1 } as Evaluation
            ];
            const averageEvaluation = calculateAverageEvaluation(evaluations);
            expect(averageEvaluation).toEqual({
                sweetness: 2.3,
                acidity: 2.7,
                bitterness: 2.7,
                body: 3,
                strength: 1.7
            });
        });
    });

});

describe("Request Suggestion Logic Tests", () => {
    describe("Edge cases", () => {
        test("suggest request defaults", () => {
            const brew = {} as Brew;
            const recipe = {} as Recipe;
            const grinder = {} as Grinder;
            const bag = {} as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe(null);
        });
        test("dont optimize without evals", () => {
            const brew = { dialIns: [{ evaluations: [] } as unknown as DialIn] } as Brew; // Intentionally suppress the incomplete test-fixture type warning.
            const recipe = {} as Recipe;
            const grinder = {} as Grinder;
            const bag = {} as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe(null);
        });
        test("dont optimize good enough", () => {
            const evaluation = { sweetness: 3, acidity: 3, bitterness: 3, body: 3, strength: 3 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = {} as Recipe;
            const grinder = {} as Grinder;
            const bag = {} as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe(null);
        });
        test("optimize over-extracted espresso", () => {
            const evaluation = { sweetness: 3, acidity: 3, bitterness: 5, body: 3, strength: 3 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Semi Auto Espresso" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Bitter");
        });
    });
    describe("Espresso Category", () => {
        test("optimize over-extracted espresso (high bitterness)", () => {
            const evaluation = { sweetness: 3, acidity: 2, bitterness: 4.5, body: 4, strength: 5 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Semi Auto Espresso" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Bitter");
        });

        test("optimize sour under-extracted espresso (high acidity, low sweetness)", () => {
            const evaluation = { sweetness: 1.5, acidity: 4.5, bitterness: 2, body: 3, strength: 4 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Lever Espresso" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Acidic");
        });

        test("ignore high strength in espresso (strength 5 is acceptable)", () => {
            const evaluation = { sweetness: 3.5, acidity: 3, bitterness: 2.5, body: 4, strength: 5 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Semi Auto Espresso" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).not.toBe("Less Strength");
        });

        test("optimize watery espresso (low strength)", () => {
            const evaluation = { sweetness: 3, acidity: 3, bitterness: 3, body: 3, strength: 2.9 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Super Auto Espresso" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("More Strength");
        });

        test("optimize thin espresso mouthfeel (low body)", () => {
            const evaluation = { sweetness: 3, acidity: 3, bitterness: 2.5, body: 2.0, strength: 3.5 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Semi Auto Espresso" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("More Body");
        });
    });

    // =========================================================================
    // GROUP B: DRIP & POUR-OVER CATEGORY TESTS
    // =========================================================================
    describe("Drip & Pour-Over Category", () => {
        test("optimize bitter V60 pour-over (bitterness threshold >= 3.5)", () => {
            const evaluation = { sweetness: 2.5, acidity: 2.5, bitterness: 3.5, body: 3, strength: 3 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "V60" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Bitter");
        });

        test("optimize overly dense filter coffee (high strength >= 4.5)", () => {
            const evaluation = { sweetness: 3, acidity: 3, bitterness: 2.5, body: 3.5, strength: 4.5 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Chemex" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Strength");
        });

        test("optimize clogged filter bed (high body >= 4.0)", () => {
            const evaluation = { sweetness: 3, acidity: 2.5, bitterness: 3.0, body: 4.2, strength: 3.5 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Flat-Bottom" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Body");
        });

        test("optimize weak drip machine coffee (low strength <= 2.0)", () => {
            const evaluation = { sweetness: 2.5, acidity: 2, bitterness: 2, body: 2, strength: 1.8 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Drip Machine" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("More Strength");
        });
    });

    // =========================================================================
    // GROUP C: IMMERSION & HYBRID CATEGORY TESTS
    // =========================================================================
    describe("Immersion & Hybrid Category", () => {
        test("optimize muddy French Press (high body & high bitterness)", () => {
            const evaluation = { sweetness: 2.5, acidity: 2, bitterness: 3.8, body: 4.8, strength: 4 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "French-Press" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Body");
        });

        test("optimize bitter AeroPress brew", () => {
            const evaluation = { sweetness: 2, acidity: 2, bitterness: 3.6, body: 3, strength: 3.5 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "AeroPress" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Bitter");
        });

        test("optimize weak Cold Brew (low strength <= 2.0)", () => {
            const evaluation = { sweetness: 3, acidity: 1.5, bitterness: 1.5, body: 2, strength: 1.5 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Cold Brew Vessel" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("More Strength");
        });
    });

    // =========================================================================
    // GROUP D: ROAST LEVEL MODIFIER TESTS
    // =========================================================================
    describe("Roast Level Modifiers", () => {
        test("allow high acidity in Light Roast V60 (acidity 3.8 is accepted)", () => {
            const evaluation = { sweetness: 3.5, acidity: 3.8, bitterness: 2.0, body: 2.5, strength: 3 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "V60" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Light" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).not.toBe("Less Acidic");
        });

        test("optimize flat muted Light Roast (acidity <= 2.0)", () => {
            const evaluation = { sweetness: 3, acidity: 1.8, bitterness: 2.0, body: 3, strength: 3 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "V60" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Light-Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("More Acidic");
        });

        test("penalize moderate bitterness in Dark Roast (tighter bitterness tolerance)", () => {
            const evaluation = { sweetness: 2.5, acidity: 1.5, bitterness: 3.2, body: 4, strength: 4 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Moka Pot" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Dark" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Bitter");
        });
    });

    // =========================================================================
    // GROUP E: GENERAL COFFEE COMBINATIONS & COMMON FLAWS
    // =========================================================================
    describe("General Coffee Combinations & Flaws", () => {
        test("default fallback for empty or missing brew evaluations", () => {
            const brew = { dialIns: [] } as unknown as Brew;
            const recipe = { type: "V60" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe(null);
        });

        test("default fallback for balanced 3.0 cup across all parameters", () => {
            const evaluation = { sweetness: 3.0, acidity: 3.0, bitterness: 3.0, body: 3.0, strength: 3.0 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "V60" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("More Sweet");
        });

        test("fallback to average roast when Custom roast level is supplied", () => {
            const evaluation = { sweetness: 3.0, acidity: 3.0, bitterness: 3.0, body: 3.0, strength: 3.0 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Custom" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Custom" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("More Sweet");
        });

        test("common flaw: channeling defect (sour and bitter at the same time)", () => {
            // Channeling creates severe bitterness from over-extracted paths alongside extreme acidity
            const evaluation = { sweetness: 1.5, acidity: 4.2, bitterness: 4.5, body: 2.5, strength: 3 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Semi Auto Espresso" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Bitter");
        });

        test("common flaw: astringent papery Pour-Over (high bitterness, low sweetness)", () => {
            const evaluation = { sweetness: 1.8, acidity: 2.5, bitterness: 3.8, body: 2, strength: 2.5 } as Evaluation;
            const brew = { dialIns: [{ evaluations: [evaluation] }] } as Brew;
            const recipe = { type: "Chemex" } as Recipe;
            const grinder = {} as Grinder;
            const bag = { roastLevel: "Light-Medium" } as Bag;
            expect(suggestRequest(brew, recipe, grinder, bag).request).toBe("Less Bitter");
        });
    });
});