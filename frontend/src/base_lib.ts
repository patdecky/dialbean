import type { Brewer, Recipe, Grinder, Bag, Brew } from './types';

export const bags: Bag[] = [
    {
        id: '1',
        name: 'Light Roast Generic Bag',
        iconId: "1",
        roastLevel: 'Light',
        isFinished: false,
        isBase: true,
        usedInBrew: false
    },
    {
        id: '2',
        name: 'Light-Medium Roast Generic Bag',
        iconId: "2",
        roastLevel: 'Light-Medium',
        isFinished: false,
        isBase: true,
        usedInBrew: false
    },
    {
        id: '3',
        name: 'Medium Roast Generic Bag',
        iconId: "3",
        roastLevel: 'Medium',
        isFinished: false,
        isBase: true,
        usedInBrew: false
    },
    {
        id: '4',
        name: 'Medium-Dark Roast Generic Bag',
        iconId: "4",
        roastLevel: 'Medium-Dark',
        isFinished: false,
        isBase: true,
        usedInBrew: false
    },
    {
        id: '5',
        name: 'Dark Roast Generic Bag',
        iconId: "5",
        roastLevel: 'Dark',
        isFinished: false,
        isBase: true,
        usedInBrew: false
    },
    {
        id: '6',
        name: 'Indian Monsoon Malabar',
        iconId: "3",
        roastLevel: 'Medium',
        roastDate: '2026-08-06',
        // dateOpened: '2026-08-06',
        isFinished: false,
        isBase: false,
        usedInBrew: true
    }
];

export const grinders: Grinder[] = [
    {
        id: '1',
        name: 'Manual Generic Grinder',
        iconId: "1",
        scaleMin: 1,
        scaleMax: 30,
        stepSize: 1,
        isBase: true,
        usedInBrew: false
    },
    {
        id: '2',
        name: 'Semi-Automatic Generic Grinder',
        iconId: "2",
        scaleMin: 1,
        scaleMax: 30,
        stepSize: 1,
        isBase: true,
        usedInBrew: false
    },
    {
        id: '3',
        name: 'Automatic Generic Grinder',
        iconId: "3",
        scaleMin: 1,
        scaleMax: 30,
        stepSize: 1,
        isBase: true,
        usedInBrew: false
    },
    {
        id: '4',
        name: 'Vintage Generic Grinder',
        iconId: "4",
        scaleMin: 1,
        scaleMax: 30,
        stepSize: 1,
        isBase: true,
        usedInBrew: false
    },
    {
        id: '5',
        name: 'Caffia Barista Pink',
        iconId: "1",
        scaleMin: 1,
        scaleMax: 30,
        stepSize: 1,
        isBase: false,
        usedInBrew: true
    }
];

export const brewers: Brewer[] = [
    {
        id: '1',
        name: 'AeroPress',
        type: 'AeroPress',
        iconId: "1",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '2',
        name: 'V60',
        type: 'V60',
        iconId: "2",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '3',
        name: 'Flat-Bottom',
        type: 'Flat-Bottom',
        iconId: "3",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '4',
        name: 'Chemex',
        type: 'Chemex',
        iconId: "4",
        isBase: true,
        usedInBrew: false
    }, {
        id: '5',
        name: 'French-Press',
        type: 'French-Press',
        iconId: "5",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '6',
        name: 'Moka Pot',
        type: 'Moka Pot',
        iconId: "6",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '7',
        name: 'Lever Espresso',
        type: 'Lever Espresso',
        iconId: "7",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '8',
        name: 'Semi Auto Espresso',
        type: 'Semi Auto Espresso',
        iconId: "8",
        isBase: true,
        usedInBrew: false
    }, {
        id: '9',
        name: 'Super Auto Espresso',
        type: 'Super Auto Espresso',
        iconId: "9",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '10',
        name: 'Drip Machine',
        type: 'Drip Machine',
        iconId: "10",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '11',
        name: 'Cold Brew Vessel',
        type: 'Cold Brew Vessel',
        iconId: "11",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '12',
        name: 'Siphon',
        type: 'Siphon',
        iconId: "12",
        isBase: true,
        usedInBrew: false
    },
    {
        id: '13',
        name: 'AeroPress Travel',
        type: 'AeroPress',
        iconId: "1",
        isBase: false,
        usedInBrew: true,
        cleanedDate: '2026-08-06'
    }
];

export const recipes: Recipe[] = [
    {
        id: '1',
        name: 'Morning Pour-Over with Specialty Coffee and very long name to test the text wrapping and overflow behavior in the UI',
        type: 'V60',
        waterMl: 300,
        doseGrams: 18,
        tempC: 93,
        grindPct: 45,
        instructions: 'Use a medium grind and pour in 3 stages.',
        isBase: true,
        usedInBrew: true
    },
    {
        id: '2',
        name: 'Strong V60',
        type: 'V60',
        waterMl: 300,
        doseGrams: 18,
        tempC: 93,
        grindPct: 45,
        instructions: '-Bloom 60 seconds 40 ml \n-Pour 1 60 ml 60 seconds \n-Pour 2 60 ml 60 seconds',
        isBase: false,
        usedInBrew: true
    }
];


export const brews: Brew[] = [
    {
        id: "1",
        name: "Brew 1",
        bagId: "6",
        brewerId: "13",
        grinderId: "1",
        recipeId: "1",
        timestamp: new Date().toISOString(),
        dialIns: [{
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
        bagId: "6",
        brewerId: "1",
        grinderId: "1",
        recipeId: "2",
        timestamp: new Date().toISOString(),
        lastUsedTimestamp: new Date().toISOString(),
        dialIns: [
            {
                doseDelta: 0,
                tempDelta: 0,
                grinderDelta: 0,
                evaluations: [
                    {
                        timestamp: new Date().toISOString(),
                        sweetness: 3,
                        acidity: 3,
                        bitterness: 3,
                        body: 3,
                        strength: 3,
                        notes: "Tasted good."
                    },
                    {
                        timestamp: new Date().toISOString(),
                        sweetness: 4,
                        acidity: 3,
                        bitterness: 3,
                        body: 3,
                        strength: 4,
                        notes: "Great"
                    }
                ],
                timestamp: new Date().toISOString()
            },
            {
                doseDelta: 1,
                tempDelta: 1,
                grinderDelta: 0,
                evaluations: [
                    {
                        timestamp: new Date().toISOString(),
                        sweetness: 3,
                        acidity: 3,
                        bitterness: 3,
                        body: 3,
                        strength: 3,
                    },
                    {
                        timestamp: new Date().toISOString(),
                        sweetness: 4,
                        acidity: 3,
                        bitterness: 3,
                        body: 3,
                        strength: 4,
                        notes: "Great"
                    }
                ],
                timestamp: new Date().toISOString()
            }
        ]
    }
];