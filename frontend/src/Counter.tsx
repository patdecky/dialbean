import { useState } from 'react';

import type { Bag, Brew, Brewer, Grinder, Recipe } from './types';
import { useDialBean } from './DialBeanContext';
import { NewBrewDialog, BrewDetailsDialog, BrewCard } from './components';
import { DialBeanLargeIcon } from "./icons";
import { MessageBlock } from './modals';

const Counter = ({}) => {
    const { data, 
        newBrew, 
        addBag, 
        addBrewer,
        addGrinder, 
        addRecipe,
        removeBag, 
        removeBrewer, 
        removeGrinder, 
        removeRecipe,
        editBrewer,
        editGrinder,
        editBag,
        editRecipe,
        addEvaluation, 
        removeEvaluation, 
        removeDialIn,
        addDialIn,
        editBrew, 
        removeBrew
    } = useDialBean();
    const activeBrews: Brew[] = data.brews.filter(brew => data.bags.find(bag => bag.id === brew.bagId)?.isFinished === false);
    const finishedBrews: Brew[] = data.brews.filter(brew => data.bags.find(bag => bag.id === brew.bagId)?.isFinished === true);
    const activeBrewGrinders: Grinder[] = activeBrews.map(brew => data.grinders.find(grinder => grinder.id === brew.grinderId)) as Grinder[];
    const activeBrewBrewers: Brewer[] = activeBrews.map(brew => data.brewers.find(brewer => brewer.id === brew.brewerId)) as Brewer[];
    const activeBrewRecipes: Recipe[] = activeBrews.map(brew => data.recipes.find(recipe => recipe.id === brew.recipeId)) as Recipe[];
    const activeBrewBags: Bag[] = activeBrews.map(brew => data.bags.find(bag => bag.id === brew.bagId)) as Bag[];
    const finishedBrewGrinders: Grinder[] = finishedBrews.map(brew => data.grinders.find(grinder => grinder.id === brew.grinderId)) as Grinder[];
    const finishedBrewBrewers: Brewer[] = finishedBrews.map(brew => data.brewers.find(brewer => brewer.id === brew.brewerId)) as Brewer[];
    const finishedBrewRecipes: Recipe[] = finishedBrews.map(brew => data.recipes.find(recipe => recipe.id === brew.recipeId)) as Recipe[];
    const finishedBrewBags: Bag[] = finishedBrews.map(brew => data.bags.find(bag => bag.id === brew.bagId)) as Bag[];
    const [selectedBrewId, setSelectedBrewId] = useState<string | null>(null);
    const [newBrewActive, setNewBrewActive] = useState(false);
    const [toCopyBrewId, setToCopyBrewId] = useState<string | null>(null);
    const [toEditBrewId, setToEditBrewId] = useState<string | null>(null);
    const [showFinishedBrews, setShowFinishedBrews] = useState<boolean>(false);

    const selectedBrew = selectedBrewId ? data.brews.find(brew => brew.id === selectedBrewId) : null;
    console.log("Counter render: selectedBrewId:", selectedBrewId, "selectedBrew:", selectedBrew);
    return (
        <div className="flex flex-col items-center justify-start w-full h-full">
            <div className="w-full h-full p-4 flex flex-col">
                <div className="w-full flex  items-center justify-start gap-1 mb-2 landscape:mb-1">
                    <DialBeanLargeIcon />
                    <h1>Counter</h1>
                </div>
                <div className="w-full max-h-full overflow-y-auto flex flex-col gap-2">
                    {activeBrews.length === 0 && finishedBrews.length === 0 && (
                        <div>No brews available.</div>
                    )}
                    {activeBrews.length > 0 && (
                        activeBrews.map((brew, index) =>
                            <BrewCard key={brew.id}
                                brew={brew}
                                bag={activeBrewBags[index]}
                                brewer={activeBrewBrewers[index]}
                                grinder={activeBrewGrinders[index]}
                                recipe={activeBrewRecipes[index]}
                                onSelected={() => setSelectedBrewId(brew.id)} />
                        )
                    )}
                    {finishedBrews.length > 0 && (showFinishedBrews ? (
                        <>
                        <button className="self-start sm" onClick={() => setShowFinishedBrews(false)}>Hide Finished</button>
                            {finishedBrews.map((brew, index) =>
                                <BrewCard key={brew.id}
                                    brew={brew}
                                    bag={finishedBrewBags[index]}
                                    brewer={finishedBrewBrewers[index]}
                                    grinder={finishedBrewGrinders[index]}
                                    recipe={finishedBrewRecipes[index]}
                                    onSelected={() => setSelectedBrewId(brew.id)} />
                            )}
                        </>
                    ) : <button onClick={() => setShowFinishedBrews(true)}>Show Finished Brews</button>
                    )}
                </div>
                <button onClick={() => setNewBrewActive(true)} className="mt-4 landscape:mt-1">New Brew</button>
                {newBrewActive && (
                    <NewBrewDialog
                        onSaveBrew={(brew) => {
                            if (toEditBrewId) {
                                // Update existing brew
                                const updatedBrew = editBrew(toEditBrewId, brew);
                                setSelectedBrewId(updatedBrew.id);
                            } else {
                                const newBrewObject = newBrew(brew);
                                setSelectedBrewId(newBrewObject.id);
                            }
                            setNewBrewActive(false);
                            setToCopyBrewId(null);
                            setToEditBrewId(null);
                        }}
                        onCancel={() => {
                            if (toCopyBrewId) {
                                setSelectedBrewId(toCopyBrewId);
                            }
                            if (toEditBrewId) {
                                setSelectedBrewId(toEditBrewId);
                            }
                            setNewBrewActive(false);
                            setToCopyBrewId(null);
                            setToEditBrewId(null);
                        }}
                        edit={toEditBrewId !== null}
                        brew={toCopyBrewId || toEditBrewId ? data.brews.find((b) => b.id === (toCopyBrewId || toEditBrewId)) : undefined}
                        bags={data.bags}
                        grinders={data.grinders}
                        brewers={data.brewers}
                        recipes={data.recipes}
                        brews={data.brews}
                        onAddBrewer={addBrewer}
                        onAddGrinder={addGrinder}
                        onAddBag={addBag}
                        onAddRecipe={addRecipe}
                        onEditBrewer={(id, brewer) => editBrewer(id, brewer)}
                        onEditGrinder={(id, grinder) => editGrinder(id, grinder)}
                        onEditBag={(id, bag) => editBag(id, bag)}
                        onEditRecipe={(id, recipe) => editRecipe(id, recipe)}
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
                        onClose={() => setSelectedBrewId(null)}
                        brewers={data.brewers}
                        bags={data.bags}
                        grinders={data.grinders}
                        recipes={data.recipes}
                        brews={data.brews}
                        onNewBrew={(brew) => {
                            const newBrewObject = newBrew(brew);
                            setSelectedBrewId(newBrewObject.id);
                        }}
                        onEditBrew={(id, brew) => {
                            editBrew(id, brew);
                        }}
                        onDeleteBrew={(brew) => {
                            removeBrew(brew.id);
                            setSelectedBrewId(null);
                        }}
                        onAddBrewer={addBrewer}
                        onAddGrinder={addGrinder}
                        onAddBag={addBag}
                        onAddRecipe={addRecipe}
                        onRemoveBag={(bag) => removeBag((bag as Bag).id)}
                        onRemoveBrewer={(brewer) => removeBrewer((brewer as Brewer).id)}
                        onRemoveGrinder={(grinder) => removeGrinder((grinder as Grinder).id)}
                        onRemoveRecipe={(recipe) => removeRecipe((recipe as Recipe).id)}
                        onEditBrewer={(id, brewer) => editBrewer(id, brewer)}
                        onEditGrinder={(id, grinder) => editGrinder(id, grinder)}
                        onEditBag={(id, bag) => editBag(id, bag)}
                        onEditRecipe={(id, recipe) => editRecipe(id, recipe)}
                        onSaveEvaluation={(brew, evaluation) => {
                            const newBrew = addEvaluation(brew.id, evaluation);
                            setSelectedBrewId(newBrew.id);
                        }}
                        onDeleteLastEvaluation={(brew) => {
                            const newBrew = removeEvaluation(brew.id);
                            setSelectedBrewId(newBrew.id);
                        }}
                        onDeleteLastDialIn={(brew) => {
                            const newBrew = removeDialIn(brew.id);
                            setSelectedBrewId(newBrew.id);
                        }}
                        onSaveDialIn={(brew, dialInObject) => {
                            const newBrew = addDialIn(brew.id, dialInObject);
                            setSelectedBrewId(newBrew.id);
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default Counter;




