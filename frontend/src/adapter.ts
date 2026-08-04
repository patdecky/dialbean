import { DileBeanStorageSchema } from '../types';

export interface StorageAdapter {
  loadData(): DileBeanStorageSchema;
  saveData(data: DileBeanStorageSchema): void;
}

const LOCAL_STORAGE_KEY = 'DILEBEAN_DATA_V1';

const DEFAULT_INITIAL_DATA: DileBeanStorageSchema = {
  version: 1,
  bags: [],
  grinders: [],
  brewers: [],
  baseRecipes: [],
  dialIns: []
};

export class LocalStorageAdapter implements StorageAdapter {
  loadData(): DileBeanStorageSchema {
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

  saveData(data: DileBeanStorageSchema): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
}