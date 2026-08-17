import { useEffect, useState } from "react";
import { XActionIcon } from "./action_icons";
import { AcidityIcon, SweetIcon, BitterIcon, BodyIcon, StrengthIcon } from "./icons";
import type { Brew, Bag, Evaluation, ItemTypeName, ItemType } from "./types";

export const ConfirmModal = ({ title, okButton, onConfirm, onCancel }:
    {
        title: string;
        okButton: string;
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal">
                <div className="message">
                    {title}
                </div>
                <div className="options">
                    <button
                        onClick={onConfirm}>{okButton}</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}

export const ConfirmRemoveItemModal = ({ item, type, onConfirm, onCancel }:
    {
        item: ItemType;
        type: ItemTypeName;
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    const [understand, setUnderstand] = useState(false);
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal flex flex-col gap-2">
                <div className="message">
                    Are you sure you want to remove the {type} {item.name}?
                </div>
                {item.usedInBrew &&
                    <div>
                        <div className="error">This {type} has been used in a brew. Removing it will also remove all associated brews and evaluations.</div>
                        <div className="flex items-center gap-1">
                            <input type="checkbox" id="understand" checked={understand} onChange={(e) => setUnderstand(e.target.checked)} />
                            <label htmlFor="understand">Remove all associated brews and evaluations.</label>
                        </div>
                    </div>
                }
                <div className="options">
                    <button
                        className={item.usedInBrew && !understand ? "opacity-50 cursor-not-allowed" : ""}
                        onClick={onConfirm}
                        disabled={item.usedInBrew && !understand}
                    >Yes Remove</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}

export const ConfirmDeleteBrewModal = ({ brew, onConfirm, onCancel }:
    {
        brew: Brew;
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal">
                <div className="message">
                    Are you sure you want to delete {brew.name}?
                </div>
                <div className="options">
                    <button
                        onClick={onConfirm}>Delete</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}

export const ConfirmEditBrewModal = ({ brew, onConfirm, onCancel }:
    {
        brew: Brew;
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal">
                <div className="message">
                    Are you sure you want to edit {brew.name}?
                </div>
                <div className="options">
                    <button
                        onClick={onConfirm}>Edit</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}
export const ConfirmCopyBrewModal = ({ brew, onConfirm, onCancel }:
    {
        brew: Brew;
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal">
                <div className="message">
                    Are you sure you want to copy {brew.name}?
                </div>
                <div className="options">
                    <button
                        onClick={onConfirm}>Copy</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}

export const ConfirmDeleteEvaluationModal = ({ onConfirm, onCancel }:
    {
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal">
                <div className="message">
                    Are you sure you want to delete the last evaluation?
                </div>
                <div className="options">
                    <button
                        onClick={onConfirm}>Delete</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}

export const ConfirmDeleteDialInModal = ({ onConfirm, onCancel }:
    {
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal">
                <div className="message">
                    Are you sure you want to delete the last Dial-in?
                </div>
                <div className="options">
                    <button
                        onClick={onConfirm}>Delete</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}


export const ConfirmBagFinishedModal = ({ bag, onConfirm, onCancel }:
    {
        bag: Bag;
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal">
                <div className="message">
                    <p>
                        Are you sure you want to mark <i>{bag.name}</i> as finished?
                    </p>
                </div>
                <div className="options">
                    <button
                        onClick={onConfirm}>Yes Finish</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}


export const ConfirmCloseEvaluation = ({ onConfirm, onCancel }:
    {
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal">
                <div className="message">
                    <p>
                        Are you sure you want to close the evaluation dialog?
                    </p>
                </div>
                <div className="options">
                    <button
                        onClick={onConfirm}>Yes Close</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}


export const ConfirmCloseDialInModal = ({ onConfirm, onCancel }:
    {
        onConfirm: () => void;
        onCancel: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="modal">
                <div className="message">
                    <p>
                        Are you sure you want to close the Dial-in dialog?
                    </p>
                </div>
                <div className="options">
                    <button
                        onClick={onConfirm}>Yes Close</button>
                    <button
                        className="inverse"
                        onClick={onCancel}>Cancel</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}



export const BrewRatingInfo = ({ onClose }:
    {
        onClose: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onClose}></div>
            <div className="modal">
                <div className="flex flex-col gap-2">
                    <h2>Brew Rating Guide</h2>
                    <div className="text-sm">
                        <div className="flex gap-1">
                            <SweetIcon style={{ width: 22, height: 22 }} />
                            <h3>Sweetness</h3>
                        </div>
                        <p className="ml-3">1 - Plain Black Tea / Soda Water</p>
                        <p className="ml-3">3 - Ripe Apple / Sweet Carrot</p>
                        <p className="ml-3">5 - Sweet Orange Juice / Ripe Mango</p>
                        <div className="flex gap-1">
                            <AcidityIcon style={{ width: 22, height: 22 }} />
                            <h3>Acidity</h3>
                        </div>
                        <p className="ml-3">1 - Cucumber Water / Low-Acid Cold Brew</p>
                        <p className="ml-3">3 - Green Apple / Orange Slice</p>
                        <p className="ml-3">5 - Pure Lemon Juice</p>
                        <div className="flex gap-1">
                            <BitterIcon style={{ width: 22, height: 22 }} />
                            <h3>Bitterness</h3>
                        </div>
                        <p className="ml-3">1 - Milk Chocolate / Mild Black Tea</p>
                        <p className="ml-3">3 - 70% Dark Chocolate</p>
                        <p className="ml-3">5 - Tonic Water / Grapefruit Pith</p>
                        <div className="flex gap-1">
                            <BodyIcon style={{ width: 22, height: 22 }} />
                            <h3>Body</h3>
                        </div>
                        <p className="ml-3">1 - Filtered Water / Skim Milk</p>
                        <p className="ml-3">3 - Whole Milk / Brewed Black Tea</p>
                        <p className="ml-3">5 - Heavy Cream / Syrupy Liqueur</p>
                        <div className="flex gap-1">
                            <StrengthIcon style={{ width: 22, height: 22 }} />
                            <h3>Strength</h3>
                        </div>
                        <p className="ml-3">1 - Weak Americano / Diluted Brew</p>
                        <p className="ml-3">3 - Balanced Standard Cup</p>
                        <p className="ml-3">5 - Concentrated Ristretto / Pure Espresso</p>
                    </div>
                    <button
                        onClick={onClose}>OK</button>
                    <button
                        className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                        onClick={onClose}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}


export const MessageBlock = ({ message, onClear }: { message: string | null, onClear: () => void }) => {
    const [showing, setShowing] = useState<boolean>(Boolean(message));
    const [displayMessage, setDisplayMessage] = useState<string>("");

    useEffect(() => {
        if (!message) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowing(false);
            return;
        }

        setShowing(true);
        setDisplayMessage(message);

        const timer = setTimeout(() => {
            setShowing(false);
            onClear();
        }, 1500);

        return () => clearTimeout(timer);
    }, [message, onClear]);

    return (
        <div
            className={`
                fixed top-4 left-1/2 z-5000 max-w-md w-full px-4
                transition-all duration-300 ease-out pointer-events-none
                ${showing
                    ? "translate-y-0 opacity-100 -translate-x-1/2"
                    : "-translate-y-12 opacity-0 -translate-x-1/2"
                }
            `}
        >
            <div className="flex justify-center">
                <div className="pointer-events-auto inline-flex items-center p-1 rounded-full bg-fg1 text-bg1 max-w-[95dvw] shadow-2xl/20 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="text-sm text-nowrap text-ellipsis overflow-hidden whitespace-nowrap pl-2">
                        {displayMessage}
                        </span>
                    <button
                        onClick={() => {
                            setShowing(false);
                            onClear();
                        }}
                        className="ml-3 p-1 rounded-full"
                    >
                        <XActionIcon strokeColor="var(--color-bg2)" />
                    </button>
                </div>
            </div>
        </div>
    );
};