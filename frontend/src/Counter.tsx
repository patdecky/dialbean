import { useState } from 'react';

import type { Bag, Brew, Brewer, Grinder, Recipe } from './types';
import { useDialBean } from './DialBeanContext';
import { NewBrewDialog, BrewDetailsDialog } from './dialogs';


const Counter = () => {
    const { data, newBrew, addBag, addBrewer, addGrinder, addRecipe,
        removeBag, removeBrewer, removeGrinder, removeRecipe
    } = useDialBean();
    const userBrews: Brew[] = data.brews;
    const [selectedBrew, setSelectedBrew] = useState<Brew | null>(null);
    const [newBrewActive, setNewBrewActive] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="flex flex-col items-start justify-start w-96 gap-2">
                <div>My Brews</div>
                <div className="w-full overflow-y-auto flex flex-col gap-2">
                    {userBrews.length > 0 ? (
                        userBrews.map((brew) =>
                            <div key={brew.id}
                                onClick={() => setSelectedBrew(brew)}
                                className="w-full bg-gray-200 hover:bg-gray-300 cursor-pointer p-2 rounded-md">
                                {brew.name}
                            </div>
                        )
                    ) : (
                        <div>No brews available.</div>
                    )}
                    <button onClick={() => setNewBrewActive(true)}>New Brew</button>
                </div>
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




