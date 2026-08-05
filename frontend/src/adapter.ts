import { DileBeanSchema } from './types';

export interface StorageAdapter {
  loadData(): DileBeanSchema;
  saveData(data: DileBeanSchema): void;
}

const LOCAL_STORAGE_KEY = 'DILEBEAN_DATA_V1';

const DEFAULT_INITIAL_DATA: DileBeanSchema = {
  version: 1,
  bags: [],
  grinders: [],
  brewers: [],
  recipes: [],
  dialIns: []
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