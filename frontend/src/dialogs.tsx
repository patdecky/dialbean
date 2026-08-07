import { useState } from 'react';
import type { Brew, Brewer, Recipe, Grinder, Bag } from './types';
import { useDileBean } from './DileBeanContext';

export const PickBrewerDialog = ({ onBrewerSelected, onCancel }: { onBrewerSelected: (brewer: Brewer) => void; onCancel: () => void }) => {
    const { data } = useDileBean();
    const brewers: Brewer[] = data.brewers;
    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <div>Pick Brewer</div>
            <ul>
                {brewers.length > 0 ? (
                    brewers.map((brewer) => (
                        <li key={brewer.id} onClick={() => onBrewerSelected(brewer)}>
                            {brewer.name} — {brewer.method}
                        </li>
                    ))
                ) : (
                    <li>No brewers available.</li>
                )}
            </ul>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

export const PickGrinderDialog = ({ onGrinderSelected, onCancel }: { onGrinderSelected: (grinder: Grinder) => void; onCancel: () => void }) => {
    const { data } = useDileBean();
    const grinders = data.grinders;
    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <div>Pick Grinder</div>
            <ul>
                {grinders.length > 0 ? (
                    grinders.map((grinder) => (
                        <li key={grinder.id} onClick={() => onGrinderSelected(grinder)}>
                            {grinder.name}
                        </li>
                    ))
                ) : (
                    <li>No grinders available.</li>
                )}
            </ul>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

export const PickBagDialog = ({ onBagSelected, onCancel }: { onBagSelected: (bag: Bag) => void; onCancel: () => void }) => {
    const { data } = useDileBean();
    const bags = data.bags;
    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <div>Pick Bag</div>
            <ul>
                {bags.length > 0 ? (
                    bags.map((bag) => (
                        <li key={bag.id} onClick={() => onBagSelected(bag)}>
                            {bag.name}
                        </li>
                    ))
                ) : (
                    <li>No bags available.</li>
                )}
            </ul>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

export const PickRecipeDialog = ({ onRecipeSelected, onCancel }: { onRecipeSelected: (recipe: Recipe) => void; onCancel: () => void }) => {
    const { data } = useDileBean();
    const recipes = data.recipes;
    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <div>Pick Recipe</div>
            <ul>
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <li key={recipe.id} onClick={() => onRecipeSelected(recipe)}>
                            {recipe.name} — {recipe.brewMethod}
                        </li>
                    ))
                ) : (
                    <li>No recipes available.</li>
                )}
            </ul>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

export const NewBrewDialog = ({ brew, brewerId, grinderId, bagId, recipeId, onSaveBrew, onCancel }: { brew?: Brew; brewerId?: string; grinderId?: string; bagId?: string; recipeId?: string; onSaveBrew: (brew: Brew) => void; onCancel: () => void }) => {
    const { data, getBrewDefaultName } = useDileBean();
    const [name, setName] = useState(brew?.name || '');
    const [brewer, setBrewer] = useState(
        (
            brew?.brewerId && data.brewers.find((b) => b.id === brew.brewerId)) ||
        data.brewers.find((b) => b.id === brewerId
        ) ||
        null
    );
    const [grinder, setGrinder] = useState(
        (
            brew?.grinderId && data.grinders.find((g) => g.id === brew.grinderId)) ||
        data.grinders.find((g) => g.id === grinderId
        ) ||
        null
    );
    const [bag, setBag] = useState(
        (
            brew?.bagId && data.bags.find((b) => b.id === brew.bagId)) ||
        data.bags.find((b) => b.id === bagId
        ) ||
        null
    );
    const [recipe, setRecipe] = useState(
        (
            brew?.recipeId && data.recipes.find((r) => r.id === brew.recipeId)) ||
        data.recipes.find((r) => r.id === recipeId
        ) ||
        null
    );

    const [pickBrewerActive, setPickBrewerActive] = useState(false);
    const [pickGrinderActive, setPickGrinderActive] = useState(false);
    const [pickBagActive, setPickBagActive] = useState(false);
    const [pickRecipeActive, setPickRecipeActive] = useState(false);


    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <div>New Brew</div>
            <input type="text" value={name || getBrewDefaultName(brew?.id || '')} onChange={(e) => setName(e.target.value)} placeholder="Brew Name" />
            <div>Brewer: {brewer ? brewer.name : 'None selected'}
                <button onClick={() => setPickBrewerActive(true)}>Pick</button>
            </div>
            <div>Grinder: {grinder ? grinder.name : 'None selected'}
                <button onClick={() => setPickGrinderActive(true)}>Pick</button>
            </div>
            <div>Bag: {bag ? bag.name : 'None selected'}
                <button onClick={() => setPickBagActive(true)}>Pick</button>
            </div>
            <div>Recipe: {recipe ? recipe.name : 'None selected'}
                <button onClick={() => setPickRecipeActive(true)}>Pick</button>
            </div>
            <button onClick={() => onSaveBrew({ ...brew || {}, 
            id: crypto.randomUUID(), 
            name: name || getBrewDefaultName(brew?.id || ''), 
            brewerId: brewer?.id || '', 
            grinderId: grinder?.id || '', 
            bagId: bag?.id || '', 
            recipeId: recipe?.id || '',
            timestamp: new Date().toISOString(),
            waterDelta: brew?.waterDelta || 0,
            doseDelta: brew?.doseDelta || 0,
            tempDelta: brew?.tempDelta || 0,
            grinderDelta: brew?.grinderDelta || 0,
            evaluations: brew?.evaluations && brew.evaluations.length > 0 ? [brew.evaluations[brew.evaluations.length - 1]] : [],
        })}
                disabled={!name || !brewer || !grinder || !bag || !recipe}
            >Save Brew</button>
            {pickBrewerActive && (
                <PickBrewerDialog
                    onBrewerSelected={(brewer) => {
                        setBrewer(brewer);
                        setPickBrewerActive(false);
                    }}
                    onCancel={() => setPickBrewerActive(false)}
                />
            )}
            {pickGrinderActive && (
                <PickGrinderDialog
                    onGrinderSelected={(grinder) => {
                        setGrinder(grinder);
                        setPickGrinderActive(false);
                    }}
                    onCancel={() => setPickGrinderActive(false)}
                />
            )}
            {pickBagActive && (
                <PickBagDialog
                    onBagSelected={(bag) => {
                        setBag(bag);
                        setPickBagActive(false);
                    }}
                    onCancel={() => setPickBagActive(false)}
                />
            )}
            {pickRecipeActive && (
                <PickRecipeDialog
                    onRecipeSelected={(recipe) => {
                        setRecipe(recipe);
                        setPickRecipeActive(false);
                    }}
                    onCancel={() => setPickRecipeActive(false)}
                />
            )}
            <button onClick={onCancel}>Cancel</button>

        </div>
    );
}