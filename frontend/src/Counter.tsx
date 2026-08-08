import { useState } from 'react';

import type { Brew } from './types';
import { useDialBean } from './DialBeanContext';
import { NewBrewDialog } from './dialogs';

const BrewDetails = ({ brew, onClose }: { brew: Brew; onClose: () => void }) => {
    const { data } = useDialBean();
    const brewer = data.brewers.find((b) => b.id === brew.brewerId);
    const grinder = data.grinders.find((g) => g.id === brew.grinderId);
    const bag = data.bags.find((b) => b.id === brew.bagId);
    const recipe = data.recipes.find((r) => r.id === brew.recipeId);

    return (
        <div className="w-full bg-gray-300 border p-2 rounded-md relative">
            <button className="absolute top-2 right-2" onClick={onClose}>Close</button>
            <div>Brew Details: {brew.name}</div>
            <div>Brewer: {brewer?.name || 'Unknown Brewer'}</div>
            <div>Grinder: {grinder?.name || 'Unknown Grinder'}</div>
            <div>Bag: {bag?.name || 'Unknown Bag'}</div>
            <div>Recipe: {recipe?.name || 'Unknown Recipe'}</div>
            <div>Evaluations: {brew.dialIns.reduce((acc, di) => acc + di.evaluations.length, 0)}</div>
            <div>Disgusting: {brew.dialIns.some((di) => di.isDisgusting) ? 'Yes' : 'No'}</div>
            <button>Dial In</button>
        </div>
    );
}


const Counter = () => {
    const { data, newBrew } = useDialBean();
    const userBrews: Brew[] = data.brews;
    const [selectedBrewId, setSelectedBrewId] = useState<string | null>(null);
    const [newBrewActive, setNewBrewActive] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="flex flex-col items-start justify-start w-96 gap-2">
                <div>My Brews</div>
                <div className="w-full overflow-y-auto flex flex-col gap-2">
                    {userBrews.length > 0 ? (
                        userBrews.map((brew) => {
                            if (brew.id === selectedBrewId) {
                                return <BrewDetails key={brew.id} brew={brew} onClose={() => setSelectedBrewId(null)} />;
                            } else {
                                return (
                                    <div key={brew.id}
                                        onClick={() => setSelectedBrewId(brew.id)}
                                        className="w-full bg-gray-200 hover:bg-gray-300 cursor-pointer p-2 rounded-md">
                                        {brew.name}
                                    </div>
                                );
                            }
                        })
                    ) : (
                        <div>No brews available.</div>
                    )}
                </div>
                <button onClick={() => setNewBrewActive(true)}>New Brew</button>
                {newBrewActive && (
                    <NewBrewDialog
                        onSaveBrew={(brew) => {
                            newBrew(brew.name, brew.bagId, brew.brewerId, brew.grinderId, brew.recipeId);
                            setNewBrewActive(false);
                        }}
                        onCancel={() => setNewBrewActive(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default Counter;




