import {
    useEffect,
    useState,
    useRef,
    useMemo,
    createElement
} from 'react';
import type { Icon } from './icons';
import type {
    Brew,
    Brewer,
    Recipe,
    Grinder,
    Bag,
    ItemType,
    DialIn,
    Evaluation,
    BrewerType,
    DialInRequest,
    ItemTypeName,
    RoastLevel
} from './types';
import { useDialBean } from './DialBeanContext';
import {
    brewer_icons,
    grinder_icons,
    bag_icons,
    BitterIcon,
    SweetIcon,
    AcidityIcon,
    BodyIcon,
    StrengthIcon,
    WeightIcon,
    TemperatureIcon,
    GrindIcon,
    EvaluationSingleIcon,
    EvaluationIcon,
    DialIcon,
    WaterIcon
} from "./icons";
import {
    XActionIcon,
    CopyActionIcon,
    EditActionIcon,
    DeleteActionIcon,
    EllipsisActionIcon,
    RightActionIcon,
    InfoActionIcon,
    DownActionIcon,
    UpActionIcon,
    MinusActionIcon,
    PlusActionIcon,
} from "./action_icons";

import { MdClose } from "react-icons/md";
import {
    formatDateOpened,
    formatLastCleaned,
    formatLastUsed
} from './formating';
import {
    BrewRatingInfo,
    ConfirmCloseDialInModal,
    ConfirmDeleteDialInModal,
    ConfirmDeleteEvaluationModal,
    ConfirmModal,
    ConfirmRemoveItemModal
} from './modals';
import {
    calculateAverageEvaluation,
    getDecimals,
    getGrind,
    getGrindPrecision,
    suggestDialIn,
    suggestRequest
} from './brain';



// eslint-disable-next-line react-refresh/only-export-components
export const getItemIcon = (item: ItemType, type: ItemTypeName): Icon | undefined => {
    const iconId = type === "brewer" ? (item as Brewer).iconId :
        type === "grinder" ? (item as Grinder).iconId :
            type === "bag" ? (item as Bag).iconId : undefined;

    const brewerType = type === "recipe" ? (item as Recipe).type : undefined;
    const Icon = type === "recipe"
        ?
        Object.values(brewer_icons).find(entry => entry.type === brewerType)?.icon
        : (
            type === "brewer"
                ?
                brewer_icons[iconId || "1"]?.icon
                : (
                    type === "grinder"
                        ?
                        grinder_icons[iconId || "1"]?.icon
                        : (
                            type === "bag"
                                ?
                                (
                                    (item as Bag).isFinished
                                        ?
                                        (bag_icons[iconId || "1"]?.icon_done)
                                        :
                                        (
                                            (item as Bag).dateOpened
                                                ?
                                                (bag_icons[iconId || "1"]?.icon_open)
                                                :
                                                (bag_icons[iconId || "1"]?.icon_new)
                                        )
                                ) :
                                undefined
                        )
                )
        );
    return Icon;
};

// eslint-disable-next-line react-refresh/only-export-components
export const getTypeIcon = (iconId: string, type: ItemTypeName): Icon | undefined => {
    if (type === "recipe") {
        return brewer_icons[iconId]?.icon;
    }
    if (type === "brewer") {
        return brewer_icons[iconId]?.icon;
    }
    if (type === "grinder") {
        return grinder_icons[iconId]?.icon;
    }
    if (type === "bag") {
        return bag_icons[iconId]?.icon_new;
    }
    return undefined;
};

// eslint-disable-next-line react-refresh/only-export-components
export const getNameIcon = (iconId: string, type: ItemTypeName): { name: string, icon: Icon, id: string } | undefined => {
    if (type === "recipe") {
        const entry = Object.values(brewer_icons).find(entry => entry.id === iconId);
        return entry ? { name: entry.type, icon: entry.icon, id: entry.id } : undefined;
    }
    if (type === "brewer") {
        const entry = Object.values(brewer_icons).find(entry => entry.id === iconId);
        return entry ? { name: entry.type, icon: entry.icon, id: entry.id } : undefined;
    }
    if (type === "grinder") {
        const entry = Object.values(grinder_icons).find(entry => entry.id === iconId);
        return entry ? { name: entry.name, icon: entry.icon, id: entry.id } : undefined;
    }
    if (type === "bag") {
        const entry = Object.values(bag_icons).find(entry => entry.id === iconId);
        return entry ? { name: entry.roast_level, icon: entry.icon_new, id: entry.id } : undefined;
    }
    return undefined;
};


export const SmallItemCard = ({
    item,
    type,
    isSelected = false,
    onItemSelected,
    allowDetails = true,
    onSelectDetails = false,
    onEditItem,
    onRemoveItem,
    onNewItem,
    itemRef
}: {
    item: ItemType;
    type: 'brewer' | 'grinder' | 'bag' | 'recipe';
    isSelected?: boolean;
    onItemSelected?: ((item: ItemType) => void);
    allowDetails?: boolean;
    onSelectDetails?: boolean;
    itemRef?: React.Ref<HTMLDivElement>;
    onEditItem?: (id: string, item: ItemType) => void;
    onRemoveItem?: (item: ItemType) => void;
    onNewItem?: (item: ItemType) => void;
}) => {
    const icon = getItemIcon(item, type);

    const [showDetails, setShowDetails] = useState(false);

    return (
        <div>
            {showDetails && <ItemDetailsDialog
                item={item}
                type={type}
                onClose={() => setShowDetails(false)}
                onNewItem={onNewItem ? (item) => onNewItem(item) : undefined}
                onEditItem={onEditItem ? (id, item) => onEditItem(id, item) : undefined}
                onRemoveItem={onRemoveItem ? (item) => { onRemoveItem(item) } : undefined}
            />}
            {type === "recipe" ? (
                <div
                    className={"bg-bgrec w-22 min-w-22 h-22 min-h-22 flex flex-col items-center justify-stretch text-center px-1 py-2 gap-1 overflow-hidden relative" +
                        (onItemSelected || (onSelectDetails && allowDetails) ? " cursor-pointer hover:inset-ring-1 hover:inset-ring-fg3" : "") +
                        (isSelected ? " inset-ring-fg3 inset-ring-2 hover:inset-ring-2" : "")
                    }
                    ref={itemRef}
                    onClick={() => {
                        if (onSelectDetails && allowDetails) {
                            setShowDetails(true);
                        } else {
                            onItemSelected?.(item);
                        }
                    }}>
                    {item.isBase && <div className="library-mark small rec"></div>}
                    {allowDetails && (
                        <button
                            className="absolute top-0 right-0 bg-transparent rounded-full p-[2px]"
                            onClick={() => {
                                setShowDetails(true);
                            }} >
                            <InfoActionIcon size="12" strokeColor="var(--color-fg1)" />
                        </button>
                    )}
                    <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-xs text-fg3">
                        <div className="text-center line-clamp-4 text-ellipsis overflow-hidden max-w-full font-hand font-bold">
                            {item.name}
                        </div>
                    </div>
                </div >
            ) : (
                <div
                    className={"bg-bg3 w-18 min-w-18 h-24 min-h-24 rounded-lg flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden relative" +
                        (onItemSelected || (onSelectDetails && allowDetails) ? " cursor-pointer hover:inset-ring-1 hover:inset-ring-fg3" : "") +
                        (isSelected ? " inset-ring-fg3 inset-ring-2 hover:inset-ring-2 " : "")
                    }
                    ref={itemRef}
                    onClick={() => {
                        if (onSelectDetails && allowDetails) {
                            setShowDetails(true);
                        } else {
                            onItemSelected?.(item);
                        }
                    }}>
                    {item.isBase && <div className="library-mark small"></div>}
                    {allowDetails && (
                        <button
                            className="bg-transparent absolute top-0 right-0 rounded-full p-[2px]"
                            onClick={() => {
                                setShowDetails(true);
                            }}>
                            <InfoActionIcon size="12" strokeColor='var(--color-fg1)' />
                        </button>
                    )}
                    {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                    <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-xs">
                        <div className="text-center line-clamp-2 text-ellipsis overflow-hidden max-w-full">
                            {item.name}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


export const TinyItemCard = ({ item, type, isSelected = false, onItemSelected = null, itemRef = null }: {
    item: ItemType;
    type: 'brewer' | 'grinder' | 'bag' | 'recipe';
    isSelected?: boolean;
    onItemSelected?: ((item: ItemType) => void) | null;
    itemRef?: React.Ref<HTMLDivElement> | null;
}) => {

    const icon = getItemIcon(item, type);

    return (type === "recipe" ? (
        <div
            className={"bg-yellow-200 border-2 w-11 min-w-11 h-11 min-h-11 flex flex-col items-center justify-stretch text-center px-[2px] py-2 gap-1 overflow-hidden relative" +
                (isSelected ? " inset-ring-2 inset-ring-yellow-500" : "") +
                (onItemSelected !== null ? " cursor-pointer" : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected?.(item)}>
            <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-sm">
                <div className="line-clamp-1 text-sm overflow-hidden max-w-full font-hand font-bold">
                    {item.name.split(" ").map((word) => (word.slice(0, 1))).join("")}
                </div>
            </div>
        </div >
    ) : (
        <div
            className={"w-12 min-w-12 h-12 min-h-12 rounded-lg flex flex-col items-center justify-center" +
                (isSelected ? " inset-ring-2 inset-ring-fg3" : "") +
                (onItemSelected !== null ? " cursor-pointer" : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected?.(item)}>
            {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
        </div >)
    )
}


export const MediumRecipeCard = ({
    recipe,
    isSelected,
    onItemSelected,
    allowDetails = true,
    onSelectDetails = false,
    onEditItem,
    onRemoveItem,
    onNewItem,
    itemRef
}: {
    recipe: Recipe;
    isSelected?: boolean;
    onItemSelected?: ((recipe: Recipe) => void);
    allowDetails?: boolean;
    onSelectDetails?: boolean;
    itemRef?: React.Ref<HTMLDivElement>;
    onEditItem?: (id: string, recipe: Recipe) => void;
    onRemoveItem?: (recipe: Recipe) => void;
    onNewItem?: (recipe: Recipe) => void;
}) => {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <div>
            {showDetails && <ItemDetailsDialog
                item={recipe}
                type="recipe"
                onClose={() => {
                    setShowDetails(false)
                }}
                onNewItem={onNewItem ? (item) => onNewItem(item as Recipe) : undefined}
                onEditItem={onEditItem ? (id, item) => onEditItem(id, item as Recipe) : undefined}
                onRemoveItem={onRemoveItem ? (item) => { onRemoveItem(item as Recipe) } : undefined}
            />}
            <div
                className={"bg-bgrec min-w-30 min-h-30 flex flex-col items-start justify-stretch text-center px-2 pt-3 pb-2 gap-1 overflow-hidden relative" +
                    (onItemSelected || (onSelectDetails && allowDetails) ? " cursor-pointer hover:inset-ring-1 hover:inset-ring-fg3" : "") +
                    (isSelected ? " inset-ring-fg3 inset-ring-2 hover:inset-ring-2" : "")
                }
                ref={itemRef}
                onClick={() => {
                    if (onSelectDetails && allowDetails) {
                        setShowDetails(true);
                    } else {
                        onItemSelected?.(recipe);
                    }
                }}
            >
                {recipe.isBase && <div className="library-mark small rec"></div>}
                {allowDetails && (
                    <button
                        className="absolute top-0 right-0 bg-transparent rounded-full p-[2px]"
                        onClick={() => {
                            setShowDetails(true);
                        }} >
                        <InfoActionIcon size="12" strokeColor="var(--color-fg1)" />
                    </button>
                )}

                <div className="line-clamp-2 text-ellipsis overflow-hidden font-hand font-bold">
                    {recipe.name}
                </div>
                <div className="text-sm whitespace-pre-wrap font-hand">
                    {recipe.instructions}
                </div>
            </div >
        </div>
    )
}

export const EvaluationCard = ({ evaluation, showNotes = false }: {
    evaluation: Evaluation,
    showNotes?: boolean
}) => {
    return (
        <div className="flex justify-start gap-1 items-center text-sm">
            <div className="self-start">
                <EvaluationSingleIcon style={{ width: "24px", height: "24px" }} />
            </div>
            <div className="flex flex-col">
                <div className="flex gap-1 items-center justify-start">
                    <div className="flex justify-start items-center gap-[2px]">
                        <SweetIcon />
                        <span>
                            {evaluation.sweetness}
                        </span>
                    </div>
                    <div className="flex justify-start gap-[2px] items-center">
                        <AcidityIcon />
                        <span>
                            {evaluation.acidity}
                        </span>
                    </div>
                    <div className="flex justify-start gap-[2px] items-center">
                        <BitterIcon />
                        <span>
                            {evaluation.bitterness}
                        </span>
                    </div>
                    <div className="flex justify-start gap-[2px] items-center">
                        <BodyIcon />
                        <span>
                            {evaluation.body}
                        </span>
                    </div>
                    <div className="flex justify-start gap-[2px] items-center">
                        <StrengthIcon />
                        <span>
                            {evaluation.strength}
                        </span>
                    </div>
                </div>
                {showNotes && evaluation.notes && (
                    <div className="text-sm text-start line-clamp-2 text-ellipsis overflow-hidden max-w-full">
                        {evaluation.notes}
                    </div>
                )}
            </div>
        </div>
    )
}

export const EvaluationAverageCard = ({ evaluations }: {
    evaluations: Evaluation[],
}) => {
    const averageEvaluation = calculateAverageEvaluation(evaluations);
    if (!averageEvaluation) {
        throw new Error("No evaluations provided for average calculation.");
    }
    return (
        <div className="flex justify-start gap-1 items-center text-sm">
            <div className="self-start">
                <EvaluationIcon style={{ width: "24px", height: "24px" }} />
            </div>
            <div className="flex flex-col">
                <div className="flex gap-1 items-center justify-start">
                    <div className="flex justify-start items-center gap-[2px]">
                        <SweetIcon />
                        <span>
                            {(averageEvaluation.sweetness).toFixed(getDecimals(averageEvaluation.sweetness))}
                        </span>
                    </div>
                    <div className="flex justify-start gap-[2px] items-center">
                        <AcidityIcon />
                        <span>
                            {(averageEvaluation.acidity).toFixed(getDecimals(averageEvaluation.acidity))}
                        </span>
                    </div>
                    <div className="flex justify-start gap-[2px] items-center">
                        <BitterIcon />
                        <span>
                            {(averageEvaluation.bitterness).toFixed(getDecimals(averageEvaluation.bitterness))}
                        </span>
                    </div>
                    <div className="flex justify-start gap-[2px] items-center">
                        <BodyIcon />
                        <span>
                            {(averageEvaluation.body).toFixed(getDecimals(averageEvaluation.body))}
                        </span>
                    </div>
                    <div className="flex justify-start gap-[2px] items-center">
                        <StrengthIcon />
                        <span>
                            {(averageEvaluation.strength).toFixed(getDecimals(averageEvaluation.strength))}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}


export const DialInCard = ({ dialIn, recipe, grinder }: {
    dialIn: DialIn,
    recipe: Recipe,
    grinder: Grinder,
}) => {
    const recipeGrind = getGrind(grinder, recipe);
    const grindPrecision = getGrindPrecision(grinder);
    return (
        <div className="flex justify-start gap-1 items-center text-sm">
            <div className="flex justify-start items-center">
                <DialIcon style={{ width: "24px", height: "24px" }} />
            </div>
            {/* <div className="flex justify-start gap-[2px] items-center">
                <WaterIcon />
                {dialIn.waterDelta === 0 ? (
                    <span>{recipe.waterMl}ml</span>
                ) : (
                    <>
                        <span className="line-through">{recipe.waterMl}</span>
                        <span>{recipe.waterMl + dialIn.waterDelta}ml</span>
                    </>
                )}
            </div> */}
            <div className="flex justify-start gap-[2px] items-center">
                <GrindIcon />
                {dialIn.grinderDelta === 0 ? (
                    <>
                        <span>{recipeGrind.toFixed(grindPrecision)}</span>
                    </>
                ) : (
                    <>
                        <span className="line-through">{recipeGrind.toFixed(grindPrecision)}</span>
                        <span>{(getGrind(grinder, recipe, dialIn.grinderDelta)).toFixed(grindPrecision)}</span>
                    </>
                )}
            </div>
            <div className="flex justify-start gap-[2px] items-center">
                <TemperatureIcon />
                {dialIn.tempDelta === 0 ? (
                    <span>{recipe.tempC}°C</span>
                ) : (
                    <>
                        <span className="line-through">{recipe.tempC}</span>
                        <span>{recipe.tempC + dialIn.tempDelta}°C</span>
                    </>
                )}
            </div>
            <div className="flex justify-start gap-[2px] items-center">
                <WeightIcon />
                {dialIn.doseDelta === 0 ? (
                    <span>{recipe.doseG}g</span>
                ) : (
                    <>
                        <span className="line-through">{(recipe.doseG).toFixed(1)}</span>
                        <span>{(recipe.doseG + dialIn.doseDelta).toFixed(1)}g</span>
                    </>
                )}
            </div>
        </div >
    )
}

export const RecipeValuesCard = ({ recipe }: {
    recipe: Recipe,
}) => {
    return (
        <div className="flex justify-start gap-1 items-center">
            <div className="flex justify-start gap-1 items-center">
                <WaterIcon />
                <span>{(recipe.waterMl).toFixed(0)}ml</span>
            </div>
            <div className="flex justify-start gap-[2px] items-center">
                <GrindIcon />
                <span>{(recipe.grindPct).toFixed(0)}%</span>
            </div>
            <div className="flex justify-start gap-[2px] items-center">
                <TemperatureIcon />
                <span>{(recipe.tempC).toFixed(0)}°C</span>
            </div>
            <div className="flex justify-start gap-[2px] items-center">
                <WeightIcon />
                <span>{(recipe.doseG).toFixed(1)}g</span>
            </div>
        </div >
    )
}


export const BrewCard = ({ brew, bag, brewer, grinder, recipe, onSelected = null }: {
    brew: Brew,
    bag: Bag,
    brewer: Brewer,
    grinder: Grinder,
    recipe: Recipe,
    onSelected?: ((brew: Brew) => void) | null
}) => {


    return (
        <div onClick={() => onSelected && onSelected(brew)}
            className="w-full bg-bg2 hover:inset-ring-1 inset-ring-fg3 cursor-pointer p-2 gap-1 rounded-md flex flex-col ">
            <div className="flex justify-between items-start">
                <h2>{brew.name}</h2>
                <div className="flex flex-col items-end">
                    <div className="timestamp">
                        {new Date(brew.timestamp).toLocaleString()}
                    </div>
                    {brew.lastUsedTimestamp &&
                        <div className="timestamp">
                            {formatLastUsed(brew.lastUsedTimestamp)}
                        </div>}
                </div>
            </div>
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div
                        className="flex items-center justify-start">
                        <TinyItemCard
                            item={recipe}
                            type="recipe"
                        />
                        <TinyItemCard
                            item={bag}
                            type="bag"
                        />
                        <TinyItemCard
                            item={brewer}
                            type="brewer"
                        />
                        <TinyItemCard
                            item={grinder}
                            type="grinder"
                        />
                    </div>
                    <div>
                        {brew.dialIns.length > 0 && brew.dialIns[brew.dialIns.length - 1].evaluations.length > 0 ? (
                            <EvaluationAverageCard evaluations={brew.dialIns[brew.dialIns.length - 1].evaluations} />
                        ) : <div className="text-sm h-5">No evaluations yet</div>}
                    </div>
                    {brew.notes && <div>
                        <div className="notes short text-sm">{brew.notes}</div>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export const SingleRatingCard = ({ rating, onRatingSelected, category }: {
    rating: number,
    onRatingSelected: (newRating: number) => void,
    category: 'sweetness' | 'acidity' | 'bitterness' | 'body' | 'strength'
}) => {

    const icon = category === 'sweetness' ? SweetIcon :
        category === 'acidity' ? AcidityIcon :
            category === 'bitterness' ? BitterIcon :
                category === 'body' ? BodyIcon :
                    StrengthIcon;

    const btnStyleBase = "bg-bg3 border border-bg4 rounded-sm w-8 h-8 flex items-center justify-center";
    const btnStyleInactive = btnStyleBase + "";
    const btnStyleActive = btnStyleBase + " bg-fg1 border-fg3";
    return (
        <div className="flex items-center gap-1">
            {icon && createElement(icon, { style: { width: "22px", height: "22px" } })}
            <div className="flex items-center gap-[2px]">
                <button className={rating === 1 ? btnStyleActive : btnStyleInactive} onClick={() => onRatingSelected(1)}>1</button>
                <button className={rating === 2 ? btnStyleActive : btnStyleInactive} onClick={() => onRatingSelected(2)}>2</button>
                <button className={rating === 3 ? btnStyleActive : btnStyleInactive} onClick={() => onRatingSelected(3)}>3</button>
                <button className={rating === 4 ? btnStyleActive : btnStyleInactive} onClick={() => onRatingSelected(4)}>4</button>
                <button className={rating === 5 ? btnStyleActive : btnStyleInactive} onClick={() => onRatingSelected(5)}>5</button>
            </div>
        </div>
    );
};





export const ConfirmDialog = ({ message, onConfirm, onCancel }:
    {
        message: string;
        onConfirm: () => void;
        onCancel: () => void
    }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full z-150 flex items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
            <div className="bg-white shadow-xl z-60 p-4 rounded shadow-md min-w-64 relative max-h-[90dvh] overflow-y-auto shadow-md w-96">
                <div>{message}</div>
                <div>fix me!</div>
                <div className="flex gap-1">
                    <button className="border rounded-md px-2 py-1 hover:bg-gray-200" onClick={onConfirm}>Confirm</button>
                    <button className="border rounded-md px-2 py-1 hover:bg-gray-200" onClick={onCancel}>Cancel</button>
                </div>
                <button
                    className="absolute top-2 right-2 hover:bg-gray-200 rounded-full p-1"
                    onClick={onCancel}><MdClose /></button>
            </div>
        </div>
    )
}

export const PickTypeDialog = ({ type, onIconSelected, onClose }:
    {
        type: ItemTypeName;
        onIconSelected: (iconId: string, type: string) => void;
        onClose: () => void;
    }) => {
    const clearBrewerIcons = Object.values(brewer_icons).map(entry => ({ id: entry.id, name: entry.type, icon: entry.icon }));
    const clearGrinderIcons = Object.values(grinder_icons).map(entry => ({ id: entry.id, name: entry.name, icon: entry.icon }));
    const clearBagIcons = Object.values(bag_icons).map(entry => ({ id: entry.id, name: entry.roast_level, icon: entry.icon_new }));
    const icons = (
        type === 'brewer' ? clearBrewerIcons :
            type === 'grinder' ? clearGrinderIcons :
                type === 'bag' ? clearBagIcons :
                    clearBrewerIcons);
    const message = (
        type === "brewer" ? "Select brewer type" :
            type === "grinder" ? "Select grinder type" :
                type === "bag" ? "Select bag roast level" :
                    "Select indended brewer type"
    )
    return (
        <div className="dialog">
            <div className="backdrop" onClick={onClose}></div>
            <div className="library flex flex-col gap-2">
                <div>{message}</div>
                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-96">
                    {Object.values(icons).map((iconEntry) => (
                        <div key={iconEntry.id} className="flex flex-col items-center overflow-hidden">
                            <div
                                className={"bg-bg3 w-18 min-w-18 h-24 min-h-24 rounded-lg flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden cursor-pointer hover:inset-ring-1 hover:inset-ring-fg3"}
                                onClick={() => {
                                    onIconSelected(iconEntry.id, iconEntry.name);
                                }}>
                                {iconEntry.icon && createElement(iconEntry.icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                                <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-xs">
                                    <div className="text-center line-clamp-2 text-ellipsis overflow-hidden max-w-full">
                                        {iconEntry.name}
                                    </div>
                                </div>
                            </div >
                        </div>
                    ))}
                </div>
                <button className="absolute top-2 right-2 bg-transparent rounded-full p-1" onClick={onClose}><XActionIcon strokeColor='var(--color-fg1)' /></button>
            </div>
        </div>
    );
};



export const ItemDetailsDialog = ({
    item,
    type,
    onClose,
    onNewItem,
    onRemoveItem,
    onEditItem,
}:
    {
        item: ItemType;
        type: ItemTypeName;
        onClose: () => void;
        onNewItem?: ((item: ItemType) => void) | undefined;
        onRemoveItem?: ((item: ItemType) => void) | undefined;
        onEditItem?: ((id: string, item: ItemType) => void) | undefined;
    }) => {
    const icon = getItemIcon(item, type);
    const { markBrewerCleaned, markGrinderCleaned, markBagOpened, markBagFinished, markBagRestocked } = useDialBean();


    const [showOptionButtons, setShowOptionButtons] = useState(false);
    const [newItemDialogActive, setNewItemDialogActive] = useState(false);
    const [copyItem, setCopyItem] = useState<boolean>(false);
    const roastDate = type === "bag" ? (item as Bag).roastDate : undefined;
    const dateOpened = type === "bag" ? (item as Bag).dateOpened : undefined;
    const isFinished = type === 'bag' ? (item as Bag).isFinished : undefined;
    const isBase = item.isBase;

    const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
    const [showConfirmCopyModal, setShowConfirmCopyModal] = useState(false);
    const [showConfirmEditModal, setShowConfirmEditModal] = useState(false);

    return (
        <div className="dialog">
            {newItemDialogActive && (
                <NewItemDialog
                    item={copyItem ? item : undefined}
                    onClose={() => setNewItemDialogActive(false)}
                    type={type}
                    onSave={(itemIN) => {
                        if (copyItem && onNewItem) {
                            onNewItem(itemIN);
                        }
                        else if (!copyItem && onEditItem) {
                            onEditItem(item.id, itemIN);
                        }
                        setNewItemDialogActive(false);
                        setCopyItem(false);
                    }}
                />
            )}
            {showConfirmRemoveModal && (
                <ConfirmRemoveItemModal
                    item={item}
                    type={type}
                    onConfirm={() => {
                        setShowConfirmRemoveModal(false);
                        onRemoveItem?.(item);
                    }}
                    onCancel={() => setShowConfirmRemoveModal(false)}
                />
            )}
            {showConfirmCopyModal && (
                <ConfirmModal
                    title={`Are you sure you want to copy this ${type}?`}
                    okButton={"Yes Copy"}
                    onConfirm={() => {
                        setShowConfirmCopyModal(false);
                        setNewItemDialogActive(true);
                        setCopyItem(true);
                    }}
                    onCancel={() => setShowConfirmCopyModal(false)}
                />
            )}
            {showConfirmEditModal && (
                <ConfirmModal
                    title={`Are you sure you want to edit this ${type}?`}
                    okButton={"Yes Edit"}
                    onConfirm={() => {
                        setShowConfirmEditModal(false);
                        setNewItemDialogActive(true);
                        setCopyItem(false);
                    }}
                    onCancel={() => setShowConfirmEditModal(false)}
                />
            )}
            <div className="backdrop" onClick={onClose}></div>
            <div className={"flex flex-col gap-2" + (type === "recipe" ? " recipe" : " item")}>
                {isBase && <div className="library-mark"></div>}
                <div className="absolute top-2 right-2 flex gap-2">
                    {((onRemoveItem && !isBase) || onNewItem || (onEditItem && !isBase)) &&
                        (
                            showOptionButtons ?
                                (<div className="flex gap-2">
                                    {onRemoveItem && !isBase && <button
                                        onClick={() => setShowConfirmRemoveModal(true)}
                                        className="p-1 bg-transparent rounded-full" >
                                        <DeleteActionIcon strokeColor="var(--color-fg1)" fillColor="white" />
                                    </button>}
                                    {onNewItem && <button onClick={() => {
                                        setShowConfirmCopyModal(true)
                                    }}
                                        className="p-1 bg-transparent rounded-full" >
                                        <CopyActionIcon strokeColor="var(--color-fg1)" fillColor="white" />
                                    </button>}
                                    {onEditItem && !isBase && <button onClick={() => {
                                        setShowConfirmEditModal(true)
                                    }}
                                        className="p-1 bg-transparent rounded-full" >
                                        <EditActionIcon strokeColor="var(--color-fg1)" fillColor="white" />
                                    </button>}
                                    <button onClick={() => { setShowOptionButtons(false) }}
                                        className="p-1 rounded-full" >
                                        <RightActionIcon strokeColor="var(--color-bg1)" />
                                    </button>
                                </div>
                                ) : (
                                    <button onClick={() => setShowOptionButtons(true)}
                                        className="p-1 bg-transparent rounded-full"
                                    >
                                        <EllipsisActionIcon fillColor="var(--color-fg1)" />
                                    </button>
                                )
                        )
                    }
                    <button onClick={onClose} className="p-1 bg-transparent rounded-full">
                        <XActionIcon strokeColor="var(--color-fg1)" />
                    </button>
                </div>
                {type === "brewer" &&
                    <>
                        <div>
                            <h2 className="">{item.name}</h2>
                            {isBase && <div className="label">System Brewer - copy to edit</div>}
                            {(item as Brewer).cleanedDate && !isBase && <div className="timestamp">
                                <div>{formatLastCleaned((item as Brewer).cleanedDate ?? "")}</div>
                            </div>
                            }
                        </div>
                        <div>
                            <div className="label">Brewer Type:</div>
                            <div className="flex flex-col items-center justify-center">
                                {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                                <div>{(item as Brewer).type}</div>
                            </div>
                        </div>
                        {item.notes && <div>
                            <div className="label">Notes:</div>
                            <div className="notes text-sm">{item.notes}</div>
                        </div>}
                        {!isBase && <button onClick={() => markBrewerCleaned(item.id)}>Mark Cleaned</button>}
                        <button onClick={onClose}>Close</button>
                    </>
                }
                {type === "grinder" &&
                    <>
                        <div>

                            <h2 className="">{item.name}</h2>
                            {isBase && <div className="label">System Grinder - copy to edit</div>}
                            {(item as Grinder).cleanedDate && <div className="timestamp">
                                <div>{formatLastCleaned((item as Grinder).cleanedDate ?? "")}</div>
                            </div>
                            }
                        </div>
                        <div>
                            <div className="flex flex-col items-center justify-center">
                                {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                            </div>
                        </div>
                        <div>
                            <div className="label">Scale:</div>
                            <div>{(item as Grinder).scaleMin} - {(item as Grinder).scaleMax}</div>
                        </div>
                        <div>
                            <div className="label">Step Size:</div>
                            <div>{(item as Grinder).stepSize}</div>
                        </div>
                        {item.notes && <div>
                            <div className="label">Notes:</div>
                            <div className="notes text-sm">{item.notes}</div>
                        </div>}
                        {!isBase && <button onClick={() => markGrinderCleaned(item.id)}>Mark Cleaned</button>}
                        <button onClick={onClose}>Close</button>
                    </>
                }
                {type === "bag" &&
                    <>
                        <div>
                            <h2 className="">{item.name}</h2>
                            {isBase && <div className="label">System Bag - copy to edit</div>}
                            {dateOpened && <div className="timestamp">
                                <div>{formatDateOpened(dateOpened)}</div>
                            </div>
                            }
                        </div>
                        <div>
                            <div className="flex flex-col items-center justify-center">
                                {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                            </div>
                        </div>
                        {(item as Bag).roaster && <div className="text-xs text-fg3">Roaster: {(item as Bag).roaster}</div>}
                        <div>
                            <div className="label">Roast Level:</div>
                            <div>{(item as Bag).roastLevel}</div>
                        </div>
                        {roastDate &&
                            <div>
                                <div className="label">Roast Date:</div>
                                <div className="timestamp">{new Date(roastDate).toLocaleString()}</div>
                            </div>}
                        {item.notes && <div>
                            <div className="label">Notes:</div>
                            <div className="notes text-sm">{item.notes}</div>
                        </div>}
                        {!dateOpened && <button onClick={() => markBagOpened(item.id)}>Opened</button>}
                        {dateOpened && !isFinished && <button onClick={() => markBagFinished(item.id)}>Finished</button>}
                        {dateOpened && isFinished && <button onClick={() => markBagRestocked(item.id)}>Restocked</button>}
                        <button onClick={onClose}>Close</button>
                    </>
                }
                {type === "recipe" &&
                    <>
                        <div>
                            <h2 className="font-hand font-bold">{item.name}</h2>
                            {isBase && <div className="label">System Recipe - copy to edit</div>}
                        </div>
                        <div>

                            <div className="label font-hand">Parameters:</div>
                            <div className="font-hand">
                                <RecipeValuesCard recipe={item as Recipe} />
                            </div>
                        </div>
                        <div>
                            <div className="label font-hand">Intended brewer type:</div>
                            <div className="flex justify-center">
                                <div className="flex flex-col items-center justify-center">
                                    {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                                    <div className="font-hand">{(item as Recipe).type}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="label font-hand">Instructions:</div>
                            <div className="whitespace-pre-wrap font-hand">{(item as Recipe).instructions}</div>
                        </div>
                        {item.notes && <div>
                            <div className="label font-hand">Notes:</div>
                            <div className="notes text-sm font-hand">{item.notes}</div>
                        </div>}
                        <button onClick={onClose}>Close</button>
                    </>
                }
            </div>
        </div >
    );
}


export const NewItemDialog = ({
    item,
    edit,
    type,
    onClose,
    onSave }:
    {
        item?: ItemType;
        edit?: boolean;
        type: ItemTypeName;
        onClose: () => void;
        onSave: (item: ItemType) => void;
    }) => {
    const [iconId, setIconId] = useState<string>((type === "recipe" ? (getNameIcon((item as Recipe)?.type ?? "1", "recipe")?.id) : ((item as Bag | Brewer | Grinder)?.iconId ?? "1")) ?? "1");
    const [iconDialogActive, setIconDialogActive] = useState<boolean>(false);
    const [name, setName] = useState<string>(item?.name ?? (type === "brewer" ? "Brewer" : type === "grinder" ? "Grinder" : type === "recipe" ? "Recipe" : "Bag"));
    const [notes, setNotes] = useState<string>(item?.notes ?? "");
    const [brewerType, setBrewerType] = useState<BrewerType>((item as Brewer)?.type ?? (getNameIcon(iconId, "brewer")?.name ?? "Unknown"));
    const [recipeBrewerType, setRecipeBrewerType] = useState<BrewerType>((item as Recipe)?.type ?? (getNameIcon(iconId, "recipe")?.name ?? "Unknown"));
    const [grinderType, setGrinderType] = useState<string>((getNameIcon(iconId, "grinder")?.name ?? "Unknown"));
    const [scaleMin, setScaleMin] = useState<number | null>((item as Grinder)?.scaleMin ?? 0);
    const [scaleMax, setScaleMax] = useState<number | null>((item as Grinder)?.scaleMax ?? 10);
    const [stepSize, setStepSize] = useState<number | null>((item as Grinder)?.stepSize ?? 1);
    const [roaster, setRoaster] = useState<string>((item as Bag)?.roaster ?? "Roaster");
    const [roastLevel, setRoastLevel] = useState<RoastLevel>((item as Bag)?.roastLevel ?? "Medium");
    const [roastDate, setRoastDate] = useState<string | undefined>((item as Bag)?.roastDate ?? undefined); //ISO string
    const [dateOpened, setDateOpened] = useState<string | undefined>((item as Bag)?.dateOpened ?? undefined); //ISO string
    const [waterMl, setWaterMl] = useState<number | null>((item as Recipe)?.waterMl ?? 200);
    const [grindPct, setGrindPct] = useState<number | null>((item as Recipe)?.grindPct ?? 20);
    const [tempC, setTempC] = useState<number | null>((item as Recipe)?.tempC ?? 90);
    const [doseG, setdoseG] = useState<number | null>((item as Recipe)?.doseG ?? 18);
    const [instructions, setInstructions] = useState<string>((item as Recipe)?.instructions ?? "Instructions");
    const icon = getTypeIcon(iconId, type);


    const [showErrors, setShowErrors] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);

    const handleSave = () => {
        if (type === "bag") {
            if (roastLevel.trim() === "") {
                setShowErrors(true);
                return;
            }
            onSave({
                name: name,
                iconId: iconId,
                roaster: roaster.trim() === "" ? undefined : roaster,
                roastLevel: roastLevel,
                roastDate: roastDate ?? undefined,
                notes: notes.trim() === "" ? undefined : notes,
                dateOpened: dateOpened ?? undefined
            } as Bag);
        } else if (type === "brewer") {
            if (brewerType.trim() === "") {
                setShowErrors(true);
                return;
            }
            onSave({
                name: name,
                iconId: iconId,
                type: brewerType,
                notes: notes.trim() === "" ? undefined : notes,
            } as Brewer);
        } else if (type === "grinder") {
            if (grinderType.trim() === "" || scaleMin === null || scaleMax === null || stepSize === null) {
                setShowErrors(true);
                return;
            }
            onSave({
                name: name,
                iconId: iconId,
                scaleMin: scaleMin,
                scaleMax: scaleMax,
                stepSize: stepSize,
                notes: notes.trim() === "" ? undefined : notes,
            } as Grinder);
        }
        else if (type === "recipe") {
            if (recipeBrewerType.trim() === "" || waterMl === null || grindPct === null || tempC === null || doseG === null) {
                setShowErrors(true);
                return;
            }
            onSave({
                name: name,
                notes: notes.trim() === "" ? undefined : notes,
                type: recipeBrewerType,
                waterMl: waterMl,
                doseG: doseG,
                tempC: tempC,
                grindPct: grindPct,
                instructions: instructions.trim() === "" ? undefined : instructions,
            } as Recipe);
        }
    }

    return (
        <div className="dialog">
            {showConfirmClose && (
                <ConfirmModal
                    title="Are you sure you want to close the new brew dialog?"
                    okButton="Yes Close"
                    onConfirm={onClose}
                    onCancel={() => setShowConfirmClose(false)}
                />
            )}
            <div className="backdrop" onClick={() => setShowConfirmClose(true)}></div>
            <div className={"flex flex-col gap-2" + (type === "recipe" ? " recipe" : " item")}>
                {iconDialogActive && (
                    <PickTypeDialog
                        type={type}
                        onIconSelected={(iconId: string, selectedType: string) => {
                            setIconId(iconId);
                            if (type === "brewer") {
                                setBrewerType(selectedType as BrewerType);
                            }
                            if (type === "grinder") {
                                setGrinderType(selectedType);
                            }
                            if (type === "bag") {
                                setRoastLevel(selectedType as RoastLevel);
                            }
                            if (type === "recipe") {
                                setRecipeBrewerType(selectedType as BrewerType);
                            }
                            setIconDialogActive(false);
                        }}
                        onClose={() => setIconDialogActive(false)}
                    />
                )}
                <button
                    className="absolute top-2 right-2 bg-transparent rounded-full p-1"
                    onClick={() => setShowConfirmClose(true)}><XActionIcon strokeColor="var(--color-fg1)" /></button>
                {type === "brewer" &&
                    <>
                        <h2>{edit ? "Edit" : "New"} {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                        <div>
                            <div className="label">Name:</div>
                            <input type="text" value={name} className="name" onChange={(e) => setName(e.target.value)} placeholder="e.g. Chemex" />
                        </div>
                        <div>
                            {showErrors && brewerType.trim() === "" && <div className="error">Brewer type is required</div>}
                            <div className="label">Brewer Type:</div>
                            <div className="flex justify-center">
                                <div
                                    className={"bg-bg3 w-18 min-w-18 h-24 min-h-24 rounded-lg flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden cursor-pointer inset-ring-1 inset-ring-fg3"}
                                    onClick={() => {
                                        setIconDialogActive(true);
                                    }}>
                                    {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                                    <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-xs">
                                        <div className="text-center line-clamp-2 text-ellipsis overflow-hidden max-w-full">
                                            {brewerType}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="label">Notes:</div>
                            <textarea className="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
                        </div>
                        <button onClick={handleSave}>Save</button>
                    </>
                }
                {type === "grinder" &&
                    <>
                        <h2>{edit ? "Edit" : "New"} {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                        <div>
                            <div className="label">Name:</div>
                            <input type="text" value={name} className="name" onChange={(e) => setName(e.target.value)} placeholder="e.g. Caffia Barista" />
                        </div>
                        <div>
                            {showErrors && grinderType.trim() === "" && <div className="error">Grinder type is required</div>}
                            <div className="label">Grinder Type:</div>
                            <div className="flex justify-center">
                                <div
                                    className={"bg-bg3 w-18 min-w-18 h-24 min-h-24 rounded-lg flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden cursor-pointer inset-ring-1 inset-ring-fg3"}
                                    onClick={() => {
                                        setIconDialogActive(true);
                                    }}>
                                    {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                                    <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-xs">
                                        <div className="text-center line-clamp-2 text-ellipsis overflow-hidden max-w-full">
                                            {grinderType}
                                        </div>
                                    </div>
                                </div >
                            </div>
                        </div>
                        <div>
                            {showErrors && scaleMin === null && <div className="error">Scale Min is required</div>}
                            <div className="label">Scale Min:</div>
                            <input
                                type="number"
                                step="any"
                                className="value"
                                value={scaleMin ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') {
                                        setScaleMin(null); // Allows clearing the field cleanly
                                        return;
                                    }
                                    const parsed = parseFloat(val);
                                    if (!isNaN(parsed)) {
                                        setScaleMin(parsed);
                                    }
                                }}
                                placeholder="Scale Min"
                            />
                        </div>
                        <div>
                            {showErrors && scaleMax === null && <div className="error">Scale Max is required</div>}
                            <div className="label">Scale Max:</div>
                            <input
                                type="number"
                                step="any"
                                className="value"
                                value={scaleMax ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') {
                                        setScaleMax(null);
                                        return;
                                    }
                                    const parsed = parseFloat(val);
                                    if (!isNaN(parsed)) {
                                        setScaleMax(parsed);
                                    }
                                }}
                                placeholder="Scale Max"
                            />
                        </div>
                        <div>
                            {showErrors && stepSize === null && <div className="error">Scale Step Size is required</div>}
                            <div className="label text-nowrap">Scale Step Size:</div>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                className="value"
                                value={stepSize ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') {
                                        setStepSize(null);
                                        return;
                                    }
                                    const parsed = parseFloat(val);
                                    if (!isNaN(parsed)) {
                                        setStepSize(parsed);
                                    }
                                }}
                                placeholder="Scale Step"
                            />
                        </div>
                        <div>
                            <div className="label">Notes:</div>
                            <textarea className="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
                        </div>
                        <button onClick={handleSave}>Save</button>
                    </>
                }
                {type === "bag" &&
                    <>
                        <h2>{edit ? "Edit" : "New"} {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                        <div>
                            <div className="label">Name:</div>
                            <input type="text" value={name} className="name" onChange={(e) => setName(e.target.value)} placeholder="e.g. Brasil Semante" />
                        </div>
                        <div>
                            {showErrors && roastLevel.trim() === "" && <div className="error">Roast Level is required</div>}
                            <div className="label">Roast Level:</div>
                            <div className="flex justify-center">
                                <div
                                    className={"bg-bg3 w-18 min-w-18 h-24 min-h-24 rounded-lg flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden cursor-pointer inset-ring-1 inset-ring-fg3"}
                                    onClick={() => {
                                        setIconDialogActive(true);
                                    }}>
                                    {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                                    <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-xs">
                                        <div className="text-center line-clamp-2 text-ellipsis overflow-hidden max-w-full">
                                            {roastLevel}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="label">Roaster:</div>
                            <input type="text" value={roaster} className="name" onChange={(e) => setRoaster(e.target.value)} placeholder="e.g. Local Roaster" />
                        </div>
                        <div>
                            <div className="label">Roast date:</div>
                            <input type="date" value={roastDate ? new Date(roastDate).toISOString().split('T')[0] : ''}
                                className="date"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Set ISO string if valid date selected, otherwise empty string
                                    setRoastDate(val ? new Date(val).toISOString() : '');
                                }}
                                placeholder="" />
                        </div>
                        <div>
                            <div className="label">Date opened:</div>
                            <input type="date" value={dateOpened ? new Date(dateOpened).toISOString().split('T')[0] : ''}
                                className="date"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Set ISO string if valid date selected, otherwise empty string
                                    setDateOpened(val ? new Date(val).toISOString() : '');
                                }}
                                placeholder="" />
                        </div>
                        <div>
                            <div className="label">Notes:</div>
                            <textarea className="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
                        </div>
                        <button onClick={handleSave}>Save</button>
                    </>
                }
                {type === "recipe" &&
                    <>
                        <h2>{edit ? "Edit" : "New"} {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                        <div>
                            <div className="label">Name:</div>
                            <input type="text" value={name} className="name" onChange={(e) => setName(e.target.value)} placeholder="e.g. Strong V60" />
                        </div>
                        <div>
                            {showErrors && recipeBrewerType.trim() === "" && <div className="error">Brewer type is required</div>}
                            <div className="label">Intended Brewer Type:</div>
                            <div className="flex justify-center">
                                <div
                                    className={"w-18 min-w-18 h-24 min-h-24 rounded-lg flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden cursor-pointer inset-ring-1 inset-ring-fg3"}
                                    onClick={() => {
                                        setIconDialogActive(true);
                                    }}>
                                    {icon && createElement(icon, { style: { width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" } })}
                                    <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-xs">
                                        <div className="text-center line-clamp-2 text-ellipsis overflow-hidden max-w-full">
                                            {recipeBrewerType}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div>
                                {showErrors && waterMl === null && <div className="error">Water (ml) is required</div>}
                                <div className="label">Water (ml):</div>
                                <input type="number"
                                    value={waterMl !== null ? waterMl : ''}
                                    step="1"
                                    min="0"
                                    className="value"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Allow clearing the field without forcing a 0 or NaN
                                        if (val === '') {
                                            setWaterMl(null); // or null / undefined depending on your state type
                                            return;
                                        }
                                        // Parse directly as integer (discarding decimals)
                                        const parsed = parseInt(val, 10);
                                        if (!isNaN(parsed)) {
                                            setWaterMl(parsed);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent typing decimal points '.', ',', or exponent 'e'/'E'
                                        if (['.', ',', 'e', 'E', '-'].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="e.g. 300" />
                            </div>
                            <div>
                                {showErrors && grindPct === null && <div className="error">Grind (%) is required</div>}
                                <div className="label">Grind (%):</div>
                                <input
                                    type="number"
                                    value={grindPct !== null ? grindPct : ''}
                                    step="1"
                                    min="0"
                                    max="100"
                                    className="value"
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        if (val === '') {
                                            setGrindPct(null);
                                            return;
                                        }

                                        const parsed = parseInt(val, 10);
                                        if (!isNaN(parsed)) {
                                            // Clamp percentage between 0% and 100%
                                            const clamped = Math.min(100, Math.max(0, parsed));
                                            setGrindPct(clamped);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent typing decimals, exponents, or negative signs
                                        if (['.', ',', 'e', 'E', '-'].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="e.g. 45"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div>
                                {showErrors && doseG === null && <div className="error">Dose (g) is required</div>}
                                <div className="label">Dose (g):</div>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    className="value"
                                    value={doseG !== null ? doseG : ''}
                                    placeholder="e.g. 18.5"
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        if (val === '') {
                                            setdoseG(null);
                                            return;
                                        }

                                        // If user is actively typing a trailing decimal point (e.g. "18."),
                                        // keep state unchanged or don't block typing
                                        if (val.endsWith('.') || val.endsWith(',')) {
                                            return;
                                        }

                                        // Limit input to max 1 decimal place string-wise
                                        const parts = val.split(/[.,]/);
                                        if (parts[1] && parts[1].length > 1) {
                                            return; // Ignores typing a 2nd decimal place
                                        }

                                        const parsed = parseFloat(val);
                                        if (!isNaN(parsed)) {
                                            // Clean JS floating point noise to 1 decimal
                                            setdoseG(Math.round(parsed * 10) / 10);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Block e/E/minus, but allow decimal separator
                                        if (['e', 'E', '-'].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                        // Prevent typing a second decimal point if one already exists
                                        if (
                                            (e.key === '.' || e.key === ',') &&
                                            e.currentTarget.value.includes('.')
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                {showErrors && tempC === null && <div className="error">Temperature (°C) is required</div>}
                                <div className="label">Temperature (°C):</div>
                                <input
                                    type="number"
                                    value={tempC !== null ? tempC : ''}
                                    step="1"
                                    min="0"
                                    max="100"
                                    className="value"
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        if (val === '') {
                                            setTempC(null);
                                            return;
                                        }

                                        const parsed = parseInt(val, 10);
                                        if (!isNaN(parsed)) {
                                            // Clamp value between min (0) and max (100)
                                            const clamped = Math.min(100, Math.max(0, parsed));
                                            setTempC(clamped);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent typing decimals, exponents, or negative signs
                                        if (['.', ',', 'e', 'E', '-'].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="e.g. 93"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="label">Instructions:</div>
                            <textarea className="notes h-40" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="e.g. Pour in three phases." />
                        </div>
                        <div>
                            <div className="label">Notes:</div>
                            <textarea className="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
                        </div>
                        <button onClick={handleSave}>Save</button>
                    </>
                }
            </div>
        </div>
    );
}

export const ItemLibraryDialog = ({
    onItemSelected,
    items,
    type,
    onClose,
    onNewItem,
    onRemoveItem,
    onEditItem,
    onSelectDetails,
    brewerType }:
    {
        items: ItemType[];
        onItemSelected?: (item: ItemType) => void | null;
        onClose: () => void;
        onNewItem?: ((item: ItemType) => void);
        onRemoveItem?: ((item: ItemType) => void);
        onEditItem?: ((id: string, item: ItemType) => void);
        onSelectDetails?: boolean;
        type: ItemTypeName;
        brewerType?: BrewerType | null;
    }) => {


    const [filter, setFilter] = useState('');
    const [matchFilter, setMatchFilter] = useState(true);
    const filterParts = filter.split(" ").map((part) => part.trim().toLowerCase()).filter((part) => part.length > 0);
    const filteredItems = items.filter((item) => (
        (
            filterParts.every((part) => item.name.toLowerCase().includes(part) ||
                ((type === "brewer" || type === "recipe") && (item as Brewer).type.toLowerCase().includes(part)) ||
                (type === "recipe" && (item as Recipe).instructions.toLowerCase().includes(part))
            ) ||
            filter === ''
        )
        && (type !== "recipe" || !matchFilter || !brewerType || (item as Recipe).type === brewerType)
    ));

    const [newItemDialogActive, setNewItemDialogActive] = useState(false);

    return (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
            <div className="bg-white z-60 p-4 rounded shadow-md min-w-64 relative z-1">
                {newItemDialogActive && onNewItem && (
                    <NewItemDialog
                        item={undefined}
                        onClose={() => setNewItemDialogActive(false)}
                        type={type}
                        onSave={(item) => {
                            onNewItem?.(item);
                            setNewItemDialogActive(false);
                        }}
                    />
                )}
                <div>{type.charAt(0).toUpperCase() + type.slice(1)} Gallery:</div>
                <div>
                    <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter ..." />
                    <button onClick={() => setFilter('')}>Clear Filter</button>
                </div>
                {type === "recipe" && brewerType && (
                    <button className={"rounded-full sm" + (matchFilter ? "" : " inverse")}
                        onClick={() => setMatchFilter(!matchFilter)}
                    >
                        {brewerType}
                    </button>
                )}

                <div className="overflow-y-auto h-96 min-h-96 max-h-96 w-84 min-w-72">
                    <div className="flex flex-wrap gap-2">
                        <>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <SmallItemCard
                                        key={item.id}
                                        item={item}
                                        type={type}
                                        isSelected={false}
                                        onItemSelected={onItemSelected ? onItemSelected : undefined}
                                        onSelectDetails={onSelectDetails}
                                        onEditItem={onEditItem ? onEditItem : undefined}
                                        onRemoveItem={onRemoveItem ? onRemoveItem : undefined}
                                        onNewItem={onNewItem ? onNewItem : undefined}
                                    />
                                ))
                            ) : (
                                <div>No items available.</div>
                            )}
                            {onNewItem ? <button onClick={() => setNewItemDialogActive(true)}>New Item</button> : null}
                        </>
                    </div>
                </div>
                <button
                    className="absolute top-2 right-2 hover:bg-gray-300 rounded-full p-1"
                    onClick={onClose}><MdClose /></button>
            </div>
        </div>
    );
}


export const PickItemCarousel = (
    {
        items,
        type,
        brewerType,
        selectedItem = null,
        onItemSelected = null,
        onSelectDetails = false,
        onNewItem = null,
        onRemoveItem = null,
        onEditItem = null,
    }: {
        items: ItemType[];
        type: 'brewer' | 'grinder' | 'bag' | 'recipe';
        brewerType?: BrewerType | null;
        selectedItem?: ItemType | null;
        onItemSelected?: ((item: ItemType) => void) | null;
        onSelectDetails?: boolean;
        onNewItem?: ((item: ItemType) => void) | null;
        onRemoveItem?: ((item: ItemType) => void) | null;
        onEditItem?: ((id: string, item: ItemType) => void) | null;
    }) => {
    const matchingItems = type === "recipe" && brewerType ? items.filter((item) => (item as Recipe).type === brewerType) : items;
    const activeUsedItems = matchingItems.filter((item) => item.usedInBrew && !item.isBase);
    const inactiveUserItems = matchingItems.filter((item) => !item.usedInBrew && !item.isBase);
    const activeBaseItems = matchingItems.filter((item) => item.isBase && item.usedInBrew);
    const visibleItems = [...activeUsedItems, ...inactiveUserItems, ...activeBaseItems];
    if (selectedItem && !visibleItems.some((item) => item.id === selectedItem.id)) {
        visibleItems.push(selectedItem);
    }

    const containerRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const [libraryDialogActive, setLibraryDialogActive] = useState(false);




    useEffect(() => {
        if (selectedItem) {
            selectedItemRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItem?.id, visibleItems.length]);

    const checkCanScroll = () => {
        const el = containerRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;

        setCanScrollLeft(scrollLeft > 1);

        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        checkCanScroll();
        el.addEventListener("scroll", checkCanScroll);
        const resizeObserver = new ResizeObserver(() => checkCanScroll());
        resizeObserver.observe(el);
        return () => {
            el.removeEventListener("scroll", checkCanScroll);
            resizeObserver.disconnect();
        };
    }, [visibleItems.length]);

    const handleScroll = (deltaX: number) => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: deltaX,
                behavior: "smooth",
            });
        }
    };
    return (
        <div className="relative w-full min-w-0">
            {libraryDialogActive && (
                <ItemLibraryDialog
                    onItemSelected={
                        onItemSelected ? (item) => {
                            onItemSelected(item);
                            setLibraryDialogActive(false);
                        } : undefined
                    }
                    items={items}
                    type={type}
                    onClose={() => setLibraryDialogActive(false)}
                    onNewItem={onNewItem ? (item) => {
                        onNewItem(item);
                        setLibraryDialogActive(false);
                        onItemSelected?.(item);
                    } : undefined}
                    onEditItem={onEditItem ? (id, item) => {
                        onEditItem(id, item);
                        setLibraryDialogActive(false);
                        onItemSelected?.(item);
                    } : undefined}
                    onRemoveItem={onRemoveItem ? onRemoveItem : undefined}
                    brewerType={brewerType ? brewerType : undefined}
                />
            )}
            {canScrollLeft && (
                <button
                    onClick={() => handleScroll(-200)}
                    className="absolute top-0 left-0 h-full px-[2px] rounded-sm shadow-[4px_0_8px_-4px_#0005] 
                    z-10 opacity-80 hover:opacity-100 transition-opacity text-fg1 bg-bg1 border border-bg3"
                    aria-label="Scroll Left"
                >
                    &lt;
                </button>
            )}
            {canScrollRight && (
                <button
                    onClick={() => handleScroll(200)}
                    className="absolute top-0 right-0 h-full p-[2px] rounded-sm shadow-[-4px_0_8px_-4px_#0005]
                    z-10 opacity-80 hover:opacity-100 transition-opacity text-fg1 bg-bg1 border border-bg3"
                    aria-label="Scroll Right"
                >
                    &gt;
                </button>
            )}
            <div className="overflow-x-auto no-scrollbar w-full"
                ref={containerRef}>
                <div className="flex items-center justify-start gap-2 min-h-15">
                    {visibleItems.length > 0 && (
                        visibleItems.map((item) => (
                            <SmallItemCard
                                key={item.id}
                                item={item}
                                type={type}
                                isSelected={selectedItem?.id === item.id}
                                onItemSelected={onItemSelected ? onItemSelected : undefined}
                                itemRef={selectedItem?.id === item.id ? selectedItemRef : null}
                                onEditItem={onEditItem ? onEditItem : undefined}
                                onRemoveItem={onRemoveItem ? onRemoveItem : undefined}
                                onNewItem={onNewItem ? onNewItem : undefined}
                            />
                        ))
                    )}
                    <button className="sm"
                        onClick={() => setLibraryDialogActive(true)}>
                        More ...
                    </button>
                </div>
            </div>

        </div>
    );
};


export const NewBrewDialog = ({
    brew,
    edit = false,
    bags,
    brewers,
    grinders,
    recipes,
    brews,
    onSaveBrew,
    onCancel,
    onAddBag,
    onRemoveBag,
    onEditBag,
    onAddGrinder,
    onRemoveGrinder,
    onEditGrinder,
    onAddRecipe,
    onRemoveRecipe,
    onEditRecipe,
    onAddBrewer,
    onRemoveBrewer,
    onEditBrewer,
}:
    {
        brew?: Brew;
        edit?: boolean;
        onSaveBrew: (brew: Brew) => void;
        onCancel: () => void;

        bags: Bag[];
        brewers: Brewer[];
        grinders: Grinder[];
        recipes: Recipe[];
        brews: Brew[];

        onAddBag: (bag: Bag) => void;
        onRemoveBag: (bag: Bag) => void;
        onEditBag: (id: string, bag: Bag) => void;
        onAddBrewer: (brewer: Brewer) => void;
        onRemoveBrewer: (brewer: Brewer) => void;
        onEditBrewer: (id: string, brewer: Brewer) => void;
        onRemoveGrinder: (grinder: Grinder) => void;
        onEditGrinder: (id: string, grinder: Grinder) => void;
        onAddGrinder: (grinder: Grinder) => void;
        onAddRecipe: (recipe: Recipe) => void;
        onRemoveRecipe: (recipe: Recipe) => void;
        onEditRecipe: (id: string, recipe: Recipe) => void;
    }) => {
    const [name, setName] = useState(brew?.name || `Brew ${brews.length + 1}`);
    const [notes, setNotes] = useState(brew?.notes || '');
    const [brewerId, setBrewerId] = useState<string | undefined>(brew?.brewerId);
    const getBrewer = (brewerId: string | undefined) => {
        return (brew?.brewerId && brewers.find((b) => b.id === brew.brewerId)) ||
            brewers.find((b) => b.id === brewerId) ||
            null;
    };
    const brewer = getBrewer(brewerId);
    const [grinderId, setGrinderId] = useState<string | undefined>(brew?.grinderId);
    const getGrinder = (grinderId: string | undefined) => {
        return (brew?.grinderId && grinders.find((g) => g.id === brew.grinderId)) ||
            grinders.find((g) => g.id === grinderId) ||
            null;
    }
    const grinder = getGrinder(grinderId);
    const [bagId, setBagId] = useState<string | undefined>(brew?.bagId);
    const getBag = (bagId: string | undefined) => {
        return (brew?.bagId && bags.find((b) => b.id === brew.bagId)) ||
            bags.find((b) => b.id === bagId) ||
            null;
    }
    const bag = getBag(bagId);
    const [recipeId, setRecipeId] = useState<string | undefined>(brew?.recipeId);
    const getRecipe = (recipeId: string | undefined) => {
        return (brew?.recipeId && recipes.find((r) => r.id === brew.recipeId)) ||
            recipes.find((r) => r.id === recipeId) ||
            null;
    }
    const recipe = getRecipe(recipeId);

    const [showErrors, setShowErrors] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);

    return (
        <div className="dialog">
            <div className="backdrop" onClick={() => setShowConfirmClose(true)}></div>
            <div className="details flex flex-col gap-2">
                {showConfirmClose && (
                    <ConfirmModal
                        title="Are you sure you want to close the new brew dialog?"
                        okButton="Yes Close"
                        onConfirm={onCancel}
                        onCancel={() => setShowConfirmClose(false)}
                    />
                )}
                <h2>{edit ? "Edit Brew" : "New Brew"}</h2>
                <div className="flex flex-col gap-1">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. India on Aeropress"
                        className="name"
                    />
                    {brewer && recipe && brewer.type !== recipe.type && (
                        <div className="error">Brewer type does not match recipe type.</div>
                    )}
                    <div>
                        {!bag && showErrors && <div className="error">No bag selected</div>}
                        <div className="label">Bag:</div>
                        <PickItemCarousel
                            selectedItem={bag}
                            onItemSelected={(item) => {
                                setBagId(item?.id);
                            }}
                            items={bags}
                            type="bag"
                            onNewItem={onAddBag ? (item) => onAddBag(item as Bag) : undefined}
                            onRemoveItem={onRemoveBag ? (item) => onRemoveBag(item as Bag) : undefined}
                            onEditItem={onEditBag ? (id, item) => onEditBag(id, item as Bag) : undefined}
                        />
                    </div>
                    <div>
                        {!grinder && showErrors && <div className="error">No grinder selected</div>}
                        <div className="label">Grinder:</div>
                        <PickItemCarousel
                            selectedItem={grinder}
                            onItemSelected={(item) => {
                                setGrinderId(item?.id);
                            }}
                            items={grinders}
                            type="grinder"
                            onNewItem={onAddGrinder ? (item) => onAddGrinder(item as Grinder) : undefined}
                            onEditItem={onEditGrinder ? (id, item) => onEditGrinder(id, item as Grinder) : undefined}
                            onRemoveItem={onRemoveGrinder ? (item) => onRemoveGrinder(item as Grinder) : undefined}
                        />
                    </div>
                    <div>
                        {!brewer && showErrors && <div className="error">No brewer selected</div>}
                        <div className="label">Brewer:</div>
                        <PickItemCarousel
                            selectedItem={brewer}
                            onItemSelected={(item) => {
                                setBrewerId(item?.id);
                            }}
                            items={brewers}
                            type="brewer"
                            onNewItem={onAddBrewer ? (item) => onAddBrewer(item as Brewer) : undefined}
                            onEditItem={onEditBrewer ? (id, item) => onEditBrewer(id, item as Brewer) : undefined}
                            onRemoveItem={onRemoveBrewer ? (item) => onRemoveBrewer(item as Brewer) : undefined}
                        />
                    </div>
                    <div>
                        {!recipe && showErrors && <div className="error">No recipe selected</div>}
                        <div className="label">Recipe:</div>
                        <PickItemCarousel
                            items={recipes}
                            selectedItem={recipe}
                            onItemSelected={(item) => {
                                setRecipeId(item?.id);
                            }}
                            type="recipe"
                            brewerType={brewer?.type}
                            onNewItem={onAddRecipe ? (item) => onAddRecipe(item as Recipe) : undefined}
                            onRemoveItem={onRemoveRecipe ? (item) => onRemoveRecipe(item as Recipe) : undefined}
                            onEditItem={onEditRecipe ? (id, item) => onEditRecipe(id, item as Recipe) : undefined}
                        />
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notes"
                        className="notes"
                    />
                </div>

                <button onClick={() => {
                    if (!brewer || !grinder || !bag || !recipe) {
                        setShowErrors(true);
                        return;
                    }
                    onSaveBrew({
                        name: (name.trim() === "") ? `Brew ${brews.length + 1}` : name,
                        brewerId: brewer.id,
                        grinderId: grinder.id,
                        bagId: bag.id,
                        recipeId: recipe.id,
                        timestamp: new Date().toISOString(),
                        notes: (notes.trim() === "") ? undefined : notes,
                    })
                }}>
                    Save Brew
                </button>
                <button className="absolute top-2 right-2 p-1 rounded-full bg-transparent" onClick={() => setShowConfirmClose(true)}><XActionIcon strokeColor="var(--color-fg1)" /></button>
            </div>
        </div>
    );
}

export const BrewDetailsDialog = ({
    brew,
    onClose,
    brewers,
    grinders,
    bags,
    recipes,
    brews,
    onDeleteBrew,
    onNewBrew,
    onEditBrew,

    onAddBag,
    onRemoveBag,
    onEditBag,
    onAddGrinder,
    onRemoveGrinder,
    onEditGrinder,
    onAddRecipe,
    onRemoveRecipe,
    onEditRecipe,
    onAddBrewer,
    onRemoveBrewer,
    onEditBrewer,
    onSaveEvaluation,
    onSaveDialIn,
    onDeleteLastEvaluation,
    onDeleteLastDialIn,
}:
    {
        brew: Brew;
        onClose: () => void;

        brewers: Brewer[];
        grinders: Grinder[];
        bags: Bag[];
        recipes: Recipe[];
        brews: Brew[];

        onDeleteBrew: (brew: Brew) => void;
        onNewBrew: (brew: Brew) => void;
        onEditBrew: (id: string, brew: Brew) => void;

        onSaveEvaluation: (brew: Brew, evaluation: Omit<Evaluation, 'timestamp'>) => void;
        onSaveDialIn: (brew: Brew, dialIn: Omit<DialIn, 'id' | 'timestamp' | 'evaluations'>) => void;
        onDeleteLastEvaluation: (brew: Brew) => void;
        onDeleteLastDialIn: (brew: Brew) => void;

        onAddBag: (bag: Bag) => void;
        onRemoveBag: (bag: Bag) => void;
        onEditBag: (id: string, bag: Bag) => void;
        onAddBrewer: (brewer: Brewer) => void;
        onRemoveBrewer: (brewer: Brewer) => void;
        onEditBrewer: (id: string, brewer: Brewer) => void;
        onRemoveGrinder: (grinder: Grinder) => void;
        onEditGrinder: (id: string, grinder: Grinder) => void;
        onAddGrinder: (grinder: Grinder) => void;
        onAddRecipe: (recipe: Recipe) => void;
        onRemoveRecipe: (recipe: Recipe) => void;
        onEditRecipe: (id: string, recipe: Recipe) => void;

    }) => {
    const { markBagOpened, markBagFinished, markBagRestocked } = useDialBean();

    const brewer: Brewer | undefined = brewers.find((b) => b.id === brew.brewerId);
    const grinder: Grinder | undefined = grinders.find((g) => g.id === brew.grinderId);
    const bag: Bag | undefined = bags.find((b) => b.id === brew.bagId);
    const recipe: Recipe | undefined = recipes.find((r) => r.id === brew.recipeId);
    //dialogs
    const [showBagFinishedModal, setShowBagFinishedModal] = useState<boolean>(false);
    const [showBagRestockedModal, setShowBagRestockedModal] = useState<boolean>(false);
    const [showBagOpenedModal, setShowBagOpenedModal] = useState<boolean>(false);
    const [showNewEvaluationDialog, setShowNewEvaluationDialog] = useState<boolean>(false);
    const [showNewDialInDialog, setShowNewDialInDialog] = useState<boolean>(false);


    const [newBrewDialog, setNewBrewDialog] = useState<boolean>(false);
    const [editBrew, setEditBrew] = useState<boolean>(false);
    const [showConfirmEditBrewModal, setShowConfirmEditBrewModal] = useState<boolean>(false);
    const [showConfirmDeleteBrewModal, setShowConfirmDeleteBrewModal] = useState<boolean>(false);
    const [showConfirmCopyBrewModal, setShowConfirmCopyBrewModal] = useState<boolean>(false);

    // gui
    const [showDialIns, setShowDialIns] = useState<boolean>(false);
    const [showOptionButtons, setShowOptionButtons] = useState<boolean>(false);


    if (!brewer || !grinder || !bag || !recipe) return;

    return (
        <div className="dialog">
            {showConfirmEditBrewModal && (
                <ConfirmModal
                    title={`Are you sure you want to edit ${brew.name}?`}
                    okButton="Yes Edit"
                    onCancel={() => setShowConfirmEditBrewModal(false)}
                    onConfirm={() => {
                        setNewBrewDialog(true);
                        setEditBrew(true);
                        setShowConfirmEditBrewModal(false);
                    }}
                />
            )}
            {showConfirmDeleteBrewModal && (
                <ConfirmModal
                    title={`Are you sure you want to delete ${brew.name}?`}
                    okButton="Yes Delete"
                    onCancel={() => setShowConfirmDeleteBrewModal(false)}
                    onConfirm={() => {
                        onDeleteBrew(brew);
                        setShowConfirmDeleteBrewModal(false);
                    }}
                />
            )}
            {showConfirmCopyBrewModal && (
                <ConfirmModal
                    title={`Are you sure you want to copy ${brew.name}?`}
                    okButton="Yes Copy"
                    onCancel={() => setShowConfirmCopyBrewModal(false)}
                    onConfirm={() => {
                        setNewBrewDialog(true);
                        setEditBrew(false);
                        setShowConfirmCopyBrewModal(false);
                    }}
                />
            )}
            {newBrewDialog && (
                <NewBrewDialog
                    onSaveBrew={(brewIn) => {
                        if (editBrew) {
                            onEditBrew(brew.id, brewIn);
                        } else {
                            onNewBrew(brewIn);
                        }
                        setEditBrew(false);
                        setNewBrewDialog(false);
                    }}
                    onCancel={() => {
                        setNewBrewDialog(false);
                        setEditBrew(false);
                    }}
                    edit={editBrew}
                    brew={brew}
                    bags={bags}
                    brewers={brewers}
                    grinders={grinders}
                    recipes={recipes}
                    brews={brews}
                    onAddBrewer={onAddBrewer}
                    onAddGrinder={onAddGrinder}
                    onAddBag={onAddBag}
                    onAddRecipe={onAddRecipe}
                    onRemoveBag={onRemoveBag}
                    onRemoveBrewer={onRemoveBrewer}
                    onRemoveGrinder={onRemoveGrinder}
                    onRemoveRecipe={onRemoveRecipe}
                    onEditBag={onEditBag}
                    onEditBrewer={onEditBrewer}
                    onEditGrinder={onEditGrinder}
                    onEditRecipe={onEditRecipe}
                />
            )}
            {showBagOpenedModal && (
                <ConfirmModal
                    title={`Are you sure you want to mark ${bag.name} as opened?`}
                    okButton="Yes Open"
                    onCancel={() => setShowBagOpenedModal(false)}
                    onConfirm={() => {
                        markBagOpened(bag.id);
                        setShowBagOpenedModal(false);
                    }}
                />
            )}
            {showBagRestockedModal && (
                <ConfirmModal
                    title={`Are you sure you want to mark ${bag.name} as restocked?`}
                    okButton="Yes Restock"
                    onCancel={() => setShowBagRestockedModal(false)}
                    onConfirm={() => {
                        markBagRestocked(bag.id);
                        setShowBagRestockedModal(false);
                    }}
                />
            )}
            {showBagFinishedModal && (
                <ConfirmModal
                    title={`Are you sure you want to mark ${bag.name} as finished?`}
                    okButton="Yes Finish"
                    onCancel={() => setShowBagFinishedModal(false)}
                    onConfirm={() => {
                        markBagFinished(bag.id);
                        setShowBagFinishedModal(false);
                    }}
                />
            )}
            {showNewEvaluationDialog && (
                <NewEvaluationDialog
                    brew={brew}
                    onSaveEvaluation={(evaluation) => {
                        onSaveEvaluation(brew, evaluation);
                        setShowNewEvaluationDialog(false);
                    }}
                    onClose={() => setShowNewEvaluationDialog(false)}
                />
            )}
            {showNewDialInDialog && (
                <NewDialInDialog
                    brew={brew}
                    recipe={recipe}
                    grinder={grinder}
                    bag={bag}
                    onClose={() => setShowNewDialInDialog(false)}
                    onSaveDialIn={(dialIn) => {
                        onSaveDialIn(brew, dialIn);
                        setShowNewDialInDialog(false);
                    }}
                />
            )}

            <div className="backdrop" onClick={onClose}></div>
            <div className="details flex flex-col gap-2">
                <div className="flex flex-col">
                    <div className="absolute top-2 right-2 gap-2 flex items-start justify-end">
                        {showOptionButtons &&
                            <div className="flex gap-2">
                                <button className="bg-transparent rounded-full p-1" onClick={() => setShowConfirmDeleteBrewModal(true)}>
                                    <DeleteActionIcon strokeColor='var(--color-fg1)' fillColor="var(--color-bg1)" /></button>
                                <button className="bg-transparent rounded-full p-1" onClick={() => setShowConfirmCopyBrewModal(true)}>
                                    <CopyActionIcon strokeColor='var(--color-fg1)' fillColor="var(--color-bg1)" /></button>
                                <button className="bg-transparent rounded-full p-1" onClick={() => setShowConfirmEditBrewModal(true)}>
                                    <EditActionIcon strokeColor='var(--color-fg1)' fillColor="var(--color-bg1)" /></button>
                            </div>
                        }
                        <button className={"rounded-full p-1" + (showOptionButtons ? " bg-fg1" : " bg-transparent")} onClick={() => setShowOptionButtons(!showOptionButtons)}>
                            {showOptionButtons ?
                                <RightActionIcon strokeColor="var(--color-bg1)" />
                                :
                                <EllipsisActionIcon fillColor="var(--color-fg1)" />
                            }
                        </button>
                        <button className="bg-transparent rounded-full p-1" onClick={onClose}>
                            <XActionIcon strokeColor='var(--color-fg1)' fillColor="var(--color-bg1)" /></button>
                    </div>
                    <h2>{brew.name}</h2>
                    <div className="text-xs text-fg3">
                        {new Date(brew.timestamp).toLocaleString()}
                    </div>
                    {brew.lastUsedTimestamp &&
                        <div className="text-xs text-fg3">
                            {formatLastUsed(brew.lastUsedTimestamp)}
                        </div>}
                </div>
                <div className="flex justify-center items-center gap-1">
                    <SmallItemCard
                        item={brewer}
                        type="brewer"
                        onSelectDetails={true}
                        onNewItem={onAddBrewer ? (item) => onAddBrewer(item as Brewer) : undefined}
                        onEditItem={(id, item) => onEditBrewer(id, item as Brewer)}
                        onRemoveItem={(item) => onRemoveBrewer(item as Brewer)}
                    />
                    <SmallItemCard
                        item={grinder}
                        type="grinder"
                        onSelectDetails={true}
                        onNewItem={onAddGrinder ? (item) => onAddGrinder(item as Grinder) : undefined}
                        onEditItem={(id, item) => onEditGrinder(id, item as Grinder)}
                        onRemoveItem={(item) => onRemoveGrinder(item as Grinder)}
                    />
                    <SmallItemCard
                        item={bag}
                        type="bag"
                        onSelectDetails={true}
                        onNewItem={onAddBag ? (item) => onAddBag(item as Bag) : undefined}
                        onEditItem={(id, item) => onEditBag(id, item as Bag)}
                        onRemoveItem={(item) => onRemoveBag(item as Bag)}
                    />
                </div>
                <div className="flex justify-center">
                    <MediumRecipeCard
                        recipe={recipe}
                        onSelectDetails={true}
                        onNewItem={onAddRecipe ? (recipe) => onAddRecipe(recipe) : undefined}
                        onEditItem={(id, recipe) => onEditRecipe(id, recipe)}
                        onRemoveItem={(recipe) => onRemoveRecipe(recipe)}
                    />
                </div>
                {brew.dialIns.length > 0 &&
                    <div>
                        {showDialIns ? (
                            <div>
                                <div className="label">All Dial-Ins:</div>
                                <div className="flex justify-center">
                                    <div className="flex flex-col items-stretch gap-1">
                                        <button className="sm my-1" onClick={() => setShowDialIns(false)}>Hide Dial-Ins</button>
                                        <DialInDetailsBlock
                                            brew={brew}
                                            recipe={recipe}
                                            grinder={grinder}
                                            onDeleteLastEvaluation={onDeleteLastEvaluation}
                                            onDeleteLastDialIn={onDeleteLastDialIn}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 cursor-pointer"
                                onClick={() => setShowDialIns(!showDialIns)}>
                                <div className="label">Last Dial-In:</div>
                                <div className="flex justify-center">
                                    <div>
                                        <DialInCard
                                            dialIn={brew.dialIns[brew.dialIns.length - 1]}
                                            recipe={recipe}
                                            grinder={grinder}
                                        />
                                        {brew.dialIns.length > 0 && brew.dialIns[brew.dialIns.length - 1].evaluations.length > 0 &&
                                            <div className="">
                                                <EvaluationAverageCard
                                                    evaluations={brew.dialIns[brew.dialIns.length - 1].evaluations}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                }
                {brew.notes && <div>
                    <div className="label">Notes:</div>
                    <div className="notes text-sm">{brew.notes}</div>
                </div>}
                <div className="flex items-end gap-1">
                    {!bag.isBase && bag.dateOpened && !bag.isFinished &&
                        <button className="sm flex-1" onClick={() => setShowBagFinishedModal(true)}>Finish Bag</button>
                    }
                    {!bag.isBase && !bag.dateOpened &&
                        <button className="sm flex-1" onClick={() => setShowBagOpenedModal(true)}>Open Bag</button>
                    }
                    {!bag.isBase && bag.isFinished &&
                        <button className="sm flex-1" onClick={() => setShowBagRestockedModal(true)}>Restock Bag</button>
                    }
                    <button className="sm flex-1" onClick={() => setShowNewEvaluationDialog(true)}>Evaluate</button>
                    <button className="sm flex-1" onClick={() => setShowNewDialInDialog(true)}>Dial In</button>
                </div>

            </div>
        </div >
    );
}


export const NewEvaluationDialog = ({ brew, onSaveEvaluation, onClose }:
    {
        brew: Brew;
        onSaveEvaluation: (evaluation: Omit<Evaluation, 'timestamp'>) => void;
        onClose: () => void;
    }) => {

    const lastDialIn = brew.dialIns.length > 0 ? brew.dialIns[brew.dialIns.length - 1] : null;
    const lastEvaluation = lastDialIn && lastDialIn.evaluations.length > 0 ? lastDialIn.evaluations[lastDialIn.evaluations.length - 1] : null;
    const [sweetness, setSweetness] = useState(lastEvaluation ? Number(lastEvaluation.sweetness) : 3);
    const [acidity, setAcidity] = useState(lastEvaluation ? Number(lastEvaluation.acidity) : 3);
    const [bitterness, setBitterness] = useState(lastEvaluation ? Number(lastEvaluation.bitterness) : 3);
    const [body, setBody] = useState(lastEvaluation ? Number(lastEvaluation.body) : 3);
    const [strength, setStrength] = useState(lastEvaluation ? Number(lastEvaluation.strength) : 3);
    const [notes, setNotes] = useState("");

    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);

    return (
        <div className="dialog">
            <div className="backdrop" onClick={() => setShowConfirmClose(true)}></div>
            <div className="details flex flex-col gap-2">
                {showConfirmClose && (
                    <ConfirmCloseEvaluation
                        onConfirm={() => {
                            setShowConfirmClose(false);
                            onClose();
                        }}
                        onCancel={() => setShowConfirmClose(false)}
                    />
                )}
                {showInfoDialog && (
                    <BrewRatingInfo
                        onClose={() => setShowInfoDialog(false)}
                    />
                )}
                <h2>New Evaluation</h2>
                {lastEvaluation &&
                    <div>
                        <div className="label">Last:</div>
                        <div className="flex justify-center">
                            <EvaluationCard
                                evaluation={lastEvaluation}
                                showNotes={true}
                            />
                        </div>
                    </div>
                }
                <div>
                    {lastEvaluation && <div className="label">New:</div>}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex flex-col gap-2">
                            <SingleRatingCard
                                rating={sweetness} onRatingSelected={setSweetness} category="sweetness"
                            />
                            <SingleRatingCard
                                rating={acidity} onRatingSelected={setAcidity} category="acidity"
                            />
                            <SingleRatingCard
                                rating={bitterness} onRatingSelected={setBitterness} category="bitterness"
                            />
                            <SingleRatingCard
                                rating={body} onRatingSelected={setBody} category="body"
                            />
                            <SingleRatingCard
                                rating={strength} onRatingSelected={setStrength} category="strength"
                            />
                        </div>
                    </div>
                </div>
                <textarea
                    className="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <button onClick={() => {
                    onSaveEvaluation({
                        sweetness,
                        acidity,
                        bitterness,
                        body,
                        strength,
                        notes
                    })
                }}>Save Evaluation</button>
                <div className="absolute top-2 right-2 flex items-start justify-end">
                    <button className="p-1 bg-transparent rounded-full" onClick={() => setShowInfoDialog(true)}><InfoActionIcon strokeColor='var(--color-fg3)' /></button>
                    <button className="p-1 bg-transparent rounded-full" onClick={() => setShowConfirmClose(true)}><XActionIcon strokeColor='var(--color-fg3)' /></button>
                </div>
            </div>
        </div>
    )
}

export const NewDialInDialog = ({ brew, recipe, grinder, bag, onSaveDialIn, onClose }:
    {
        brew: Brew;
        recipe: Recipe;
        grinder: Grinder;
        bag: Bag;
        onSaveDialIn: (dialIn: Omit<DialIn, 'id' | 'timestamp' | 'evaluations'>) => void;
        onClose: () => void;
    }) => {

    console.log(brew, recipe, grinder, bag);

    const requestSuggestion = useMemo(() => suggestRequest(brew, recipe, grinder, bag), [brew, recipe, grinder, bag]);
    const suggestedDialIn = useMemo(() => {
        if (requestSuggestion.request) {
            return suggestDialIn({ brew, recipe, grinder, bag, request: requestSuggestion.request });
        }
        return null;
    }, [brew, recipe, grinder, bag, requestSuggestion.request]);

    const lastDialIn = brew.dialIns.length > 0 ? brew.dialIns[brew.dialIns.length - 1] : null;
    const evaluationAvailable = lastDialIn && lastDialIn.evaluations.length > 1 ? true : false;
    const [showEvaluations, setShowEvaluations] = useState<boolean>(false)
    const [optimizationUsed, setOptimizationUsed] = useState<boolean>(true);

    const [showConfirmClose, setShowConfirmClose] = useState(false);

    const [request, setRequest] = useState<DialInRequest | null>(requestSuggestion.request);
    const [doseDelta, setDoseDelta] = useState<number>(suggestedDialIn ? suggestedDialIn.doseDelta : (lastDialIn ? lastDialIn.doseDelta : 0));
    const [tempDelta, setTempDelta] = useState<number>(suggestedDialIn ? suggestedDialIn.tempDelta : (lastDialIn ? lastDialIn.tempDelta : 0));
    const [grinderDelta, setGrinderDelta] = useState<number>(suggestedDialIn ? suggestedDialIn.grinderDelta : (lastDialIn ? lastDialIn.grinderDelta : 0));

    const recipeGrind = getGrind(grinder, recipe);
    const grindPrecision = getGrindPrecision(grinder);

    const handleSetRequest = (newRequest: DialInRequest) => {
        setRequest(newRequest);
        setOptimizationUsed(false);
    }

    const handleOptimize = () => {
        setOptimizationUsed(true);
        if (!request) return;
        const suggestedDialIn = suggestDialIn({ brew, recipe, grinder, bag, request });
        setDoseDelta(suggestedDialIn.doseDelta);
        setTempDelta(suggestedDialIn.tempDelta);
        setGrinderDelta(suggestedDialIn.grinderDelta);
    }

    const handleSaveDialIn = () => {
        onSaveDialIn({
            doseDelta,
            tempDelta,
            grinderDelta,
        })
    }

    const handleManualAdjust = (deltaType: 'dose' | 'temp' | 'grinder', direction: 'up' | 'down') => {
        switch (deltaType) {
            case 'dose':
                setDoseDelta(prev => direction === 'up' ? prev + 1 : prev - 1);
                break;
            case 'temp':
                setTempDelta(prev => direction === 'up' ? prev + 1 : prev - 1);
                break;
            case 'grinder':
                setGrinderDelta(prev => direction === 'up' ? prev + 1 : prev - 1);
                break;
        }
        setOptimizationUsed(false);
    }

    const requestMatchesSuggestion = request === requestSuggestion.request || !requestSuggestion.request;

    const baseOptimizationStyle = "xs p-2";
    const upOpStyle = baseOptimizationStyle + " inverse";
    const activeUpOpStyle = baseOptimizationStyle + " ";
    const downOpStyle = baseOptimizationStyle + " inverse";
    const activeDownOpStyle = baseOptimizationStyle + " ";

    return (
        <div className="dialog">
            {showConfirmClose && (
                <ConfirmCloseDialInModal
                    onConfirm={() => {
                        setShowConfirmClose(false);
                        onClose();
                    }}
                    onCancel={() => setShowConfirmClose(false)}
                />
            )}
            <div className="backdrop" onClick={() => setShowConfirmClose(true)}></div>
            <div className="details flex flex-col gap-2">
                <h2>New Dial-In</h2>
                {lastDialIn &&
                    <div className={evaluationAvailable ? "cursor-pointer" : ""} onClick={() => setShowEvaluations(!showEvaluations)}>
                        <div className="text-xs">Last Dial-In:</div>
                        <DialInCard
                            dialIn={lastDialIn}
                            recipe={recipe}
                            grinder={grinder}
                        />
                        {(lastDialIn.evaluations.length > 0) ? (
                            showEvaluations ? (
                                <div className="border-l border-fg3 pl-1 ml-3">
                                    {lastDialIn.evaluations.map((evaluation, evalIndex) => (
                                        <div key={`eval-${evalIndex}`} className="">
                                            <EvaluationCard
                                                evaluation={evaluation}
                                                showNotes={true}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EvaluationAverageCard
                                    evaluations={lastDialIn.evaluations} />
                            )) : <div className="text-xs">No Evaluations</div>}
                    </div>
                }
                <div className="flex flex-col">
                    <div className="text-xs">Suggestion: </div>
                    <div className="flex justify-between items-end gap-1">
                        <div className="">
                            <div>
                                {requestSuggestion.comment}
                            </div>
                            <div>
                                {" => "}
                                {requestSuggestion.request ? requestSuggestion.request : "No Suggestion"}
                            </div>
                        </div>
                        <button className='xs'
                            style={{ visibility: requestMatchesSuggestion ? 'hidden' : 'visible' }}
                            onClick={() => setRequest(requestSuggestion.request)}
                        >Use</button>
                    </div>

                    <div className="text-xs">Optimisation request: </div>
                    <div className="flex justify-center gap-2">
                        <div className="flex flex-col gap-2 items-center justify-start">
                            <SweetIcon style={{ width: '32px', height: '32px' }} />
                            <button onClick={() => handleSetRequest('More Sweet')} className={request === 'More Sweet' ? activeUpOpStyle : upOpStyle}><UpActionIcon /></button>
                            <button onClick={() => handleSetRequest('Less Sweet')} className={request === 'Less Sweet' ? activeDownOpStyle : downOpStyle}><DownActionIcon /></button>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-start">
                            <AcidityIcon style={{ width: '32px', height: '32px' }} />
                            <button onClick={() => handleSetRequest('More Acidic')} className={request === 'More Acidic' ? activeUpOpStyle : upOpStyle}><UpActionIcon /></button>
                            <button onClick={() => handleSetRequest('Less Acidic')} className={request === 'Less Acidic' ? activeDownOpStyle : downOpStyle}><DownActionIcon /></button>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-start">
                            <BitterIcon style={{ width: '32px', height: '32px' }} />
                            <button onClick={() => handleSetRequest('More Bitter')} className={request === 'More Bitter' ? activeUpOpStyle : upOpStyle}><UpActionIcon /></button>
                            <button onClick={() => handleSetRequest('Less Bitter')} className={request === 'Less Bitter' ? activeDownOpStyle : downOpStyle}><DownActionIcon /></button>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-start">
                            <BodyIcon style={{ width: '32px', height: '32px' }} />
                            <button onClick={() => handleSetRequest('More Body')} className={request === 'More Body' ? activeUpOpStyle : upOpStyle}><UpActionIcon /></button>
                            <button onClick={() => handleSetRequest('Less Body')} className={request === 'Less Body' ? activeDownOpStyle : downOpStyle}><DownActionIcon /></button>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-start">
                            <StrengthIcon style={{ width: '32px', height: '32px' }} />
                            <button onClick={() => handleSetRequest('More Strength')} className={request === 'More Strength' ? activeUpOpStyle : upOpStyle}><UpActionIcon /></button>
                            <button onClick={() => handleSetRequest('Less Strength')} className={request === 'Less Strength' ? activeDownOpStyle : downOpStyle}><DownActionIcon /></button>
                        </div>
                    </div>
                    <button className={"sm self-end mt-2" + ((!request || optimizationUsed) ? " opacity-50" : "")}
                        onClick={handleOptimize}>
                        {request ? ((optimizationUsed ? "Optimized: " : "Optimize: ") + request) : "Select to Optimize"}
                    </button>
                </div>
                <div className="grid grid-cols-[auto_auto_auto_50px_auto] gap-2 place-items-center">
                    <div className="row-1 col-2 text-sm">Recipe:</div>
                    <div className="row-1 col-3 text-sm">Last:</div>
                    <div className="row-1 col-4 text-sm">New:</div>
                    <div className="row-2 col-1">
                        <GrindIcon style={{ width: '32px', height: '32px' }} />
                    </div>
                    <div className={"row-2 col-2" +
                        ((grinderDelta !== 0) ? " line-through" : "")}
                    >
                        {(recipeGrind.toFixed(grindPrecision))}
                    </div>
                    <div className={"row-2 col-3" +
                        (grinderDelta !== 0 ? " line-through" : "")}
                    >
                        {
                            lastDialIn?.grinderDelta !== 0 ?
                                (recipeGrind + (lastDialIn?.grinderDelta ?? 0)).toFixed(grindPrecision)
                                :
                                "-"
                        }
                    </div>
                    <div className="row-2 col-4">
                        {grinderDelta !== 0 ? (recipeGrind + grinderDelta).toFixed(grindPrecision) : "-"}
                    </div>
                    <div className="row-2 col-5">
                        <div className="flex gap-2 ml-2">
                            <button className="sm p-2"
                                onClick={() => handleManualAdjust('grinder', 'down')}>
                                <MinusActionIcon />
                            </button>
                            <button className="sm p-2"
                                onClick={() => handleManualAdjust('grinder', 'up')}>
                                <PlusActionIcon />
                            </button>
                        </div>
                    </div>
                    <div className="row-3 col-1">
                        <TemperatureIcon style={{ width: '32px', height: '32px' }} />
                    </div>
                    <div className={"row-3 col-2" +
                        ((tempDelta !== 0) ? " line-through" : "")}
                    >
                        {(recipe.tempC).toFixed(0)}°C
                    </div>
                    <div className={"row-3 col-3" +
                        (lastDialIn?.tempDelta !== 0 ? " line-through" : "")}
                    >
                        {
                            lastDialIn?.tempDelta !== 0 ?
                                ((recipe.tempC + (lastDialIn?.tempDelta ?? 0)).toFixed(0) + "°C")
                                :
                                "-"
                        }
                    </div>
                    <div className="row-3 col-4">
                        {tempDelta !== 0 ? ((recipe.tempC + tempDelta).toFixed(0) + "°C") : "-"}
                    </div>
                    <div className="row-3 col-5">
                        <div className="flex gap-2 ml-2">
                            <button className="sm p-2"
                                onClick={() => handleManualAdjust('temp', 'down')}>
                                <MinusActionIcon />
                            </button>
                            <button className="sm p-2"
                                onClick={() => handleManualAdjust('temp', 'up')}>
                                <PlusActionIcon />
                            </button>
                        </div>
                    </div>
                    <div className="row-4 col-1">
                        <WeightIcon style={{ width: '32px', height: '32px' }} />
                    </div>
                    <div className={"row-4 col-2" +
                        ((doseDelta !== 0) ? " line-through" : "")}
                    >
                        {(recipe.doseG).toFixed(1)}g
                    </div>
                    <div className={"row-4 col-3" +
                        (lastDialIn?.doseDelta !== 0 ? " line-through" : "")}
                    >
                        {
                            lastDialIn?.doseDelta !== 0 ?
                                (recipe.doseG + (lastDialIn?.doseDelta ?? 0)).toFixed(1) + "g"
                                :
                                "-"
                        }
                    </div>
                    <div className="row-4 col-4">
                        {doseDelta !== 0 ? (recipe.doseG + doseDelta).toFixed(1) + "g" : "-"}
                    </div>
                    <div className="row-4 col-5">
                        <div className="flex ml-2 gap-2">
                            <button className="sm p-2"
                                onClick={() => handleManualAdjust('dose', 'down')}>
                                <MinusActionIcon />
                            </button>
                            <button className="sm p-2"
                                onClick={() => handleManualAdjust('dose', 'up')}>
                                <PlusActionIcon />
                            </button>
                        </div>
                    </div>
                </div>
                <button className="" onClick={handleSaveDialIn}>Save Dial-In</button>
                <button className='bg-transparent absolute top-2 right-2 p-1 rounded-full' onClick={() => setShowConfirmClose(true)}><XActionIcon strokeColor='var(--color-fg3)' /></button>
            </div>
        </div>
    )
}

export const DialInDetailsBlock = ({ brew, recipe, grinder, onDeleteLastEvaluation, onDeleteLastDialIn }:
    {
        brew: Brew;
        recipe: Recipe;
        grinder: Grinder;
        onDeleteLastEvaluation: (brew: Brew) => void;
        onDeleteLastDialIn: (brew: Brew) => void;
    }) => {
    const [showConfirmDeleteEvaluationDialog, setShowConfirmDeleteEvaluationDialog] = useState<boolean>(false);
    const [showConfirmDeleteDialInDialog, setShowConfirmDeleteDialInDialog] = useState<boolean>(false);

    const [showDetailsIndex, setShowDetailsIndex] = useState<number | null>(null);

    return (
        <>
            {showConfirmDeleteEvaluationDialog && (
                <ConfirmDeleteEvaluationModal
                    onConfirm={() => {
                        const lastDialIn = brew.dialIns[brew.dialIns.length - 1];
                        const lastEvaluation = lastDialIn?.evaluations[lastDialIn.evaluations.length - 1];
                        if (lastEvaluation) {
                            onDeleteLastEvaluation(brew);
                            setShowConfirmDeleteEvaluationDialog(false);
                        }
                        else {
                            throw new Error("No evaluation to delete");
                        }
                    }}
                    onCancel={() => setShowConfirmDeleteEvaluationDialog(false)}
                />
            )}
            {showConfirmDeleteDialInDialog && (
                <ConfirmDeleteDialInModal
                    onConfirm={() => {
                        onDeleteLastDialIn(brew);
                        setShowConfirmDeleteDialInDialog(false);
                    }}
                    onCancel={() => setShowConfirmDeleteDialInDialog(false)}
                />
            )}
            {brew.dialIns.map((dialIn, index) => (
                <div key={index} className="cursor-pointer" onClick={() => {
                    if (showDetailsIndex === index) {
                        setShowDetailsIndex(null);
                    } else {
                        setShowDetailsIndex(index);
                    }
                }}>
                    <DialInCard
                        dialIn={dialIn}
                        recipe={recipe}
                        grinder={grinder}
                    />

                    {(dialIn.evaluations.length > 0) ? (
                        showDetailsIndex === index ? (
                            <div className="border-l border-fg3 pl-1 ml-3">
                                {dialIn.evaluations.map((evaluation, evalIndex) => (
                                    <div key={`eval-${evalIndex}`} className="">
                                        <EvaluationCard
                                            evaluation={evaluation}
                                            showNotes={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EvaluationAverageCard
                                evaluations={dialIn.evaluations} />
                        )) : <div className="text-xs">No Evaluations</div>}
                </div>
            ))}
            {brew.dialIns.length > 0 && (
                brew.dialIns[brew.dialIns.length - 1].evaluations.length === 0 ? (
                    <button className="sm mb-2" onClick={() => setShowConfirmDeleteDialInDialog(true)}
                    >Delete Last Dial-In
                    </button>
                ) : ((showDetailsIndex !== null && showDetailsIndex === brew.dialIns.length - 1) && (
                    <button className="sm mb-2"
                        onClick={() => setShowConfirmDeleteEvaluationDialog(true)}
                    >Delete Last Evaluation
                    </button>
                ))
            )}
        </>
    )

}