import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DileBeanStorageSchema,
  CoffeeBag,
  Grinder,
  Brewer,
  BaseRecipe,
  BagDialIn,
  BrewEvaluation
} from '../types';
import { LocalStorageAdapter, StorageAdapter } from '../storage/adapter';

interface DileBeanContextType {
  data: DileBeanStorageSchema;
  // Quick Actions
  addCoffeeBag: (bag: Omit<CoffeeBag, 'id'>) => void;
  addGrinder: (grinder: Omit<Grinder, 'id'>) => void;
  addBrewer: (brewer: Omit<Brewer, 'id'>) => void;
  createDialIn: (bagId: string, brewerId: string, grinderId: string, baseRecipeId: string) => BagDialIn;
  logBrewEvaluation: (dialInId: string, evaluation: Omit<BrewEvaluation, 'id' | 'timestamp'>) => void;
  updateDialInLevers: (dialInId: string, tweaks: { doseGrams?: number; tempC?: number; grindClick?: number }) => void;
}

// Single instance of your storage adapter
const storageAdapter: StorageAdapter = new LocalStorageAdapter();

const DileBeanContext = createContext<DileBeanContextType | null>(null);

export const DileBeanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DileBeanStorageSchema>(() => storageAdapter.loadData());

  // Auto-sync to LocalStorage whenever state updates
  useEffect(() => {
    storageAdapter.saveData(data);
  }, [data]);

  // --- ACTIONS ---

  const addCoffeeBag = (bagData: Omit<CoffeeBag, 'id'>) => {
    const newBag: CoffeeBag = { ...bagData, id: crypto.randomUUID() };
    setData((prev) => ({ ...prev, bags: [...prev.bags, newBag] }));
  };

  const addGrinder = (grinderData: Omit<Grinder, 'id'>) => {
    const newGrinder: Grinder = { ...grinderData, id: crypto.randomUUID() };
    setData((prev) => ({ ...prev, grinders: [...prev.grinders, newGrinder] }));
  };

  const addBrewer = (brewerData: Omit<Brewer, 'id'>) => {
    const newBrewer: Brewer = { ...brewerData, id: crypto.randomUUID() };
    setData((prev) => ({ ...prev, brewers: [...prev.brewers, newBrewer] }));
  };

  const createDialIn = (
    bagId: string,
    brewerId: string,
    grinderId: string,
    baseRecipeId: string
  ): BagDialIn => {
    const recipe = data.baseRecipes.find((r) => r.id === baseRecipeId);
    const grinder = data.grinders.find((g) => g.id === grinderId);

    // Calculate initial physical grind click from relative %
    const grindPct = recipe ? recipe.defaultGrindPct : 50;
    const min = grinder ? grinder.scaleMin : 1;
    const max = grinder ? grinder.scaleMax : 30;
    const initialClick = Math.round((min + (grindPct / 100) * (max - min)) * 2) / 2;

    const newDialIn: BagDialIn = {
      id: crypto.randomUUID(),
      bagId,
      brewerId,
      grinderId,
      baseRecipeId,
      currentWaterMl: recipe ? recipe.defaultWaterMl : 250,
      currentDoseGrams: recipe ? recipe.defaultDoseGrams : 15,
      currentTempC: recipe ? recipe.defaultTempC : 92,
      currentGrindClick: initialClick,
      isDelicious: false,
      evaluations: [],
      activeDeadZoneGrindClicks: []
    };

    setData((prev) => ({ ...prev, dialIns: [...prev.dialIns, newDialIn] }));
    return newDialIn;
  };

  const logBrewEvaluation = (
    dialInId: string,
    evalData: Omit<BrewEvaluation, 'id' | 'timestamp'>
  ) => {
    const newEval: BrewEvaluation = {
      ...evalData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    setData((prev) => ({
      ...prev,
      dialIns: prev.dialIns.map((d) => {
        if (d.id !== dialInId) return d;

        const updatedDeadZones = evalData.isDisgusting
          ? [...d.activeDeadZoneGrindClicks, d.currentGrindClick]
          : d.activeDeadZoneGrindClicks;

        return {
          ...d,
          isDelicious: evalData.isDelicious || d.isDelicious,
          evaluations: [newEval, ...d.evaluations],
          activeDeadZoneGrindClicks: updatedDeadZones
        };
      })
    }));
  };

  const updateDialInLevers = (
    dialInId: string,
    tweaks: { doseGrams?: number; tempC?: number; grindClick?: number }
  ) => {
    setData((prev) => ({
      ...prev,
      dialIns: prev.dialIns.map((d) => {
        if (d.id !== dialInId) return d;
        return {
          ...d,
          currentDoseGrams: tweaks.doseGrams ?? d.currentDoseGrams,
          currentTempC: tweaks.tempC ?? d.currentTempC,
          currentGrindClick: tweaks.grindClick ?? d.currentGrindClick
        };
      })
    }));
  };

  return (
    <DileBeanContext.Provider
      value={{
        data,
        addCoffeeBag,
        addGrinder,
        addBrewer,
        createDialIn,
        logBrewEvaluation,
        updateDialInLevers
      }}
    >
      {children}
    </DileBeanContext.Provider>
  );
};

// Custom Hook for accessing data
export const useDileBean = () => {
  const context = useContext(DileBeanContext);
  if (!context) {
    throw new Error('useDileBean must be used within a DileBeanProvider');
  }
  return context;
};