import type { BaseBrewer, BaseRecipe, BaseGrinder, BaseBag } from './types';

export const bags_base: BaseBag[] = [
    {
        id: 'base-bag-1',
        name: 'Specialty Coffee',
        roastLevel: 'Medium',
        roastDate: '2026-08-06',
        isFinished: false,
        isBaseBag: true
    }
];

export const grinders_base: BaseGrinder[] = [
    {
        id: 'base-grinder-1',
        name: 'Generic Grinder',
        scaleMin: 1,
        scaleMax: 30,
        stepSize: 1,
        isBaseGrinder: true
    }
];

export const brewers_base: BaseBrewer[] = [
    {
        id: 'base-brewer-1',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBaseBrewer: true
    }
];

export const recipes_base: BaseRecipe[] = [
    {
        id: 'base-recipe-1',
        name: 'Morning Pour-Over',
        brewMethod: 'Pour-Over',
        waterMl: 300,
        doseGrams: 18,
        tempC: 93,
        grindPct: 45,
        instructions: 'Use a medium grind and pour in 3 stages.',
        isBaseRecipe: true
    }
];