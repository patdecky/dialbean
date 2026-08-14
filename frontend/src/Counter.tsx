import { useState } from 'react';

import type { Bag, Brew, Brewer, Grinder, Recipe } from './types';
import { useDialBean } from './DialBeanContext';
import { NewBrewDialog, BrewDetailsDialog } from './components';
import { DialBeanLargeIcon } from "./icons";
import { BrewCard } from './cards';
import { ConfirmDeleteBrewModal } from './modals';

const Counter = () => {
    const { data, newBrew, addBag, addBrewer, addGrinder, addRecipe,
        removeBag, removeBrewer, removeGrinder, removeRecipe, markBagFinished,
        markBagOpened, addEvaluation, removeEvaluation
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
    const [selectedBrew, setSelectedBrew] = useState<Brew | null>(null);
    const [newBrewActive, setNewBrewActive] = useState(false);
    const [toCopyBrew, setToCopyBrew] = useState<Brew | null>(null);
    const [toEditBrew, setToEditBrew] = useState<Brew | null>(null);
    const [toDeleteBrew, setToDeleteBrew] = useState<Brew | null>(null);
    const [showFinishedBrews, setShowFinishedBrews] = useState<boolean>(false);

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
                                onSelected={() => setSelectedBrew(brew)} />
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
                                    onSelected={() => setSelectedBrew(brew)} />
                            )}
                        </>
                    ) : <button onClick={() => setShowFinishedBrews(true)}>Show Finished Brews</button>
                    )}
                </div>
                <button onClick={() => setNewBrewActive(true)} className="mt-4 landscape:mt-1">New Brew</button>
                {newBrewActive && (
                    <NewBrewDialog
                        onSaveBrew={(brew) => {
                            if (toEditBrew) {
                                // Update existing brew
                                alert("Updated brew: " + brew.name);
                                setSelectedBrew(brew);
                            } else {
                                newBrew(brew.name, brew.bagId, brew.brewerId, brew.grinderId, brew.recipeId);
                            }
                            setNewBrewActive(false);
                            setToCopyBrew(null);
                            setToEditBrew(null);
                        }}
                        onCancel={() => {
                            if (toCopyBrew) {
                                setSelectedBrew(toCopyBrew);
                            }
                            if (toEditBrew) {
                                setSelectedBrew(toEditBrew);
                            }
                            setNewBrewActive(false);
                            setToCopyBrew(null);
                            setToEditBrew(null);
                        }}
                        onAddBrewer={addBrewer}
                        onAddGrinder={addGrinder}
                        onAddBag={addBag}
                        onAddRecipe={addRecipe}
                        edit={toEditBrew !== null}
                        brew={toCopyBrew || toEditBrew || undefined}
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
                        onCopyBrew={(brew) => {
                            setToCopyBrew(brew);
                            setNewBrewActive(true);
                            setSelectedBrew(null);
                        }}
                        onEditBrew={(brew) => {
                            setToEditBrew(brew);
                            setNewBrewActive(true);
                            setSelectedBrew(null);
                        }}
                        onDeleteBrew={(brew) => {
                            setToDeleteBrew(brew);
                        }}
                        onAddBrewer={addBrewer}
                        onAddGrinder={addGrinder}
                        onAddBag={addBag}
                        onAddRecipe={addRecipe}
                        onBagFinished={(bag) => {
                            markBagFinished(bag.id);
                            setSelectedBrew(null);
                        }}
                        onBagOpened={(bag) => {
                            console.log("Bag opened: " + bag.name);
                            markBagOpened(bag.id);
                        }}
                        onSaveEvaluation={(brew, evaluation) => {
                            const newBrew = addEvaluation(brew.id, evaluation);
                            setSelectedBrew(newBrew);
                        }}
                        onDeleteEvaluation={(brew) => {
                            const newBrew = removeEvaluation(brew.id);
                            setSelectedBrew(newBrew);
                        }}
                        onSaveDialIn={(brew, dialIn) => {
                            alert("Saved dial-in for brew: " + brew.name);
                        }}
                    />
                )}
                {toDeleteBrew && (
                    <ConfirmDeleteBrewModal
                        brew={toDeleteBrew}
                        onConfirm={() => {
                            alert("Removed brew: " + toDeleteBrew.name);
                            setToDeleteBrew(null);
                            setSelectedBrew(null);
                        }}
                        onCancel={() => setToDeleteBrew(null)}
                    />
                )}
            </div>
        </div>
    )
}

export default Counter;




