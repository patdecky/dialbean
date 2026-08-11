import type { Brewer, Recipe, Grinder, Bag } from './types';

export const bags: Bag[] = [
    {
        id: '1',
        name: 'Specialty Coffee',
        roaster: "Coffee Club",
        iconId: "1",
        roastLevel: 'Light',
        roastDate: '2026-08-06',
        isFinished: false,
        isBase: true,
        active: true
    },
    {
        id: '2',
        name: 'Specialty Coffee',
        iconId: "2",
        roastLevel: 'Medium',
        isFinished: false,
        isBase: true,
        active: true
    },
    {
        id: '3',
        name: 'Specialty Coffee',
        iconId: "3",
        roastLevel: 'Dark',
        roastDate: '2026-08-06',
        dateOpened: '2026-08-06',
        isFinished: false,
        isBase: true,
        active: true
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
        active: true
    }
];

export const brewers: Brewer[] = [
    {
        id: '1',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '2',
        name: 'Aeropress with super long name',
        type: 'Immersion',
        isBase: true,
        active: true
    },
    {
        id: '3',
        name: 'Espresso Machine',
        type: 'Espresso',
        isBase: true,
        active: true
    },
    {
        id: '4',
        name: 'Hario V60000000000000000000000000',
        type: 'Pour-Over',
        isBase: true,
        active: true
    }, {
        id: '5',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '6',
        name: 'Aeropress',
        type: 'Immersion',
        isBase: true,
        active: true
    },
    {
        id: '7',
        name: 'Espresso Machine',
        type: 'Espresso',
        isBase: true,
        active: true
    },
    {
        id: '8',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: true
    }, {
        id: '9',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '10',
        name: 'Aeropress',
        type: 'Immersion',
        isBase: true,
        active: true
    },
    {
        id: '11',
        name: 'Espresso Machine',
        type: 'Espresso',
        isBase: true,
        active: true
    },
    {
        id: '12',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '13',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: true
    },
    {
        id: '14',
        name: 'Aeropress',
        type: 'Immersion',
        isBase: true,
        active: true
    },
    {
        id: '15',
        name: 'Espresso Machine',
        type: 'Espresso',
        isBase: true,
        active: false
    },
    {
        id: '16',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: false
    }, {
        id: '17',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: false
    },
    {
        id: '18',
        name: 'Aeropress',
        type: 'Immersion',
        isBase: true,
        active: false
    },
    {
        id: '19',
        name: 'Espresso Machine',
        type: 'Espresso',
        isBase: true,
        active: false
    },
    {
        id: '20',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: false
    }, {
        id: '21',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: false
    },
    {
        id: '22',
        name: 'Aeropress',
        type: 'Immersion',
        isBase: true,
        active: false
    },
    {
        id: '23',
        name: 'Espresso Machine',
        type: 'Espresso',
        isBase: true,
        active: false
    },
    {
        id: '24',
        name: 'Hario V60',
        type: 'Pour-Over',
        isBase: true,
        active: false
    }
];

export const recipes: Recipe[] = [
    {
        id: '1',
        name: 'Morning Pour-Over with Specialty Coffee and very long name to test the text wrapping and overflow behavior in the UI',
        type: 'Pour-Over',
        waterMl: 300,
        doseGrams: 18,
        tempC: 93,
        grindPct: 45,
        instructions: 'Use a medium grind and pour in 3 stages.',
        isBase: true,
        active: true
    }
];


export const brews: Brew[] = [
    {
        id: "1",
        name: "Brew 1",
        bagId: "1",
        brewerId: "1",
        grinderId: "1",
        recipeId: "1",
        timestamp: new Date().toISOString(),
        dialIns: [{
            waterDelta: 0,
            doseDelta: 0,
            tempDelta: 0,
            grinderDelta: 0,
            evaluations: [],
            timestamp: new Date().toISOString()
        }]
    },
    {
        id: "2",
        name: "Brew 2",
        bagId: "1",
        brewerId: "1",
        grinderId: "1",
        recipeId: "1",
        timestamp: new Date().toISOString(),
        dialIns: [
            {
                waterDelta: 0,
                doseDelta: 0,
                tempDelta: 1,
                grinderDelta: 0,
                evaluations: [
                    {
                        id: "1",
                        timestamp: new Date().toISOString(),
                        ratings: {
                            sweetness: 3,
                            acidity: 3,
                            bitterness: 3,
                            body: 3,
                            strength: 3
                        },
                        notes: "Tasted good."
                    }
                ],
                timestamp: new Date().toISOString()
            }
        ]
    }
];