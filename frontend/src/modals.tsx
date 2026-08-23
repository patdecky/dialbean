import { useEffect, useState } from "react";
import { XActionIcon } from "./action_icons";
import { AcidityIcon, SweetIcon, BitterIcon, BodyIcon, StrengthIcon } from "./icons";
import type { Brew, Bag, ItemTypeName, ItemType } from "./types";

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
                        className="absolute top-2 right-2 transparent rounded-full p-1"
                        onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}

export const MessageModal = ({ title, onClose }:
    {
        title: string;
        onClose: () => void;
    }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onClose}></div>
            <div className="modal">
                <div className="message">
                    {title}
                </div>
                <div className="options">
                    <button
                        onClick={onClose}>OK</button>
                    <button
                        className="absolute top-2 right-2 transparent rounded-full p-1"
                        onClick={onClose}><XActionIcon strokeColor="var(--color-fg1)" /></button>
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
                        className="absolute top-2 right-2 transparent rounded-full p-1"
                        onClick={onClose}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                </div>
            </div>
        </div>
    );
}

export const DialInEngineInfo = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onClose}></div>
            <div className="modal">
                <div className="flex flex-col gap-2">
                    <h2>How the Dial-In Engine Works</h2>
                    <div className="text-sm flex flex-col gap-2">
                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>1. Historical Analysis</h3>
                            </div>
                            <p className="ml-3">
                                The engine reviews your past brews and sensory ratings for this active bean setup to identify taste trends and extraction performance.
                            </p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>2. Context & Equipment Integration</h3>
                            </div>
                            <p className="ml-3">
                                It cross-references the coffee's roast level with your specific brewing hardware to determine how sensitive adjustments should be.
                            </p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>3. Target Selection & Optimization</h3>
                            </div>
                            <p className="ml-3">
                                The app suggests an optimization goal (e.g., <em>"Less Bitter"</em> or <em>"More Body"</em>). You can accept this suggestion or select your own target criteria.
                            </p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>4. Editable Dial-In Generation</h3>
                            </div>
                            <p className="ml-3">
                                Tapping <strong>Optimize</strong> calculates a new proposed setting for dose, temperature, and grinder clicks. You can manually tweak these values before making your cup.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}>OK</button>
                    <button
                        className="absolute top-2 right-2 transparent rounded-full p-1"
                        onClick={onClose}
                    >
                        <XActionIcon strokeColor="var(--color-fg1)" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const GrindFinenessInfo = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onClose}></div>
            <div className="modal">
                <div className="flex flex-col gap-2">
                    <h2>Grind Fineness Reference Scale</h2>
                    <div className="text-sm flex flex-col gap-2">
                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>0% — Ultra Fine (Powdered Sugar / Flour)</h3>
                            </div>
                            <p className="ml-3">
                                Turkish coffee and fine espresso. Microscopic particles that form a dense puck under pressure.
                            </p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>25% — Fine (Table Salt)</h3>
                            </div>
                            <p className="ml-3">
                                Moka pot, standard espresso, and quick AeroPress brews.
                            </p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>50% — Medium (Sea Salt / White Sand)</h3>
                            </div>
                            <p className="ml-3">
                                The universal baseline for single-cup pour-overs (V60, Kalita, Flat-Bottom).
                            </p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>75% — Medium-Coarse (Kosher Salt)</h3>
                            </div>
                            <p className="ml-3">
                                Chemex, French press, and large pour-over batches.
                            </p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>100% — Coarse (Cracked Peppercorns)</h3>
                            </div>
                            <p className="ml-3">
                                The upper limit for practical coffee brewing. Used for long cold brew immersions.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}>OK</button>
                    <button
                        className="absolute top-2 right-2 transparent rounded-full p-1"
                        onClick={onClose}
                    >
                        <XActionIcon strokeColor="var(--color-fg1)" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RoastLevelInfo = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onClose}></div>
            <div className="modal">
                <div className="flex flex-col gap-2">
                    <h2>Roast Level Guide</h2>
                    <div className="text-sm flex flex-col gap-2">
                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>Light</h3>
                            </div>
                            <p className="ml-3">Nordic / Cinnamon roast. High floral/fruit acidity, light tan color, dry surface.</p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>Light-Medium</h3>
                            </div>
                            <p className="ml-3">New England / Specialty Filter roast. Vibrant acidity with emerging sweetness.</p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>Medium</h3>
                            </div>
                            <p className="ml-3">American / City roast. Balanced acidity, caramel sweetness, medium brown color.</p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>Medium-Dark</h3>
                            </div>
                            <p className="ml-3">Full City / Espresso roast. Lower acidity, rich chocolate/nutty body, slight surface oil.</p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>Dark</h3>
                            </div>
                            <p className="ml-3">Vienna / French / Italian roast. Very low acidity, intense smoky/bittersweet notes, shiny oily surface.</p>
                        </div>
                    </div>
                    <button onClick={onClose}>OK</button>
                    <button
                        className="absolute top-2 right-2 transparent rounded-full p-1"
                        onClick={onClose}
                    >
                        <XActionIcon strokeColor="var(--color-fg1)" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export const GrinderScaleInfo = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="dialog z-500">
            <div className="backdrop" onClick={onClose}></div>
            <div className="modal">
                <div className="flex flex-col gap-2">
                    <h2>Setting Up Your Grinder Scale</h2>
                    <div className="text-sm flex flex-col gap-2">
                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>Practical Minimum Scale (0%)</h3>
                            </div>
                            <p className="ml-3">
                                Enter the setting where your grinder produces <strong>espresso or fine table salt grounds (~0%)</strong>. Do not use burr touch or absolute zero if it chokes your machine.
                            </p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>Practical Maximum Scale (100%)</h3>
                            </div>
                            <p className="ml-3">
                                Enter the setting where your grinder produces <strong>coarse cold brew grounds (~100%)</strong>. Do not use extreme settings that produce uneven chunks or tree bark.
                            </p>
                        </div>

                        <div>
                            <div className="flex gap-1 items-center font-semibold">
                                <h3>Step Size</h3>
                            </div>
                            <p className="ml-3">
                                Enter your grinder's smallest usable increment. Use <strong>1.0</strong> for full click increments, or <strong>0.5 / 0.1</strong> for micro-stepless adjustments.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}>OK</button>
                    <button
                        className="absolute top-2 right-2 transparent rounded-full p-1"
                        onClick={onClose}
                    >
                        <XActionIcon strokeColor="var(--color-fg1)" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const MessageStack = ({ message, onClear }: { message: string | null, onClear: () => void }) => {
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