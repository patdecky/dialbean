import type { DialBeanSchema } from './types';
import { bags, grinders, brewers, recipes } from './base_lib';

export interface StorageAdapter {
  loadData(): DialBeanSchema;
  saveData(data: DialBeanSchema): void;
}

const LOCAL_STORAGE_KEY = 'DIALBEAN_DATA_V1';

const DEFAULT_INITIAL_DATA: DialBeanSchema = {
  version: 1,
  bags: bags,
  grinders: grinders,
  brewers: brewers,
  recipes: recipes,
  brews: []
};

export class LocalStorageAdapter implements StorageAdapter {
  loadData(): DialBeanSchema {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      this.saveData(DEFAULT_INITIAL_DATA);
      return DEFAULT_INITIAL_DATA;
    }
    try {
      const savedData = JSON.parse(raw);
      // Check if any of the user data is in not in the base data and expand if needed
      const newData: DialBeanSchema = {
        version: savedData.version || 1,
        bags: [...bags, ...(savedData?.bags || [])],
        grinders: [...grinders, ...(savedData?.grinders || [])],
        brewers: [...brewers, ...(savedData?.brewers || [])],
        recipes: [...recipes, ...(savedData?.recipes || [])],
        brews: savedData?.brews || []
      };
      return newData;
    } catch (e) {
      console.error('Failed to parse DialBean storage data', e);
      return DEFAULT_INITIAL_DATA;
    }
  }

  saveData(data: DialBeanSchema): void {
    console.log('Saving data to localStorage', typeof data);
    // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

  }
}