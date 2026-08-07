import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
    DileBeanSchema,
    Bag,
    Grinder,
    Brewer,
    Recipe,
    Brew,
    Evaluation
} from './types';
import type { StorageAdapter } from './adapter';
import { LocalStorageAdapter } from './adapter';

interface DileBeanContextType {
    data: DileBeanSchema;
    // Quick Actions
    addBag: (bag: Omit<Bag, 'id' | 'isBaseBag' | 'active'>) => void;
    removeBag: (bagId: string) => void;
    addGrinder: (grinder: Omit<Grinder, 'id' | 'isBaseGrinder' | 'active'>) => void;
    removeGrinder: (grinderId: string) => void;
    addBrewer: (brewer: Omit<Brewer, 'id' | 'isBaseBrewer' | 'active'>) => void;
    removeBrewer: (brewerId: string) => void;
    addRecipe: (recipe: Omit<Recipe, 'id' | 'isBaseRecipe' | 'active'>) => void;
    removeRecipe: (recipeId: string) => void;
    newBrew: (bagId: string, brewerId: string, grinderId: string, recipeId: string) => Brew;
    markBrewUsed: (brewId: string) => Brew;
    setBrewDisgusting: (brewId: string, isDisgusting: boolean) => Brew;
    setBrewName: (brewId: string, name: string) => Brew;
    getBrewDefaultName: (brewId: string) => string;
    removeBrew: (brewId: string) => void;
    addEvaluation: (brewId: string, evaluation: Omit<Evaluation, 'id' | 'timestamp'>) => Brew;
    removeEvaluation: (brewId: string, evaluationId: string) => Brew;
    dialIn: (brewId: string, doseDelta?: number, tempDelta?: number, grindDelta?: number) => Brew;
}

// Single instance of your storage adapter
const storageAdapter: StorageAdapter = new LocalStorageAdapter();

const DileBeanContext = createContext<DileBeanContextType | null>(null);

export const DileBeanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<DileBeanSchema>(() => storageAdapter.loadData());

    // Auto-sync to LocalStorage whenever state updates
    useEffect(() => {
        storageAdapter.saveData(data);
    }, [data]);

    // --- ACTIONS ---

    const addBag = (bagData: Omit<Bag, 'id' | 'isBaseBag' | 'active'>) => {
        const newBag: Bag = { ...bagData, id: crypto.randomUUID(), isBaseBag: false, active: false };
        setData((prev) => ({ ...prev, bags: [...prev.bags, newBag] }));
    };

    const removeBag = (bagId: string) => {
        setData((prev) => ({
            ...prev,
            bags: prev.bags.filter((bag) => bag.id !== bagId)
        }));
    };

    const addGrinder = (grinderData: Omit<Grinder, 'id'| 'isBaseGrinder' | 'active'>) => {
        const newGrinder: Grinder = { ...grinderData, id: crypto.randomUUID(), isBaseGrinder: false, active: false };
        setData((prev) => ({ ...prev, grinders: [...prev.grinders, newGrinder] }));
    };
    const removeGrinder = (grinderId: string) => {
        setData((prev) => ({
            ...prev,
            grinders: prev.grinders.filter((grinder) => grinder.id !== grinderId)
        }));
    };

    const addBrewer = (brewerData: Omit<Brewer, 'id'| 'isBaseBrewer' | 'active'>) => {
        const newBrewer: Brewer = { ...brewerData, id: crypto.randomUUID(), isBaseBrewer: false, active: false };
        setData((prev) => ({ ...prev, brewers: [...prev.brewers, newBrewer] }));
    };

    const removeBrewer = (brewerId: string) => {
        setData((prev) => ({
            ...prev,
            brewers: prev.brewers.filter((brewer) => brewer.id !== brewerId)
        }));
    }

    const addRecipe = (recipeData: Omit<Recipe, 'id' | 'isBaseRecipe' | 'active'>) => {
        const newRecipe: Recipe = { ...recipeData, id: crypto.randomUUID(), isBaseRecipe: false, active: false };
        setData((prev) => ({ ...prev, recipes: [...prev.recipes, newRecipe] }));
    };

    const removeRecipe = (recipeId: string) => {
        setData((prev) => ({
            ...prev,
            recipes: prev.recipes.filter((recipe) => recipe.id !== recipeId)
        }));
    };

    const newBrew = (
        bagId: string,
        brewerId: string,
        grinderId: string,
        recipeId: string,
    ): Brew => {
        const bag = data.bags.find((b) => b.id === bagId);
        const recipe = data.recipes.find((r) => r.id === recipeId);
        const grinder = data.grinders.find((g) => g.id === grinderId);
        const brewer = data.brewers.find((b) => b.id === brewerId);
        
        if (!bag) {
            throw new Error(`Bag with ID ${bagId} not found`);
        }
        if (!recipe) {
            throw new Error(`Recipe with ID ${recipeId} not found`);
        }
        if (!grinder) {
            throw new Error(`Grinder with ID ${grinderId} not found`);
        }
        if (!brewer) {
            throw new Error(`Brewer with ID ${brewerId} not found`);
        }
        const newBag: Bag = {...bag, active: true};
        const newRecipe: Recipe = {...recipe, active: true};
        const newGrinder: Grinder = {...grinder, active: true};
        const newBrewer: Brewer = {...brewer, active: true};

        const newBrew: Brew = {
            id: crypto.randomUUID(),
            bagId,
            name: "",
            brewerId,
            grinderId,
            recipeId,
            timestamp: new Date().toISOString(),
            waterDelta: 0,
            doseDelta: 0,
            tempDelta: 0,
            grinderDelta: 0,
            evaluations: [],
        };
        setData((prev) => ({ ...prev, 
            brews: [...prev.brews, newBrew],
            bags: prev.bags.map((d) => {
                if (d.id !== bagId) return d;
                return newBag;
            }),
            recipes: prev.recipes.map((d) => {
                if (d.id !== recipeId) return d;
                return newRecipe;
            }),
            grinders: prev.grinders.map((d) => {
                if (d.id !== grinderId) return d;
                return newGrinder;
            }),
            brewers: prev.brewers.map((d) => {
                if (d.id !== brewerId) return d;
                return newBrewer;
            })
        }));
        return newBrew;
    };

    const markBrewUsed = (brewId: string) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        const newBrew: Brew = {
            ...brew,
            lastUsedTimestamp: new Date().toISOString()
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        return newBrew;
    };

    const setBrewDisgusting = (brewId: string, isDisgusting: boolean = true) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        const newBrew: Brew = {
            ...brew,
            isDisgusting
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        return newBrew;
    };

    const setBrewName = (brewId: string, name: string) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        const newBrew: Brew = {
            ...brew,
            name
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        return newBrew;
    };

    const getBrewDefaultName = (brewId: string) => {
        const brew = data.brews.find((d) => d.id === brewId);
        const bagName = data.bags.find((bag) => bag.id === brew?.bagId)?.name || "Unknown Bag";
        const brewerName = data.brewers.find((brewer) => brewer.id === brew?.brewerId)?.name || "Unknown Brewer";
        const grinderName = data.grinders.find((grinder) => grinder.id === brew?.grinderId)?.name || "Unknown Grinder";
        const recipeName = data.recipes.find((recipe) => recipe.id === brew?.recipeId)?.name || "Unknown Recipe";
        return `${bagName} on ${brewerName} with ${grinderName} using ${recipeName}`;
    };

    const removeBrew = (brewId: string) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) return;
        const bag = data.bags.find((d) => d.id === brew.bagId);
        const recipe = data.recipes.find((d) => d.id === brew.recipeId);
        const grinder = data.grinders.find((d) => d.id === brew.grinderId);
        const brewer = data.brewers.find((d) => d.id === brew.brewerId);
        let newBag: Bag | undefined;
        let newRecipe: Recipe | undefined;
        let newGrinder: Grinder | undefined;
        let newBrewer: Brewer | undefined;
        if (bag) {
            const bagUsed = data.brews.some((d) => (d.id !== brewId && d.bagId == bag.id))
            if (!bagUsed)
                newBag = {...bag, active: false};
        }
        if (recipe) {
            const recipeUsed = data.brews.some((d) => (d.id !== brewId && d.recipeId == recipe.id))
            if (!recipeUsed)
                newRecipe = {...recipe, active: false};
        }
        if (grinder) {
            const grinderUsed = data.brews.some((d) => (d.id !== brewId && d.grinderId == grinder.id))
            if (!grinderUsed)
                newGrinder = {...grinder, active: false};
        }
        if (brewer) {
            const brewerUsed = data.brews.some((d) => (d.id !== brewId && d.brewerId == brewer.id))
            if (!brewerUsed)
                newBrewer = {...brewer, active: false};
        }



        setData((prev) => ({
            ...prev,
            brews: prev.brews.filter((d) => d.id !== brewId),
            bags: prev.bags.map((d) => {
                if (d.id !== brew.bagId) return d;
                return newBag ?? d;
            }),
            recipes: prev.recipes.map((d) => {
                if (d.id !== brew.recipeId) return d;
                return newRecipe ?? d;
            }),
            grinders: prev.grinders.map((d) => {
                if (d.id !== brew.grinderId) return d;
                return newGrinder ?? d;
            }),
            brewers: prev.brewers.map((d) => {
                if (d.id !== brew.brewerId) return d;
                return newBrewer ?? d;
            })
        }));
    }

    const addEvaluation = (
        brewId: string,
        evalData: Omit<Evaluation, 'id' | 'timestamp'>
    ) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        const newEval: Evaluation = {
            ...evalData,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString()
        };
        const newBrew: Brew = {
            ...brew,
            evaluations: [...brew.evaluations, newEval],
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        return newBrew;
    };

    const removeEvaluation = (brewId: string, evaluationId: string) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        const newBrew: Brew = {
            ...brew,
            evaluations: brew.evaluations.filter((e) => e.id !== evaluationId)
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        return newBrew;
    };

    const dialIn = (
        brewId: string, doseDelta?: number, tempDelta?: number, grindDelta?: number
    ) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        const newBrew: Brew = {
            ...brew,
            doseDelta: doseDelta ?? 0,
            tempDelta: tempDelta ?? 0,
            grinderDelta: grindDelta ?? 0
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        return newBrew;
    };

    return (
        <DileBeanContext.Provider
            value={{
                data,
                addBag,
                removeBag,
                addGrinder,
                removeGrinder,
                addBrewer,
                removeBrewer,
                addRecipe,
                removeRecipe,
                newBrew,
                markBrewUsed,
                setBrewDisgusting,
                setBrewName,
                getBrewDefaultName,
                removeBrew,
                addEvaluation,
                removeEvaluation,
                dialIn
            }}
        >
            {children}
        </DileBeanContext.Provider>
    );
};

// Custom Hook for accessing data
// eslint-disable-next-line react-refresh/only-export-components
export const useDileBean = () => {
    const context = useContext(DileBeanContext);
    if (!context) {
        throw new Error('useDileBean must be used within a DileBeanProvider');
    }
    return context;
};