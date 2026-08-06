import type { DileBeanSchema } from './types';
import { bags_base, grinders_base, brewers_base, recipes_base } from './BaseLib';

export interface StorageAdapter {
  loadData(): DileBeanSchema;
  saveData(data: DileBeanSchema): void;
}

const LOCAL_STORAGE_KEY = 'DILEBEAN_DATA_V1';

const DEFAULT_INITIAL_DATA: DileBeanSchema = {
  version: 1,
  bags_base,
  bags_user: [],
  grinders_base,
  grinders_user: [],
  brewers_base,
  brewers_user: [],
  recipes_base,
  recipes_user: [],
  brews: []
};

export class LocalStorageAdapter implements StorageAdapter {
  loadData(): DileBeanSchema {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      this.saveData(DEFAULT_INITIAL_DATA);
      return DEFAULT_INITIAL_DATA;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse DileBean storage data', e);
      return DEFAULT_INITIAL_DATA;
    }
  }

  saveData(data: DileBeanSchema): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
}