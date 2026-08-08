import type { Brewer, Recipe, Grinder, Bag } from './types';

export const bags: Bag[] = [
    {
        id: '1',
        name: 'Specialty Coffee',
        roastLevel: 'Medium',
        roastDate: '2026-08-06',
        isFinished: false,
        isBase: true, 
        active: false
    }
];

export const grinders: Grinder[] = [
    {
        id: '1',
        name: 'Generic Grinder',
        scaleMin: 1,
        scaleMax: 30,
        stepSize: 1,
        isBase: true,
        active: false
    }
];

export const brewers: Brewer[] = [
    {
        id: '1',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '2',
        name: 'Aeropress with super long name',
        method: 'Immersion',
        isBase: true,
        active: true
    },
    {
        id: '3',
        name: 'Espresso Machine',
        method: 'Espresso',
        isBase: true,
        active: true
    },
    {
        id: '4',
        name: 'Hario V60000000000000000000000000',
        method: 'Pour-Over',
        isBase: true,
        active: true
    },{
        id: '5',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '6',
        name: 'Aeropress',
        method: 'Immersion',
        isBase: true,
        active: true
    },
    {
        id: '7',
        name: 'Espresso Machine',
        method: 'Espresso',
        isBase: true,
        active: true
    },
    {
        id: '8',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: true
    },{
        id: '9',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '10',
        name: 'Aeropress',
        method: 'Immersion',
        isBase: true,
        active: true
    },
    {
        id: '11',
        name: 'Espresso Machine',
        method: 'Espresso',
        isBase: true,
        active: true
    },
    {
        id: '12',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '13',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '14',
        name: 'Aeropress',
        method: 'Immersion',
        isBase: true,
        active: true
    },
    {
        id: '15',
        name: 'Espresso Machine',
        method: 'Espresso',
        isBase: true,
        active: false
    },
    {
        id: '16',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: false
    },{
        id: '17',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: false
    },
    {
        id: '18',
        name: 'Aeropress',
        method: 'Immersion',
        isBase: true,
        active: false
    },
    {
        id: '19',
        name: 'Espresso Machine',
        method: 'Espresso',
        isBase: true,
        active: false
    },
    {
        id: '20',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: false
    },{
        id: '21',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: false
    },
    {
        id: '22',
        name: 'Aeropress',
        method: 'Immersion',
        isBase: true,
        active: false
    },
    {
        id: '23',
        name: 'Espresso Machine',
        method: 'Espresso',
        isBase: true,
        active: false
    },
    {
        id: '24',
        name: 'Hario V60',
        method: 'Pour-Over',
        isBase: true,
        active: false
    }
];

export const recipes: Recipe[] = [
    {
        id: '1',
        name: 'Morning Pour-Over with Specialty Coffee and very long name to test the text wrapping and overflow behavior in the UI',
        method: 'Pour-Over',
        waterMl: 300,
        doseGrams: 18,
        tempC: 93,
        grindPct: 45,
        instructions: 'Use a medium grind and pour in 3 stages.',
        isBase: true,
        active: false
    }
];