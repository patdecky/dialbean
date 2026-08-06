import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
    DileBeanSchema,
    UserBag,
    UserGrinder,
    UserBrewer,
    UserRecipe,
    Brew,
    Evaluation
} from './types';
import type { StorageAdapter } from './adapter';
import { LocalStorageAdapter } from './adapter';

interface DileBeanContextType {
    data: DileBeanSchema;
    // Quick Actions
    addUserBag: (bag: Omit<UserBag, 'id' | 'isBaseBag'>) => void;
    removeUserBag: (bagId: string) => void;
    addUserGrinder: (grinder: Omit<UserGrinder, 'id' | 'isBaseGrinder'>) => void;
    removeUserGrinder: (grinderId: string) => void;
    addUserBrewer: (brewer: Omit<UserBrewer, 'id' | 'isBaseBrewer'>) => void;
    removeUserBrewer: (brewerId: string) => void;
    addUserRecipe: (recipe: Omit<UserRecipe, 'id' | 'isBaseRecipe'>) => void;
    removeUserRecipe: (recipeId: string) => void;
    newBrew: (bagId: string, brewerId: string, isBaseBrewer:boolean, grinderId: string, isBaseGrinder:boolean, recipeId: string, isBaseRecipe:boolean) => Brew;
    markBrewUsed: (brewId: string) => Brew;
    setBrewDisgusting: (brewId: string, isDisgusting: boolean) => Brew;
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

    const addUserBag = (bagData: Omit<UserBag, 'id' | 'isBaseBag'>) => {
        const newBag: UserBag = { ...bagData, id: crypto.randomUUID(), isBaseBag: false };
        setData((prev) => ({ ...prev, bags_user: [...prev.bags_user, newBag] }));
    };

    const removeUserBag = (bagId: string) => {
        setData((prev) => ({
            ...prev,
            bags_user: prev.bags_user.filter((bag) => bag.id !== bagId)
        }));
    };

    const addUserGrinder = (grinderData: Omit<UserGrinder, 'id'| 'isBaseGrinder'>) => {
        const newGrinder: UserGrinder = { ...grinderData, id: crypto.randomUUID(), isBaseGrinder: false };
        setData((prev) => ({ ...prev, grinders_user: [...prev.grinders_user, newGrinder] }));
    };
    const removeUserGrinder = (grinderId: string) => {
        setData((prev) => ({
            ...prev,
            grinders_user: prev.grinders_user.filter((grinder) => grinder.id !== grinderId)
        }));
    };

    const addUserBrewer = (brewerData: Omit<UserBrewer, 'id'| 'isBaseBrewer'>) => {
        const newBrewer: UserBrewer = { ...brewerData, id: crypto.randomUUID(), isBaseBrewer: false };
        setData((prev) => ({ ...prev, brewers_user: [...prev.brewers_user, newBrewer] }));
    };

    const removeUserBrewer = (brewerId: string) => {
        setData((prev) => ({
            ...prev,
            brewers_user: prev.brewers_user.filter((brewer) => brewer.id !== brewerId)
        }));
    }

    const addUserRecipe = (recipeData: Omit<UserRecipe, 'id' | 'isBaseRecipe'>) => {
        const newRecipe: UserRecipe = { ...recipeData, id: crypto.randomUUID(), isBaseRecipe: false };
        setData((prev) => ({ ...prev, recipes_user: [...prev.recipes_user, newRecipe] }));
    };

    const removeUserRecipe = (recipeId: string) => {
        setData((prev) => ({
            ...prev,
            recipes_user: prev.recipes_user.filter((recipe) => recipe.id !== recipeId)
        }));
    };

    const newBrew = (
        bagId: string,
        brewerId: string,
        isBaseBrewer: boolean,
        grinderId: string,
        isBaseGrinder: boolean,
        recipeId: string,
        isBaseRecipe: boolean
    ): Brew => {
        let recipe;
        if (isBaseRecipe) {
            recipe = data.recipes_base.find((r) => r.id === recipeId);
        } else {
            recipe = data.recipes_user.find((r) => r.id === recipeId);
        }
        let grinder;
        if (isBaseGrinder) {
            grinder = data.grinders_base.find((g) => g.id === grinderId);
        } else {
            grinder = data.grinders_user.find((g) => g.id === grinderId);
        }
        let brewer;
        if (isBaseBrewer) {
            brewer = data.brewers_base.find((b) => b.id === brewerId);
        } else {
            brewer = data.brewers_user.find((b) => b.id === brewerId);
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

        setData((prev) => ({ ...prev, brews: [...prev.brews, newBrew] }));
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

    const removeBrew = (brewId: string) => {
        setData((prev) => ({
            ...prev,
            brews: prev.brews.filter((d) => d.id !== brewId)
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
                addUserBag,
                removeUserBag,
                addUserGrinder,
                removeUserGrinder,
                addUserBrewer,
                removeUserBrewer,
                addUserRecipe,
                removeUserRecipe,
                newBrew,
                markBrewUsed,
                setBrewDisgusting,
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