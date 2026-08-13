import { useState } from 'react';

import type { Bag, Brew, Brewer, Grinder, Recipe } from './types';
import { useDialBean } from './DialBeanContext';
import { NewBrewDialog, BrewDetailsDialog } from './dialogs';
import { DialBeanLargeIcon } from "./icons";
import { BrewCard } from './Cards';


const Counter = () => {
    const { data, newBrew, addBag, addBrewer, addGrinder, addRecipe,
        removeBag, removeBrewer, removeGrinder, removeRecipe
    } = useDialBean();
    const brews: Brew[] = data.brews;
    const brewGrinders: Grinder[] = brews.map(brew => data.grinders.find(grinder => grinder.id === brew.grinderId)) as Grinder[];
    const brewBrewers: Brewer[] = brews.map(brew => data.brewers.find(brewer => brewer.id === brew.brewerId)) as Brewer[];
    const brewRecipes: Recipe[] = brews.map(brew => data.recipes.find(recipe => recipe.id === brew.recipeId)) as Recipe[];
    const brewBags: Bag[] = brews.map(brew => data.bags.find(bag => bag.id === brew.bagId)) as Bag[];
    const [selectedBrew, setSelectedBrew] = useState<Brew | null>(null);
    const [newBrewActive, setNewBrewActive] = useState(false);

    return (
        <div className="flex flex-col items-center justify-start w-full h-full">
            <div className="w-full h-full p-4 flex flex-col">
                <div className="w-full flex  items-center justify-start gap-1 mb-2 landscape:mb-1">
                    <DialBeanLargeIcon />
                    <h1>Counter</h1>
                </div>
                <div className="w-full h-full overflow-y-auto flex flex-col gap-2">
                    {brews.length > 0 ? (
                        brews.map((brew, index) =>
                            <BrewCard key={brew.id}
                                brew={brew}
                                bag={brewBags[index]}
                                brewer={brewBrewers[index]}
                                grinder={brewGrinders[index]}
                                recipe={brewRecipes[index]}
                                onSelected={() => setSelectedBrew(brew)} />
                        )
                    ) : (
                        <div>No brews available.</div>
                    )}
                </div>
                <button onClick={() => setNewBrewActive(true)} className="mt-2 landscape:mt-1">New Brew</button>
                {newBrewActive && (
                    <NewBrewDialog
                        onSaveBrew={(brew) => {
                            newBrew(brew.name, brew.bagId, brew.brewerId, brew.grinderId, brew.recipeId);
                            setNewBrewActive(false);
                        }}
                        onCancel={() => setNewBrewActive(false)}
                        onAddBrewer={addBrewer}
                        onAddGrinder={addGrinder}
                        onAddBag={addBag}
                        onAddRecipe={addRecipe}
                        bags={data.bags}
                        brewers={data.brewers}
                        grinders={data.grinders}
                        recipes={data.recipes}
                        brews={data.brews}
                        onRemoveBag={(bag) => removeBag((bag as Bag).id)}
                        onRemoveBrewer={(brewer) => removeBrewer((brewer as Brewer).id)}
                        onRemoveGrinder={(grinder) => removeGrinder((grinder as Grinder).id)}
                        onRemoveRecipe={(recipe) => removeRecipe((recipe as Recipe).id)}
                    />
                )}
                {selectedBrew && (
                    <BrewDetailsDialog
                        key={selectedBrew.id}
                        brew={selectedBrew}
                        onClose={() => setSelectedBrew(null)}
                        brewers={data.brewers}
                        bags={data.bags}
                        grinders={data.grinders}
                        recipes={data.recipes}
                        onAddBrewer={addBrewer}
                        onAddGrinder={addGrinder}
                        onAddBag={addBag}
                        onAddRecipe={addRecipe}
                    />
                )}
            </div>
        </div>
    )
}

export default Counter;




