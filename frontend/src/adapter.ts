import Dexie, { type Table } from 'dexie';
import type { Bag, DialBeanSchema, Grinder, Brewer, Recipe } from './types';
import { bags, grinders, brewers, recipes, brews } from './base_lib';


export interface StorageAdapter {
  loadData(): Promise<DialBeanSchema>;
  saveData(data: DialBeanSchema): Promise<void>;
}


const DEFAULT_INITIAL_DATA: DialBeanSchema = {
  version: 1,
  bags: bags,
  grinders: grinders,
  brewers: brewers,
  recipes: recipes,
  brews: brews
};


/////////////////////////////////////////////////////
///////////////     Local Storage    ////////////////
/////////////////////////////////////////////////////


const LOCAL_STORAGE_KEY = 'DIALBEAN_DATA';

export class LocalStorageAdapter implements StorageAdapter {
  async loadData(): Promise<DialBeanSchema> {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!raw) {
      await this.saveData(DEFAULT_INITIAL_DATA);
      return DEFAULT_INITIAL_DATA;
    }

    try {
      const savedData: DialBeanSchema = JSON.parse(raw);

      // Storage only contains user items, so combine fresh base_lib + saved user items
      const combinedData: DialBeanSchema = {
        version: savedData.version || 1,
        bags: [...bags, ...(savedData.bags || [])],
        grinders: [...grinders, ...(savedData.grinders || [])],
        brewers: [...brewers, ...(savedData.brewers || [])],
        recipes: [...recipes, ...(savedData.recipes || [])],
        brews: savedData.brews || [],
      };

      return combinedData;
    } catch (e) {
      console.error('Failed to parse DialBean localStorage data', e);
      return DEFAULT_INITIAL_DATA;
    }
  }

  async saveData(data: DialBeanSchema): Promise<void> {
    try {
      // Strip out base library items before persisting
      const userOnlyData: DialBeanSchema = {
        version: data.version,
        bags: data.bags.filter((item: Bag) => !item.isBase),
        grinders: data.grinders.filter((item: Grinder) => !item.isBase),
        brewers: data.brewers.filter((item: Brewer) => !item.isBase),
        recipes: data.recipes.filter((item: Recipe) => !item.isBase),
        brews: data.brews,
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userOnlyData));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
    }
  }
}

/////////////////////////////////////////////////////
///////////////       IndexedDB      ////////////////
/////////////////////////////////////////////////////

interface StorageDocument {
  key: string;
  data: DialBeanSchema;
}

class DialBeanDexieDB extends Dexie {
  appStorage!: Table<StorageDocument, string>;

  constructor() {
    super('DialBeanDatabase');
    this.version(1).stores({
      appStorage: 'key', // Primary key
    });
  }
}

const db = new DialBeanDexieDB();
const STORAGE_DOC_KEY = 'dialbean_schema_doc';

export class IndexedDBAdapter implements StorageAdapter {
  async loadData(): Promise<DialBeanSchema> {
    try {
      const record = await db.appStorage.get(STORAGE_DOC_KEY);

      if (!record || !record.data) {
        await this.saveData(DEFAULT_INITIAL_DATA);
        return DEFAULT_INITIAL_DATA;
      }

      const savedData = record.data;

      // Combine fresh base_lib items with stored user items
      const combinedData: DialBeanSchema = {
        version: savedData.version || 1,
        bags: [...bags, ...(savedData.bags || [])],
        grinders: [...grinders, ...(savedData.grinders || [])],
        brewers: [...brewers, ...(savedData.brewers || [])],
        recipes: [...recipes, ...(savedData.recipes || [])],
        brews: savedData.brews || [],
      };

      return combinedData;
    } catch (e) {
      console.error('Failed to load DialBean IndexedDB data', e);
      return DEFAULT_INITIAL_DATA;
    }
  }

  async saveData(data: DialBeanSchema): Promise<void> {
    try {
      // Strip out all base library items before persisting
      const userOnlyData: DialBeanSchema = {
        version: data.version,
        bags: data.bags.filter((item: Bag) => !item.isBase),
        grinders: data.grinders.filter((item: Grinder) => !item.isBase),
        brewers: data.brewers.filter((item: Brewer) => !item.isBase),
        recipes: data.recipes.filter((item: Recipe) => !item.isBase),
        brews: data.brews,
      };

      await db.appStorage.put({
        key: STORAGE_DOC_KEY,
        data: userOnlyData,
      });
    } catch (e) {
      console.error('Failed to save data to IndexedDB', e);
    }
  }
}