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
import { removeAllData, type StorageAdapter } from './adapter';
import { initStorageEngine } from './pwa';

interface DialBeanContextType {
    data: DialBeanSchema | null;
    // Quick Actions
    addBag: (bag: Omit<Bag, 'id' | 'isBase'>) => Bag;
    removeBag: (bagId: string) => void;
    markBagFinished: (bagId: string) => Bag;
    markBagRestocked: (bagId: string) => Bag;
    markBagOpened: (bagId: string) => Bag;
    editBag: (bagId: string, bagData: Omit<Bag, 'id' | 'isBase'>) => void;
    addGrinder: (grinder: Omit<Grinder, 'id' | 'isBase'>) => Grinder;
    removeGrinder: (grinderId: string) => void;
    editGrinder: (grinderId: string, grinderData: Omit<Grinder, 'id' | 'isBase'>) => void;
    markGrinderCleaned: (grinderId: string) => Grinder;
    addBrewer: (brewer: Omit<Brewer, 'id' | 'isBase'>) => Brewer;
    removeBrewer: (brewerId: string) => void;
    editBrewer: (brewerId: string, brewerData: Omit<Brewer, 'id' | 'isBase'>) => void;
    markBrewerCleaned: (brewerId: string) => Brewer;
    addRecipe: (recipe: Omit<Recipe, 'id' | 'isBase'>) => Recipe;
    removeRecipe: (recipeId: string) => void;
    editRecipe: (recipeId: string, recipeData: Omit<Recipe, 'id' | 'isBase'>) => void;
    newBrew: (brew: Omit<Brew, 'id' | 'dialIns'>) => Brew;
    markBrewUsed: (brewId: string) => Brew;
    removeBrew: (brewId: string) => void;
    editBrew: (brewId: string, brewData: Omit<Brew, 'id' | 'dialIns'>) => Brew;
    addDialIn: (brewId: string, dialIn: Omit<DialIn, 'timestamp' | 'evaluations'>) => Brew;
    removeDialIn: (brewId: string) => Brew;
    setDialInDisgusting: (brewId: string, isDisgusting: boolean) => Brew;
    addEvaluation: (brewId: string, evaluation: Omit<Evaluation, 'timestamp'>) => Brew;
    removeEvaluation: (brewId: string) => Brew;
    exportData: () => void;
    importData: (importedData: DialBeanSchema) => void;
    removeData: () => void;
}

const DialBeanContext = createContext<DialBeanContextType | null>(null);

export const DialBeanProvider: React.FC<{ 
    setMessage: (message: string) => void; 
    onPromptPWA?: () => void;
    children: React.ReactNode }> = ({ setMessage, onPromptPWA, children }) => {
    const [data, setData] = useState<DialBeanSchema | null>(null);
    const [storageAdapter, setStorageAdapter] = useState<StorageAdapter | null>(null);

    useEffect(() => {
        async function setupStorage() {
            const storageStatus = await initStorageEngine();
            console.log("Initialized storage:", storageStatus);

            // Load initial data
            const data = await storageStatus.adapter.loadData();
            setStorageAdapter(storageStatus.adapter);
            setData(data);

            // Show top banner / message toast if installed PWA mode is required for permanent storage
            if (storageStatus.shouldPromptPWA) {
                onPromptPWA?.();
            }

        }
        setupStorage();

        // storageAdapter.loadData().then((loadedData) => {
        //     setData(loadedData);
        // });
    }, []);

    // Auto-sync to LocalStorage whenever state updates
    useEffect(() => {
        if (!data) return;
        if (!storageAdapter) return;
        storageAdapter.saveData(data);
    }, [data, storageAdapter]);

    // --- ACTIONS ---

    // Generic helpers to keep the per-item usage flag lists in sync
    type UsageFlag = { id: string; brewIds: string[] };

    const addUsage = <T extends UsageFlag>(list: T[], itemId: string, brewId: string): T[] => {
        const existing = list.find((flag) => flag.id === itemId);
        if (existing) {
            if (existing.brewIds.includes(brewId)) return list;
            return list.map((flag) => (flag.id === itemId ? { ...flag, brewIds: [...flag.brewIds, brewId] } : flag));
        }
        return [...list, { id: itemId, brewIds: [brewId] } as T];
    };

    const removeUsage = <T extends UsageFlag>(list: T[], itemId: string, brewId: string): T[] => {
        return list.map((flag) => (flag.id === itemId ? { ...flag, brewIds: flag.brewIds.filter((id) => id !== brewId) } : flag));
    };

    const withoutKey = <T extends UsageFlag>(list: T[], key: string): T[] => {
        return list.filter((flag) => flag.id !== key);
    };

    const addBag = (bagData: Omit<Bag, 'id' | 'isBase'>): Bag => {
        if (!data) throw new Error('Data not loaded yet');
        const newBag: Bag = { ...bagData, id: crypto.randomUUID(), isBase: false };
        setData((prev) => (prev ? { ...prev, bags: [...prev.bags, newBag] } : prev));
        setMessage(`Added bag`);
        return newBag;
    };

    const removeBag = (bagId: string) => {
        if (!data) throw new Error('Data not loaded yet');
        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) return;
        if (bag.isBase) {
            throw new Error(`Cannot remove base bag with ID ${bagId}`);
        }
        const brewsUsingBag = data.brews.filter((brew) => brew.bagId === bagId);
        brewsUsingBag.forEach((brew) => removeBrew(brew.id));
        setData((prev) => (prev ? {
            ...prev,
            bags: prev.bags.filter((bag) => bag.id !== bagId),
            bagUsedFlags: withoutKey(prev.bagUsedFlags, bagId)
        } : prev));
        setMessage(`Removed bag`);
    };

    const editBag = (bagId: string, bagData: Omit<Bag, 'id' | 'isBase'>): Bag => {
        if (!data) throw new Error('Data not loaded yet');

        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) {
            throw new Error(`Bag with ID ${bagId} not found`);
        }
        const newBag: Bag = { ...bag, ...bagData };
        setData((prev) => (prev ? {
            ...prev,
            bags: prev.bags.map((bag) => {
                if (bag.id !== bagId) return bag;
                return newBag;
            })
        } : prev));
        setMessage(`Saved changes`);
        return newBag;
    };

    const markBagFinished = (bagId: string): Bag => {
        if (!data) throw new Error('Data not loaded yet');

        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) {
            throw new Error(`Bag with ID ${bagId} not found`);
        }
        const newBag: Bag = { ...bag, isFinished: true };
        setData((prev) => (prev ? {
            ...prev,
            bags: prev.bags.map((bag) => {
                if (bag.id !== bagId) return bag;
                return newBag;
            })
        } : prev));
        setMessage(`Marked as finished`);
        return newBag;
    };

    const markBagRestocked = (bagId: string): Bag => {
        if (!data) throw new Error('Data not loaded yet');

        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) {
            throw new Error(`Bag with ID ${bagId} not found`);
        }
        const newBag: Bag = { ...bag, isFinished: false, dateOpened: undefined };
        setData((prev) => (prev ? {
            ...prev,
            bags: prev.bags.map((bag) => {
                if (bag.id !== bagId) return bag;
                return newBag;
            })
        } : prev));
        setMessage(`Restocked`);
        return newBag;
    };

    const markBagOpened = (bagId: string): Bag => {
        if (!data) throw new Error('Data not loaded yet');

        const bag = data.bags.find((b) => b.id === bagId);
        if (!bag) {
            throw new Error(`Bag with ID ${bagId} not found`);
        }
        const newBag: Bag = { ...bag, dateOpened: new Date().toISOString() };
        setData((prev) => (prev ? {
            ...prev,
            bags: prev.bags.map((bag) => {
                if (bag.id !== bagId) return bag;
                return newBag;
            })
        } : prev));
        setMessage(`Marked as opened`);
        return newBag;
    };

    const addGrinder = (grinderData: Omit<Grinder, 'id' | 'isBase'>): Grinder => {
        if (!data) throw new Error('Data not loaded yet');
        const newGrinder: Grinder = { ...grinderData, id: crypto.randomUUID(), isBase: false };
        setData((prev) => (prev ? { ...prev, grinders: [...prev.grinders, newGrinder] } : prev));
        setMessage(`Added new grinder`);
        return newGrinder;
    };

    const editGrinder = (grinderId: string, grinderData: Omit<Grinder, 'id' | 'isBase'>): Grinder => {

        if (!data) throw new Error('Data not loaded yet');
        const grinder = data.grinders.find((g) => g.id === grinderId);
        if (!grinder) {
            throw new Error(`Grinder with ID ${grinderId} not found`);
        }
        const newGrinder: Grinder = { ...grinder, ...grinderData };
        setData((prev) => (prev ? {
            ...prev,
            grinders: prev.grinders.map((grinder) => {
                if (grinder.id !== grinderId) return grinder;
                return newGrinder;
            })
        } : prev));
        setMessage(`Saved changes`);
        return newGrinder;
    };
    const removeGrinder = (grinderId: string) => {

        if (!data) throw new Error('Data not loaded yet');
        const grinder = data.grinders.find((g) => g.id === grinderId);
        if (!grinder) return;
        if (grinder.isBase) {
            throw new Error(`Cannot remove base grinder with ID ${grinderId}`);
        }
        const grinderUsedInBrews = data.brews.filter((brew) => brew.grinderId === grinderId);
        grinderUsedInBrews.forEach((brew) => removeBrew(brew.id));
        setData((prev) => (prev ? {
            ...prev,
            grinders: prev.grinders.filter((grinder) => grinder.id !== grinderId),
            grinderUsedFlags: withoutKey(prev.grinderUsedFlags, grinderId)
        } : prev));
        setMessage(`Removed grinder`);
    };

    const markGrinderCleaned = (grinderId: string): Grinder => {
        if (!data) throw new Error('Data not loaded yet');
        const grinder = data.grinders.find((g) => g.id === grinderId);
        if (!grinder) {
            throw new Error(`Grinder with ID ${grinderId} not found`);
        }
        const newGrinder: Grinder = { ...grinder, cleanedDate: new Date().toISOString() };
        setData((prev) => (prev ? {
            ...prev,
            grinders: prev.grinders.map((grinder) => {
                if (grinder.id !== grinderId) return grinder;
                return newGrinder;
            })
        } : prev));
        setMessage(`Marked as cleaned`);
        return newGrinder;
    };

    const addBrewer = (brewerData: Omit<Brewer, 'id' | 'isBase'>): Brewer => {
        if (!data) throw new Error('Data not loaded yet');
        const newBrewer: Brewer = { ...brewerData, id: crypto.randomUUID(), isBase: false };
        setData((prev) => (prev ? { ...prev, brewers: [...prev.brewers, newBrewer] } : prev));
        setMessage(`Added brewer`);
        return newBrewer;
    };

    const editBrewer = (brewerId: string, brewerData: Omit<Brewer, 'id' | 'isBase'>): Brewer => {
        if (!data) throw new Error('Data not loaded yet');
        const brewer = data.brewers.find((b) => b.id === brewerId);
        if (!brewer) {
            throw new Error(`Brewer with ID ${brewerId} not found`);
        }
        const newBrewer: Brewer = { ...brewer, ...brewerData };
        setData((prev) => (prev ? {
            ...prev,
            brewers: prev.brewers.map((brewer) => {
                if (brewer.id !== brewerId) return brewer;
                return newBrewer;
            })
        } : prev));
        setMessage(`Saved changes`);
        return newBrewer;
    };

    const removeBrewer = (brewerId: string) => {
        if (!data) throw new Error('Data not loaded yet');
        const brewer = data.brewers.find((b) => b.id === brewerId);
        if (!brewer) return;
        if (brewer.isBase) {
            throw new Error(`Cannot remove base brewer with ID ${brewerId}`);
        }
        const brewsUsingBrewer = data.brews.filter((brew) => brew.brewerId === brewerId);
        brewsUsingBrewer.forEach((brew) => removeBrew(brew.id));
        setData((prev) => (prev ? {
            ...prev,
            brewers: prev.brewers.filter((brewer) => brewer.id !== brewerId),
            brewerUsedFlags: withoutKey(prev.brewerUsedFlags, brewerId)
        } : prev));
        setMessage(`Removed brewer`);
    };

    const markBrewerCleaned = (brewerId: string): Brewer => {
        if (!data) throw new Error('Data not loaded yet');
        const brewer = data.brewers.find((b) => b.id === brewerId);
        if (!brewer) {
            throw new Error(`Brewer with ID ${brewerId} not found`);
        }
        const newBrewer: Brewer = { ...brewer, cleanedDate: new Date().toISOString() };
        setData((prev) => (prev ? {
            ...prev,
            brewers: prev.brewers.map((brewer) => {
                if (brewer.id !== brewerId) return brewer;
                return newBrewer;
            })
        } : prev));
        setMessage(`Marked as cleaned`);
        return newBrewer;
    };

    const addRecipe = (recipeData: Omit<Recipe, 'id' | 'isBase'>): Recipe => {
        if (!data) throw new Error('Data not loaded yet');
        const newRecipe: Recipe = { ...recipeData, id: crypto.randomUUID(), isBase: false };
        setData((prev) => (prev ? { ...prev, recipes: [...prev.recipes, newRecipe] } : prev));
        setMessage(`Added new recipe`);
        return newRecipe;
    };

    const editRecipe = (recipeId: string, recipeData: Omit<Recipe, 'id' | 'isBase'>): Recipe => {
        if (!data) throw new Error('Data not loaded yet');
        const recipe = data.recipes.find((r) => r.id === recipeId);
        if (!recipe) {
            throw new Error(`Recipe with ID ${recipeId} not found`);
        }
        const newRecipe: Recipe = { ...recipe, ...recipeData };
        setData((prev) => (prev ? {
            ...prev,
            recipes: prev.recipes.map((recipe) => {
                if (recipe.id !== recipeId) return recipe;
                return newRecipe;
            })
        } : prev));
        setMessage(`Saved changes`);
        return newRecipe;
    };

    const removeRecipe = (recipeId: string) => {
        if (!data) throw new Error('Data not loaded yet');
        const recipe = data.recipes.find((r) => r.id === recipeId);
        if (!recipe) return;
        if (recipe.isBase) {
            throw new Error(`Cannot remove base recipe with ID ${recipeId}`);
        }
        const brewsUsingRecipe = data.brews.filter((brew) => brew.recipeId === recipeId);
        brewsUsingRecipe.forEach((brew) => removeBrew(brew.id));
        setData((prev) => (prev ? {
            ...prev,
            recipes: prev.recipes.filter((recipe) => recipe.id !== recipeId),
            recipeUsedFlags: withoutKey(prev.recipeUsedFlags, recipeId)
        } : prev));
        setMessage(`Removed recipe`);
    };

    const newBrew = (brewData: Omit<Brew, 'id' | 'dialIns'>): Brew => {
        if (!data) throw new Error('Data not loaded yet');
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
        setData((prev) => (prev ? {
            ...prev,
            brews: [...prev.brews, newBrew],
            bagUsedFlags: addUsage(prev.bagUsedFlags, bagId, newBrew.id),
            recipeUsedFlags: addUsage(prev.recipeUsedFlags, recipeId, newBrew.id),
            grinderUsedFlags: addUsage(prev.grinderUsedFlags, grinderId, newBrew.id),
            brewerUsedFlags: addUsage(prev.brewerUsedFlags, brewerId, newBrew.id)
        } : prev));
        setMessage(`Added brew`);
        return newBrew;
    };

    const markBrewUsed = (brewId: string): Brew => {
        if (!data) throw new Error('Data not loaded yet');
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
        setData((prev) => (prev ? {
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        } : prev));
        // no meessage here, silent for notification handling later
        return newBrew;
    };


    const setDialInDisgusting = (brewId: string, isDisgusting: boolean = true): Brew => {
        if (!data) throw new Error('Data not loaded yet');
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
        setData((prev) => (prev ? {
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        } : prev));
        setMessage(`Marked disgusting`);
        return newBrew;
    };


    const removeBrew = (brewId: string) => {
        if (!data) throw new Error('Data not loaded yet');
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) return;
        setData((prev) => (prev ? {
            ...prev,
            brews: prev.brews.filter((d) => d.id !== brewId),
            bagUsedFlags: removeUsage(prev.bagUsedFlags, brew.bagId, brewId),
            recipeUsedFlags: removeUsage(prev.recipeUsedFlags, brew.recipeId, brewId),
            grinderUsedFlags: removeUsage(prev.grinderUsedFlags, brew.grinderId, brewId),
            brewerUsedFlags: removeUsage(prev.brewerUsedFlags, brew.brewerId, brewId)
        } : prev));
        setMessage(`Removed brew`);
    }

    const editBrew = (brewId: string, brewData: Omit<Brew, 'id' | 'dialIns'>): Brew => {
        if (!data) throw new Error('Data not loaded yet');
        const brew = data.brews.find((d) => d.id === brewId);
        if (!brew) {
            throw new Error(`Brew with ID ${brewId} not found`);
        }
        const newBrew: Brew = {
            ...brew,
            ...brewData
        };
        setData((prev) => (prev ? {
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            }),
            bagUsedFlags: addUsage(removeUsage(prev.bagUsedFlags, brew.bagId, brewId), newBrew.bagId, brewId),
            recipeUsedFlags: addUsage(removeUsage(prev.recipeUsedFlags, brew.recipeId, brewId), newBrew.recipeId, brewId),
            grinderUsedFlags: addUsage(removeUsage(prev.grinderUsedFlags, brew.grinderId, brewId), newBrew.grinderId, brewId),
            brewerUsedFlags: addUsage(removeUsage(prev.brewerUsedFlags, brew.brewerId, brewId), newBrew.brewerId, brewId)
        } : prev));
        setMessage(`Saved changes`);
        return newBrew;
    }

    const removeDialIn = (brewId: string) => {
        if (!data) throw new Error('Data not loaded yet');
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
        setData((prev) => (prev ? {
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        } : prev));
        setMessage(`Removed Dial-in`);
        return newBrew;
    }

    const addEvaluation = (
        brewId: string,
        evalData: Omit<Evaluation, 'timestamp'>
    ): Brew => {
        if (!data) throw new Error('Data not loaded yet');
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
        setData((prev) => (prev ? {
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        } : prev));
        setMessage(`Added evaluation`);
        return newBrew;
    };

    const removeEvaluation = (brewId: string) => {
        if (!data) throw new Error('Data not loaded yet');
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
        setData((prev) => (prev ? {
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        } : prev));
        setMessage(`Removed evaluation`);
        return newBrew;
    };

    const addDialIn = (
        brewId: string, dialIn: Omit<DialIn, 'timestamp' | 'evaluations'>
    ): Brew => {
        if (!data) throw new Error('Data not loaded yet');
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
        setData((prev) => (prev ? {
            ...prev,
            brews: prev.brews.map((d) => {
                if (d.id !== brewId) return d;
                return newBrew;
            })
        } : prev));
        setMessage(`Added Dial-in`);
        return newBrew;
    };

    const exportData = () => {
        if (!data) throw new Error('Data not loaded yet');
        // Exclude base library items so exports only contain user-defined data.
        const userOnlyData: DialBeanSchema = {
            version: data.version,
            bags: data.bags.filter((item) => !item.isBase),
            grinders: data.grinders.filter((item) => !item.isBase),
            brewers: data.brewers.filter((item) => !item.isBase),
            recipes: data.recipes.filter((item) => !item.isBase),
            brews: data.brews,
            bagUsedFlags: data.bagUsedFlags,
            grinderUsedFlags: data.grinderUsedFlags,
            brewerUsedFlags: data.brewerUsedFlags,
            recipeUsedFlags: data.recipeUsedFlags,
        };
        const blob = new Blob([JSON.stringify(userOnlyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dialbean-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setMessage('Exported data');
    };

    const importData = (importedData: DialBeanSchema) => {
        if (
            !importedData ||
            !Array.isArray(importedData.bags) ||
            !Array.isArray(importedData.grinders) ||
            !Array.isArray(importedData.brewers) ||
            !Array.isArray(importedData.recipes) ||
            !Array.isArray(importedData.brews)
        ) {
            throw new Error('Invalid DialBean data file');
        }
        setData({
            version: importedData.version ?? 1,
            bags: importedData.bags,
            grinders: importedData.grinders,
            brewers: importedData.brewers,
            recipes: importedData.recipes,
            brews: importedData.brews,
            bagUsedFlags: importedData.bagUsedFlags ?? [],
            grinderUsedFlags: importedData.grinderUsedFlags ?? [],
            brewerUsedFlags: importedData.brewerUsedFlags ?? [],
            recipeUsedFlags: importedData.recipeUsedFlags ?? [],
        });
        setMessage('Imported data - all previous data replaced');
        //go to home page
        window.location.href = '/';
    };
    const removeData = () => {
        removeAllData();
        setData(null);
        setMessage('Removed all data');
        //go to home page
        window.location.href = '/';
    }

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
                markBrewerCleaned,
                exportData,
                importData,
                removeData
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