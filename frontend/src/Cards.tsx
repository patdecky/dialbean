import { formatLastUsed } from './formating';


import {
    brewer_icons,
    grinder_icons,
    bag_icons,
    type Icon,
    SweetIcon,
    AcidityIcon,
    BitterIcon,
    BodyIcon,
    StrengthIcon,
    EvaluationIcon,
    EvaluationAverageIcon,
    DialIcon,
    WaterIcon,
    GrindIcon,
    TemperatureIcon,
    WeightIcon,
    EvaluationSingleIcon,
} from "./icons";

import {
    InfoActionIcon
} from "./action_icons";



import type { Bag, Brew, Brewer, DialIn, Evaluation, Grinder, ItemType, Recipe } from './types';
import { createElement } from 'react';
import { calculateAverageEvaluation, getDecimals, getGrind, getGrindPrecision } from './brain';



// eslint-disable-next-line react-refresh/only-export-components
export const getItemIcon = (item: ItemType, type: 'brewer' | 'grinder' | 'bag' | 'recipe'): Icon | undefined => {
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




export const SmallItemCard = ({ item, type, isSelected = false, onItemSelected = null, onDetails = null, itemRef = null }: {
    item: ItemType;
    type: 'brewer' | 'grinder' | 'bag' | 'recipe';
    isSelected?: boolean;
    onItemSelected?: ((item: ItemType) => void) | null;
    onDetails?: ((item: ItemType) => void) | null;
    itemRef?: React.Ref<HTMLDivElement> | null;
}) => {
    const icon = getItemIcon(item, type);

    return (type === "recipe" ? (
        <div
            className={"bg-bgrec w-22 min-w-22 h-22 min-h-22 flex flex-col items-center justify-stretch text-center px-1 py-2 gap-1 overflow-hidden relative" +
                (onItemSelected !== null ? " cursor-pointer hover:inset-ring-1 hover:inset-ring-fg3" : "") +
                (isSelected ? " inset-ring-fg3 inset-ring-2 hover:inset-ring-2" : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected?.(item)}>
            {onDetails && (
                <button
                    className="absolute top-0 right-0 bg-transparent rounded-full p-[2px]"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetails(item);
                    }} >
                    <InfoActionIcon size="12" strokeColor="var(--color-fg1)" />
                </button>
            )}
            <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-xs">
                <div className="text-center line-clamp-4 text-ellipsis overflow-hidden max-w-full font-hand font-bold">
                    {item.name}
                </div>
            </div>
        </div >
    ) : (
        <div
            className={"bg-bg3 w-18 min-w-18 h-24 min-h-24 rounded-lg flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden relative" +
                (onItemSelected !== null ? " cursor-pointer hover:inset-ring-1 hover:inset-ring-fg3" : "") +
                (isSelected ? " inset-ring-fg3 inset-ring-2 hover:inset-ring-2 " : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected?.(item)}>
            {onDetails && (
                <button
                    className="bg-transparent absolute top-0 right-0 rounded-full p-[2px] text-xs text-gray-400 hover:text-gray-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetails(item);
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
        </div >)
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


export const MediumRecipeCard = ({ recipe, isSelected, onItemSelected, itemRef = null, onDetails = null }: {
    recipe: Recipe;
    isSelected?: boolean;
    onItemSelected: (recipe: Recipe) => void;
    itemRef?: React.Ref<HTMLDivElement> | null;
    onDetails?: (recipe: Recipe) => void;
}) => {
    return (
        <div
            className={"bg-bgrec min-w-30 min-h-30 flex flex-col items-start justify-stretch text-center px-2 pt-3 pb-2 gap-1 overflow-hidden relative" +
                (onItemSelected !== null ? " cursor-pointer hover:inset-ring-1 hover:inset-ring-fg3" : "") +
                (isSelected ? " inset-ring-fg3 inset-ring-2 hover:inset-ring-2" : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected?.(recipe)}>
            {onDetails && (
                <button
                    className="absolute top-0 right-0 bg-transparent rounded-full p-[2px]"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetails(recipe);
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
                    <span>{recipe.doseGrams}g</span>
                ) : (
                    <>
                        <span className="line-through">{(recipe.doseGrams).toFixed(1)}</span>
                        <span>{(recipe.doseGrams + dialIn.doseDelta).toFixed(1)}g</span>
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
                <span>{(recipe.doseGrams).toFixed(1)}g</span>
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
                <div className="text-xs text-fg3">
                    {new Date(brew.timestamp).toLocaleString()}
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
                </div>
                <div className="flex flex-col items-end relative top-[-10px]">
                    {brew.lastUsedTimestamp &&
                        <div className="text-xs text-fg3">
                            {formatLastUsed(brew.lastUsedTimestamp)}
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





