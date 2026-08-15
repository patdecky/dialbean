import { XActionIcon } from "./action_icons";
import { AcidityIcon, SweetIcon, BitterIcon, BodyIcon, StrengthIcon } from "./icons";
import type { Brew, Bag, Evaluation } from "./types";



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
                    Are you sure you want to delete the last Dial-In?
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
                        Are you sure you want to close the Dial-In dialog?
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