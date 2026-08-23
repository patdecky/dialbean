import Dexie, { type Table } from 'dexie';
import type { Brew, BagUsedFlag, GrinderUsedFlag, BrewerUsedFlag, RecipeUsedFlag, DialBeanSchema } from './types';
import { libBags, libGrinders, libBrewers, libRecipes, libBrews } from './base_lib';

export interface StorageAdapter {
  loadData(): Promise<DialBeanSchema>;
  saveData(data: DialBeanSchema): Promise<void>;
}

// Populates the result with library items, then updates matching ids with the saved fields
// or inserts the saved item if its id isn't part of the library.
export const mergeWithLibrary = <T extends { id: string }>(libraryItems: T[], savedItems: T[]): T[] => {
  const merged = new Map<string, T>(libraryItems.map((item) => [item.id, item]));
  for (const savedItem of savedItems) {
    merged.set(savedItem.id, { ...merged.get(savedItem.id), ...savedItem });
  }
  return Array.from(merged.values());
};

// TEMP: derives usage flags from base_lib's demo brews so the seeded data shows correctly used items.
// Remove this once base_lib no longer ships with example brews.
const debugBuildUsageFlags = (brews: Brew[]): {
  bagUsedFlags: BagUsedFlag[];
  grinderUsedFlags: GrinderUsedFlag[];
  brewerUsedFlags: BrewerUsedFlag[];
  recipeUsedFlags: RecipeUsedFlag[];
} => {
  const buildFlags = (getId: (brew: Brew) => string): { id: string; brewIds: string[] }[] => {
    const flags: { id: string; brewIds: string[] }[] = [];
    for (const brew of brews) {
      const id = getId(brew);
      const existing = flags.find((flag) => flag.id === id);
      if (existing) {
        existing.brewIds.push(brew.id);
      } else {
        flags.push({ id, brewIds: [brew.id] });
      }
    }
    return flags;
  };

  return {
    bagUsedFlags: buildFlags((brew) => brew.bagId),
    grinderUsedFlags: buildFlags((brew) => brew.grinderId),
    brewerUsedFlags: buildFlags((brew) => brew.brewerId),
    recipeUsedFlags: buildFlags((brew) => brew.recipeId),
  };
};

// base_lib only contains library items, so nothing is used in a brew yet.
const DEFAULT_INITIAL_DATA: DialBeanSchema = {
  version: 1,
  bags: libBags,
  grinders: libGrinders,
  brewers: libBrewers,
  recipes: libRecipes,
  brews: libBrews,
  ...debugBuildUsageFlags(libBrews),
};



/////////////////////////////////////////////////////
/////////////       Export/Import      //////////////
/////////////////////////////////////////////////////

export const mergeImportedData = (importedData: DialBeanSchema): DialBeanSchema => {
  // Merge the imported data with the existing data, prioritizing imported items.

  const mergedData: DialBeanSchema = {
    version: Math.max(importedData.version, DEFAULT_INITIAL_DATA.version),
    bags: mergeWithLibrary(DEFAULT_INITIAL_DATA.bags, importedData.bags),
    grinders: mergeWithLibrary(DEFAULT_INITIAL_DATA.grinders, importedData.grinders),
    brewers: mergeWithLibrary(DEFAULT_INITIAL_DATA.brewers, importedData.brewers),
    recipes: mergeWithLibrary(DEFAULT_INITIAL_DATA.recipes, importedData.recipes),
    brews: [...importedData.brews],
    bagUsedFlags: [...importedData.bagUsedFlags],
    grinderUsedFlags: [...importedData.grinderUsedFlags],
    brewerUsedFlags: [...importedData.brewerUsedFlags],
    recipeUsedFlags: [...importedData.recipeUsedFlags],
  };

  return mergedData;
}

export const removeAllData = (): void => {
  // Clear all data from localStorage and IndexedDB.
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
  catch (e) {
    console.error('Failed to remove data from localStorage', e);
  }
  try {
    console.log("removing all data from IndexedDB");
    // Deleting via a Dexie instance constructed from the wrong name is a no-op,
    // so close and delete the actual shared db instance instead.
    db.close();
    db.delete().catch((error) => {
      console.error('Failed to delete IndexedDB database:', error);
    });
  }
  catch (e) {
    console.error('Failed to remove data from IndexedDB', e);
  }
  try {
    localStorage.removeItem(STORAGE_KEY_PWA_DONT_SHOW_AGAIN);
  }
  catch (e) {
    console.error('Failed to remove PWA dont show again flag from localStorage', e);
  }
};



/////////////////////////////////////////////////////
///////////////     Local Storage    ////////////////
/////////////////////////////////////////////////////

const STORAGE_KEY_PWA_DONT_SHOW_AGAIN = 'dialbean_pwa_dont_show_again';

export const getStorageDontShowAgainFlag = async (): Promise<boolean> => {
  const flag = localStorage.getItem(STORAGE_KEY_PWA_DONT_SHOW_AGAIN);
  return flag === 'true';
}

export const setStorageDontShowAgainFlag = async (value: boolean): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY_PWA_DONT_SHOW_AGAIN, value.toString());
  } catch (e) {
    console.error('Failed to save PWA don\'t show again flag to localStorage', e);
  }
}

const LOCAL_STORAGE_KEY = 'dialbean_data';

export class LocalStorageAdapter implements StorageAdapter {
  async loadData(): Promise<DialBeanSchema> {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!raw) {
      await this.saveData(DEFAULT_INITIAL_DATA);
      return DEFAULT_INITIAL_DATA;
    }

    try {
      const savedData: DialBeanSchema = JSON.parse(raw);

      // Populate with the library, then update or insert from the saved user items.
      const combinedData: DialBeanSchema = {
        version: savedData.version || 1,
        bags: mergeWithLibrary(libBags, savedData.bags || []),
        grinders: mergeWithLibrary(libGrinders, savedData.grinders || []),
        brewers: mergeWithLibrary(libBrewers, savedData.brewers || []),
        recipes: mergeWithLibrary(libRecipes, savedData.recipes || []),
        brews: savedData.brews || [],
        bagUsedFlags: savedData.bagUsedFlags ?? [],
        grinderUsedFlags: savedData.grinderUsedFlags ?? [],
        brewerUsedFlags: savedData.brewerUsedFlags ?? [],
        recipeUsedFlags: savedData.recipeUsedFlags ?? [],
      };

      return combinedData;
    } catch (e) {
      console.error('Failed to parse DialBean localStorage data', e);
      return DEFAULT_INITIAL_DATA;
    }
  }

  async saveData(data: DialBeanSchema): Promise<void> {
    try {
      // Replace storage completely with only user items so the persisted state is always clean.
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

      // Populate with the library, then update or insert from the saved user items.
      const combinedData: DialBeanSchema = {
        version: savedData.version || 1,
        bags: mergeWithLibrary(libBags, savedData.bags || []),
        grinders: mergeWithLibrary(libGrinders, savedData.grinders || []),
        brewers: mergeWithLibrary(libBrewers, savedData.brewers || []),
        recipes: mergeWithLibrary(libRecipes, savedData.recipes || []),
        brews: savedData.brews || [],
        bagUsedFlags: savedData.bagUsedFlags ?? [],
        grinderUsedFlags: savedData.grinderUsedFlags ?? [],
        brewerUsedFlags: savedData.brewerUsedFlags ?? [],
        recipeUsedFlags: savedData.recipeUsedFlags ?? [],
      };

      return combinedData;
    } catch (e) {
      console.error('Failed to load DialBean IndexedDB data', e);
      return DEFAULT_INITIAL_DATA;
    }
  }

  async saveData(data: DialBeanSchema): Promise<void> {
    try {
      // Replace storage completely with only user items so the persisted state is always clean.
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

      await db.appStorage.put({
        key: STORAGE_DOC_KEY,
        data: userOnlyData,
      });
    } catch (e) {
      console.error('Failed to save data to IndexedDB', e);
    }
  }
}


