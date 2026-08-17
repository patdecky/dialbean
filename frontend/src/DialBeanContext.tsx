import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
    DialBeanSchema,
    Bag,
    Grinder,
    Brewer,
    Recipe,
    Brew,
    Evaluation,
    DialIn
} from './types';
import type { StorageAdapter } from './adapter';
import { LocalStorageAdapter } from './adapter';

interface DialBeanContextType {
    data: DialBeanSchema;
    // Quick Actions
    addBag: (bag: Omit<Bag, 'id' | 'isBase' | 'usedInBrew'>) => Bag;
    removeBag: (bagId: string) => void;
    markBagFinished: (bagId: string) => Bag;
    markBagRestocked: (bagId: string) => Bag;
    markBagOpened: (bagId: string) => Bag;
    editBag: (bagId: string, bagData: Omit<Bag, 'id' | 'isBase' | 'usedInBrew'>) => void;
    addGrinder: (grinder: Omit<Grinder, 'id' | 'isBase' | 'usedInBrew'>) => Grinder;
    removeGrinder: (grinderId: string) => void;
    editGrinder: (grinderId: string, grinderData: Omit<Grinder, 'id' | 'isBase' | 'usedInBrew'>) => void;
    markGrinderCleaned: (grinderId: string) => Grinder;
    addBrewer: (brewer: Omit<Brewer, 'id' | 'isBase' | 'usedInBrew'>) => Brewer;
    removeBrewer: (brewerId: string) => void;
    editBrewer: (brewerId: string, brewerData: Omit<Brewer, 'id' | 'isBase' | 'usedInBrew'>) => void;
    markBrewerCleaned: (brewerId: string) => Brewer;
    addRecipe: (recipe: Omit<Recipe, 'id' | 'isBase' | 'usedInBrew'>) => Recipe;
    removeRecipe: (recipeId: string) => void;
    editRecipe: (recipeId: string, recipeData: Omit<Recipe, 'id' | 'isBase' | 'usedInBrew'>) => void;
    newBrew: (brew: Omit<Brew, 'id' | 'dialIns'>) => Brew;
    markBrewUsed: (brewId: string) => Brew;
    removeBrew: (brewId: string) => void;
    editBrew: (brewId: string, brewData: Omit<Brew, 'id' | 'dialIns'>) => Brew;
    addDialIn: (brewId: string, dialIn: Omit<DialIn, 'timestamp' | 'evaluations'>) => Brew;
    removeDialIn: (brewId: string) => Brew;
    setDialInDisgusting: (brewId: string, isDisgusting: boolean) => Brew;
    addEvaluation: (brewId: string, evaluation: Omit<Evaluation, 'timestamp'>) => Brew;
    removeEvaluation: (brewId: string) => Brew;
}

// Single instance of your storage adapter
const storageAdapter: StorageAdapter = new LocalStorageAdapter();

const DialBeanContext = createContext<DialBeanContextType | null>(null);

export const DialBeanProvider: React.FC<{ setMessage: (message: string) => void; children: React.ReactNode }> = ({ setMessage, children }) => {
    const [data, setData] = useState<DialBeanSchema>(() => storageAdapter.loadData());

    // Auto-sync to LocalStorage whenever state updates
    useEffect(() => {
        storageAdapter.saveData(data);
    }, [data]);

    // --- ACTIONS ---

    const addBag = (bagData: Omit<Bag, 'id' | 'isBase' | 'usedInBrew'>): Bag => {
        const newBag: Bag = { ...bagData, id: crypto.randomUUID(), isBase: false, usedInBrew: false };
        setData((prev) => ({ ...prev, bags: [...prev.bags, newBag] }));
        setMessage(`Added new bag`);
        return newBag;
    };

    const removeBag = (bagId: string) => {
        const brewsUsingBag = data.brews.filter((brew) => brew.bagId === bagId);
        if (brewsUsingBag.length > 0) {
            brewsUsingBag.forEach((brew) => removeBrew(brew.id));
        }
        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) return;
        if (bag.isBase) {
            throw new Error(`Cannot remove base bag with ID ${bagId}`);
        }
        if (bag.usedInBrew) {
            throw new Error(`Cannot remove usedInBrew bag with ID ${bagId}`);
        }
        setData((prev) => ({
            ...prev,
            bags: prev.bags.filter((bag) => bag.id !== bagId)
        }));
        setMessage(`Removed bag`);
    };

    const editBag = (bagId: string, bagData: Omit<Bag, 'id' | 'isBase' | 'usedInBrew'>): Bag => {
        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) {
            throw new Error(`Bag with ID ${bagId} not found`);
        }
        const newBag: Bag = { ...bag, ...bagData };
        setData((prev) => ({
            ...prev,
            bags: prev.bags.map((bag) => {
                if (bag.id !== bagId) return bag;
                return newBag;
            })
        }));
        setMessage(`Saved changes to bag`);
        return newBag;
    };

    const markBagFinished = (bagId: string): Bag => {
        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) {
            throw new Error(`Bag with ID ${bagId} not found`);
        }
        const newBag: Bag = { ...bag, isFinished: true };
        setData((prev) => ({
            ...prev,
            bags: prev.bags.map((bag) => {
                if (bag.id !== bagId) return bag;
                return newBag;
            })
        }));
        setMessage(`Marked bag as finished`);
        return newBag;
    };

    const markBagRestocked = (bagId: string): Bag => {
        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) {
            throw new Error(`Bag with ID ${bagId} not found`);
        }
        const newBag: Bag = { ...bag, isFinished: false, dateOpened: undefined };
        setData((prev) => ({
            ...prev,
            bags: prev.bags.map((bag) => {
                if (bag.id !== bagId) return bag;
                return newBag;
            })
        }));
        setMessage(`Restocked bag`);
        return newBag;
    };

    const markBagOpened = (bagId: string): Bag => {
        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) {
            throw new Error(`Bag with ID ${bagId} not found`);
        }
        const newBag: Bag = { ...bag, dateOpened: new Date().toISOString() };
        setData((prev) => ({
            ...prev,
            bags: prev.bags.map((bag) => {
                if (bag.id !== bagId) return bag;
                return newBag;
            })
        }));
        setMessage(`Marked bag as opened`);
        return newBag;
    };

    const addGrinder = (grinderData: Omit<Grinder, 'id' | 'isBase' | 'usedInBrew'>): Grinder => {
        const newGrinder: Grinder = { ...grinderData, id: crypto.randomUUID(), isBase: false, usedInBrew: false };
        setData((prev) => ({ ...prev, grinders: [...prev.grinders, newGrinder] }));
        setMessage(`Added new grinder`);
        return newGrinder;
    };

    const editGrinder = (grinderId: string, grinderData: Omit<Grinder, 'id' | 'isBase' | 'usedInBrew'>): Grinder => {
        const grinder = data.grinders.find((g) => g.id === grinderId);
        if (!grinder) {
            throw new Error(`Grinder with ID ${grinderId} not found`);
        }
        const newGrinder: Grinder = { ...grinder, ...grinderData };
        setData((prev) => ({
            ...prev,
            grinders: prev.grinders.map((grinder) => {
                if (grinder.id !== grinderId) return grinder;
                return newGrinder;
            })
        }));
        setMessage(`Saved changes to grinder`);
        return newGrinder;
    };
    const removeGrinder = (grinderId: string) => {
        const grinderUsedInBrews = data.brews.filter((brew) => brew.grinderId === grinderId);
        if (grinderUsedInBrews.length > 0) {
            grinderUsedInBrews.forEach((brew) => removeBrew(brew.id));
        }
        const grinder = data.grinders.find((g) => g.id === grinderId);
        if (!grinder) return;
        if (grinder.isBase) {
            throw new Error(`Cannot remove base grinder with ID ${grinderId}`);
        }
        if (grinder.usedInBrew) {
            throw new Error(`Cannot remove usedInBrew grinder with ID ${grinderId}`);
        }
        setData((prev) => ({
            ...prev,
            grinders: prev.grinders.filter((grinder) => grinder.id !== grinderId)
        }));
        setMessage(`Removed grinder`);
    };

    const markGrinderCleaned = (grinderId: string): Grinder => {
        const grinder = data.grinders.find((g) => g.id === grinderId);
        if (!grinder) {
            throw new Error(`Grinder with ID ${grinderId} not found`);
        }
        const newGrinder: Grinder = { ...grinder, cleanedDate: new Date().toISOString() };
        setData((prev) => ({
            ...prev,
            grinders: prev.grinders.map((grinder) => {
                if (grinder.id !== grinderId) return grinder;
                return newGrinder;
            })
        }));
        setMessage(`Marked grinder as cleaned`);
        return newGrinder;
    };

    const addBrewer = (brewerData: Omit<Brewer, 'id' | 'isBase' | 'usedInBrew'>): Brewer => {
        const newBrewer: Brewer = { ...brewerData, id: crypto.randomUUID(), isBase: false, usedInBrew: false };
        setData((prev) => ({ ...prev, brewers: [...prev.brewers, newBrewer] }));
        setMessage(`Added new brewer`);
        return newBrewer;
    };

    const editBrewer = (brewerId: string, brewerData: Omit<Brewer, 'id' | 'isBase' | 'usedInBrew'>): Brewer => {
        const brewer = data.brewers.find((b) => b.id === brewerId);
        if (!brewer) {
            throw new Error(`Brewer with ID ${brewerId} not found`);
        }
        const newBrewer: Brewer = { ...brewer, ...brewerData };
        setData((prev) => ({
            ...prev,
            brewers: prev.brewers.map((brewer) => {
                if (brewer.id !== brewerId) return brewer;
                return newBrewer;
            })
        }));
        setMessage(`Saved changes to brewer`);
        return newBrewer;
    };

    const removeBrewer = (brewerId: string) => {
        const brewsUsingBrewer = data.brews.filter((brew) => brew.brewerId === brewerId);
        if (brewsUsingBrewer.length > 0) {
            brewsUsingBrewer.forEach((brew) => removeBrew(brew.id));
        }
        const brewer = data.brewers.find((b) => b.id === brewerId);
        if (!brewer) return;
        if (brewer.isBase) {
            throw new Error(`Cannot remove base brewer with ID ${brewerId}`);
        }
        if (brewer.usedInBrew) {
            throw new Error(`Cannot remove usedInBrew brewer with ID ${brewerId}`);
        }
        setData((prev) => ({
            ...prev,
            brewers: prev.brewers.filter((brewer) => brewer.id !== brewerId)
        }));
        setMessage(`Removed brewer`);
    };

    const markBrewerCleaned = (brewerId: string): Brewer => {
        const brewer = data.brewers.find((b) => b.id === brewerId);
        if (!brewer) {
            throw new Error(`Brewer with ID ${brewerId} not found`);
        }
        const newBrewer: Brewer = { ...brewer, cleanedDate: new Date().toISOString() };
        setData((prev) => ({
            ...prev,
            brewers: prev.brewers.map((brewer) => {
                if (brewer.id !== brewerId) return brewer;
                return newBrewer;
            })
        }));
        setMessage(`Marked brewer as cleaned`);
        return newBrewer;
    };

    const addRecipe = (recipeData: Omit<Recipe, 'id' | 'isBase' | 'usedInBrew'>): Recipe => {
        const newRecipe: Recipe = { ...recipeData, id: crypto.randomUUID(), isBase: false, usedInBrew: false };
        setData((prev) => ({ ...prev, recipes: [...prev.recipes, newRecipe] }));
        setMessage(`Added new recipe`);
        return newRecipe;
    };

    const editRecipe = (recipeId: string, recipeData: Omit<Recipe, 'id' | 'isBase' | 'usedInBrew'>): Recipe => {
        const recipe = data.recipes.find((r) => r.id === recipeId);
        if (!recipe) {
            throw new Error(`Recipe with ID ${recipeId} not found`);
        }
        const newRecipe: Recipe = { ...recipe, ...recipeData };
        setData((prev) => ({
            ...prev,
            recipes: prev.recipes.map((recipe) => {
                if (recipe.id !== recipeId) return recipe;
                return newRecipe;
            })
        }));
        setMessage(`Saved changes to recipe`);
        return newRecipe;
    };

    const removeRecipe = (recipeId: string) => {
        const brewsUsingRecipe = data.brews.filter((brew) => brew.recipeId === recipeId);
        if (brewsUsingRecipe.length > 0) {
            brewsUsingRecipe.forEach((brew) => removeBrew(brew.id));
        }
        const recipe = data.recipes.find((r) => r.id === recipeId);
        if (!recipe) return;
        if (recipe.isBase) {
            throw new Error(`Cannot remove base recipe with ID ${recipeId}`);
        }
        if (recipe.usedInBrew) {
            throw new Error(`Cannot remove usedInBrew recipe with ID ${recipeId}`);
        }
        setData((prev) => ({
            ...prev,
            recipes: prev.recipes.filter((recipe) => recipe.id !== recipeId)
        }));
        setMessage(`Removed recipe`);
    };

    const newBrew = (brewData: Omit<Brew, 'id' | 'dialIns'>): Brew => {
        const { name, notes, bagId, brewerId, grinderId, recipeId } = brewData;
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
        const newBag: Bag = { ...bag, usedInBrew: true };
        const newRecipe: Recipe = { ...recipe, usedInBrew: true };
        const newGrinder: Grinder = { ...grinder, usedInBrew: true };
        const newBrewer: Brewer = { ...brewer, usedInBrew: true };

        const newBrew: Brew = {
            id: crypto.randomUUID(),
            bagId,
            name: name,
            notes: notes,
            brewerId,
            grinderId,
            recipeId,
            timestamp: new Date().toISOString(),
            dialIns: [{
                doseDelta: 0,
                tempDelta: 0,
                grinderDelta: 0,
                evaluations: [],
                timestamp: new Date().toISOString()
            }],
        };
        setData((prev) => ({
            ...prev,
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
        setMessage(`Added new brew`);
        return newBrew;
    };

    const markBrewUsed = (brewId: string): Brew => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        if (brew.dialIns.length === 0) {
            throw new Error(`Brew with ID ${brewId} has no dial-ins`);
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
        // no meessage here, silent for notification handling later
        return newBrew;
    };


    const setDialInDisgusting = (brewId: string, isDisgusting: boolean = true): Brew => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        if (brew.dialIns.length === 0) {
            throw new Error(`Brew with ID ${brewId} has no dial-ins`);
        }
        const newDialIn = {
            ...brew.dialIns[brew.dialIns.length - 1],
            isDisgusting
        };
        const newBrew: Brew = {
            ...brew,
            dialIns: [...brew.dialIns.slice(0, -1), newDialIn]
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        setMessage(`Marked Dial-in disgusting`);
        return newBrew;
    };


    const removeBrew = (brewId: string) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) return;
        const bag = data.bags.find((d) => d.id === brew.bagId);
        const recipe = data.recipes.find((d) => d.id === brew.recipeId);
        const grinder = data.grinders.find((d) => d.id === brew.grinderId);
        const brewer = data.brewers.find((d) => d.id === brew.brewerId);
        if (!bag || !recipe || !grinder || !brewer) {
            throw new Error(`One of the bag, recipe, grinder, or brewer not found for brew ID ${brewId}`);
        }
        let newBag: Bag;
        let newRecipe: Recipe;
        let newGrinder: Grinder;
        let newBrewer: Brewer;
        if (bag) {
            const bagUsed = data.brews.some((d) => (d.id !== brewId && d.bagId == bag.id))
            if (!bagUsed)
                newBag = { ...bag, usedInBrew: false };
        }
        if (recipe) {
            const recipeUsed = data.brews.some((d) => (d.id !== brewId && d.recipeId == recipe.id))
            if (!recipeUsed)
                newRecipe = { ...recipe, usedInBrew: false };
        }
        if (grinder) {
            const grinderUsed = data.brews.some((d) => (d.id !== brewId && d.grinderId == grinder.id))
            if (!grinderUsed)
                newGrinder = { ...grinder, usedInBrew: false };
        }
        if (brewer) {
            const brewerUsed = data.brews.some((d) => (d.id !== brewId && d.brewerId == brewer.id))
            if (!brewerUsed)
                newBrewer = { ...brewer, usedInBrew: false };
        }
        setData((prev) => ({
            ...prev,
            brews: prev.brews.filter((d) => d.id !== brewId),
            bags: prev.bags.map((d) => {
                if (d.id !== brew?.bagId) return d;
                return newBag ?? d;
            }),
            recipes: prev.recipes.map((d) => {
                if (d.id !== brew?.recipeId) return d;
                return newRecipe ?? d;
            }),
            grinders: prev.grinders.map((d) => {
                if (d.id !== brew?.grinderId) return d;
                return newGrinder ?? d;
            }),
            brewers: prev.brewers.map((d) => {
                if (d.id !== brew?.brewerId) return d;
                return newBrewer ?? d;
            })
        }));
        setMessage(`Removed brew`);
    }

    const editBrew = (brewId: string, brewData: Omit<Brew, 'id' | 'dialIns'>): Brew => {
        console.log("editBrew called with brewId:", brewId, "brewData:", brewData);
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        // find the old bag, recipe, grinder, and brewer
        const oldBag = data.bags.find((d) => d.id === brew.bagId);
        const oldRecipe = data.recipes.find((d) => d.id === brew.recipeId);
        const oldGrinder = data.grinders.find((d) => d.id === brew.grinderId);
        const oldBrewer = data.brewers.find((d) => d.id === brew.brewerId);
        if (!oldBag || !oldRecipe || !oldGrinder || !oldBrewer) {
            throw new Error(`One of the old bag, recipe, grinder, or brewer not found`);
        }
        // keep the ids
        // mark the new ones as usedInBrew
        // update the storage
        const newBrew: Brew = {
            ...brew,
            ...brewData
        };
        // if the new ids are different, mark the old ones as inactive if they are not used by any other brew
        const newBag = data.bags.find((d) => d.id === newBrew.bagId);
        const newRecipe = data.recipes.find((d) => d.id === newBrew.recipeId);
        const newGrinder = data.grinders.find((d) => d.id === newBrew.grinderId);
        const newBrewer = data.brewers.find((d) => d.id === newBrew.brewerId);
        if (!newBag || !newRecipe || !newGrinder || !newBrewer) {
            throw new Error(`One of the new bag, recipe, grinder, or brewer not found`);
        }
        let newOldBag: Bag = { ...oldBag };
        let newOldRecipe: Recipe = { ...oldRecipe };
        let newOldGrinder: Grinder = { ...oldGrinder };
        let newOldBrewer: Brewer = { ...oldBrewer };
        if (oldBag && oldBag.id !== newBrew.bagId) {
            const bagUsed = data.brews.some((d) => (d.id !== brewId && d.bagId == oldBag.id));
            if (!bagUsed)
                newOldBag = { ...oldBag, usedInBrew: false };
        }
        if (oldRecipe && oldRecipe.id !== newBrew.recipeId) {
            const recipeUsed = data.brews.some((d) => (d.id !== brewId && d.recipeId == oldRecipe.id));
            if (!recipeUsed)
                newOldRecipe = { ...oldRecipe, usedInBrew: false };
        }
        if (oldGrinder && oldGrinder.id !== newBrew.grinderId) {
            const grinderUsed = data.brews.some((d) => (d.id !== brewId && d.grinderId == oldGrinder.id));
            if (!grinderUsed)
                newOldGrinder = { ...oldGrinder, usedInBrew: false };
        }
        if (oldBrewer && oldBrewer.id !== newBrew.brewerId) {
            const brewerUsed = data.brews.some((d) => (d.id !== brewId && d.brewerId == oldBrewer.id));
            if (!brewerUsed)
                newOldBrewer = { ...oldBrewer, usedInBrew: false };
        }
        const newNewBag: Bag = { ...newBag, usedInBrew: true };
        const newNewRecipe: Recipe = { ...newRecipe, usedInBrew: true };
        const newNewGrinder: Grinder = { ...newGrinder, usedInBrew: true };
        const newNewBrewer: Brewer = { ...newBrewer, usedInBrew: true };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            }),
            bags: prev.bags.map((d) => {
                if (d.id !== oldBag?.id && d.id !== newBag?.id) return d;
                if (d.id === newBag?.id) return newNewBag ?? d;
                return newOldBag ?? d;
            }),
            recipes: prev.recipes.map((d) => {
                if (d.id !== oldRecipe?.id && d.id !== newRecipe?.id) return d;
                if (d.id === newRecipe?.id) return newNewRecipe ?? d;
                return newOldRecipe ?? d;
            }),
            grinders: prev.grinders.map((d) => {
                if (d.id !== oldGrinder?.id && d.id !== newGrinder?.id) return d;
                if (d.id === newGrinder?.id) return newNewGrinder ?? d;
                return newOldGrinder ?? d;
            }),
            brewers: prev.brewers.map((d) => {
                if (d.id !== oldBrewer?.id && d.id !== newBrewer?.id) return d;
                if (d.id === newBrewer?.id) return newNewBrewer ?? d;
                return newOldBrewer ?? d;
            })
        }));
        setMessage(`Saved changes to brew`);
        return newBrew;
    }

    const removeDialIn = (brewId: string) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        if (brew.dialIns.length === 0) {
            throw new Error(`Brew with ID ${brewId} has no dial-ins`);
        }
        const newBrew: Brew = {
            ...brew,
            dialIns: brew.dialIns.slice(0, -1)
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        setMessage(`Removed Dial-in on a brew`);
        return newBrew;
    }

    const addEvaluation = (
        brewId: string,
        evalData: Omit<Evaluation, 'timestamp'>
    ): Brew => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        if (brew.dialIns.length === 0) {
            throw new Error(`Brew with ID ${brewId} has no dial-ins`);
        }
        const newEval: Evaluation = {
            ...evalData,
            timestamp: new Date().toISOString()
        };
        const newDialIn = {
            ...brew.dialIns[brew.dialIns.length - 1],
            evaluations: [...brew.dialIns[brew.dialIns.length - 1].evaluations, newEval]
        };
        const newBrew: Brew = {
            ...brew,
            dialIns: [...brew.dialIns.slice(0, -1), newDialIn]
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        setMessage(`Added new evaluation for brew`);
        return newBrew;
    };

    const removeEvaluation = (brewId: string) => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        if (brew.dialIns.length === 0) {
            throw new Error(`Brew with ID ${brewId} has no dial-ins`);
        }
        if (brew.dialIns[brew.dialIns.length - 1].evaluations.length === 0) {
            throw new Error(`Brew with ID ${brewId} has no evaluations to remove`);
        }
        const newDialIn = {
            ...brew.dialIns[brew.dialIns.length - 1],
            evaluations: brew.dialIns[brew.dialIns.length - 1].evaluations.slice(0, -1)
        };
        const newBrew: Brew = {
            ...brew,
            dialIns: [...brew.dialIns.slice(0, -1), newDialIn]
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        setMessage(`Removed evaluation on a brew`);
        return newBrew;
    };

    const addDialIn = (
        brewId: string, dialIn: Omit<DialIn, 'timestamp' | 'evaluations'>
    ): Brew => {
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        const newBrew: Brew = {
            ...brew,
            dialIns: [...brew.dialIns, {
                doseDelta: dialIn.doseDelta ?? 0,
                tempDelta: dialIn.tempDelta ?? 0,
                grinderDelta: dialIn.grinderDelta ?? 0,
                evaluations: [],
                timestamp: new Date().toISOString(),
            }]
        };
        setData((prev) => ({
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        }));
        setMessage(`Added new Dial-in`);
        return newBrew;
    };

    return (
        <DialBeanContext.Provider
            value={{
                data,
                addBag,
                removeBag,
                markBagFinished,
                markBagRestocked,
                markBagOpened,
                editBrew,
                editBag,
                editGrinder,
                editBrewer,
                editRecipe,
                addGrinder,
                removeGrinder,
                addBrewer,
                removeBrewer,
                addRecipe,
                removeRecipe,
                newBrew,
                markBrewUsed,
                removeDialIn,
                setDialInDisgusting,
                removeBrew,
                addEvaluation,
                removeEvaluation,
                addDialIn,
                markGrinderCleaned,
                markBrewerCleaned
            }}
        >
            {children}
        </DialBeanContext.Provider>
    );
};

// Custom Hook for accessing data
// eslint-disable-next-line react-refresh/only-export-components
export const useDialBean = () => {
    const context = useContext(DialBeanContext);
    if (!context) {
        throw new Error('useDialBean must be used within a DialBeanProvider');
    }
    return context;
};