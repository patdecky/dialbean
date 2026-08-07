import { useState } from 'react';

import type { Brew } from './types';
import { useDileBean } from './DileBeanContext';
import { NewBrewDialog } from './dialogs';

const BrewDetails = ({ brew, onClose }: { brew: Brew; onClose: () => void }) => {
    return (
        <div>
            <div>Brew Details: {brew.name}</div>
            <button onClick={onClose}>Close Details</button>
        </div>
    );
}


const Counter = () => {
    const { data, createBrew, getBrewDefaultName } = useDileBean();
    const userBrews: Brew[] = data.brews;
    const [selectedBrewId, setSelectedBrewId] = useState<string | null>(null);
    const [newBrewActive, setNewBrewActive] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div>My Brews - rating</div>
            <ul>
                {userBrews.length > 0 ? (
                    userBrews.map((brew) => {
                        if (brew.id === selectedBrewId) {
                            return <BrewDetails key={brew.id} brew={brew} onClose={() => setSelectedBrewId(null)} />;
                        } else {
                            return (
                                <li key={brew.id} onClick={() => setSelectedBrewId(brew.id)}>
                                    {brew.name || getBrewDefaultName(brew.id)} — {brew.timestamp}
                                </li>
                            );
                        }
                    })
                ) : (
                    <li>No user brews available.</li>
                )}
            </ul>
            <button onClick={() => setNewBrewActive(true)}>New Brew</button>
            {newBrewActive && (
                <NewBrewDialog
                    onSaveBrew={(brew) => {
                        createBrew(brew);
                        setNewBrewActive(false);
                    }}
                    onCancel={() => setNewBrewActive(false)}
                />
            )}
        </div>
    )
}

export default Counter;




