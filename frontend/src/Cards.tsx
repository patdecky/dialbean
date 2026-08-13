import { formatLastUsed } from './formating';
import { MdGrain, MdWaterDrop } from "react-icons/md";
import { FaWeightHanging, FaTemperatureHalf, FaRegLemon } from "react-icons/fa6";
import { LuCandy, LuHop, LuMilk, LuSearchCheck, LuInfo } from "react-icons/lu";
import { BiSolidCoffeeBean } from "react-icons/bi";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";

import { brewer_icons, grinder_icons, bag_icons, InfoIcon } from "./icons";
import { SweetIcon, AcidityIcon, BitterIcon, BodyIcon, StrengthIcon, EvaluationIcon } from "./icons";



import type { Bag, Brew, Brewer, DialIn, Evaluation, Grinder, ItemType, Recipe } from './types';

export const SmallItemCard = ({ item, type, isSelected = false, onItemSelected = null, onDetails = null, itemRef = null }: {
    item: ItemType;
    type: 'brewer' | 'grinder' | 'bag' | 'recipe';
    isSelected?: boolean;
    onItemSelected?: ((item: ItemType) => void) | null;
    onDetails?: ((item: ItemType) => void) | null;
    itemRef?: React.Ref<HTMLDivElement> | null;
}) => {

    const Icon = type === "brewer" ? ((item as Brewer).iconId ? brewer_icons[(item as Brewer).iconId!]?.icon : brewer_icons["1"].icon) :
        type === "grinder" ? ((item as Grinder).iconId ? grinder_icons[(item as Grinder).iconId!]?.icon : grinder_icons["1"].icon) :
            type === "bag" ? ((item as Bag).iconId ? bag_icons[(item as Bag).iconId!]?.icon : bag_icons["1"].icon) : undefined;

    return (type === "recipe" ? (
        <div
            className={"bg-yellow-200 w-24 min-w-24 h-24 min-h-24 flex flex-col items-center justify-stretch text-center px-1 py-2 gap-1 overflow-hidden relative" +
                (isSelected ? " inset-ring-2 inset-ring-yellow-500" : "") +
                (onItemSelected !== null ? " cursor-pointer" : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected?.(item)}>
            {onDetails && (
                <LuInfo
                    className="absolute top-0 right-0 hover:bg-yellow-300 rounded-full p-1 text-xs w-5 h-5 text-gray-400 hover:text-gray-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetails(item);
                    }} />
            )}
            <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-sm">
                <div className="text-center line-clamp-4 text-ellipsis overflow-hidden max-w-full">
                    {item.name}
                </div>
            </div>
        </div >
    ) : (
        <div
            className={"bg-bg3 w-18 min-w-18 h-24 min-h-24 rounded-lg flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden relative" +
                (isSelected ? " inset-ring-2 inset-ring-blue-500" : "") +
                (onItemSelected !== null ? " cursor-pointer hover:inset-ring-1 hover:inset-ring-fg3" : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected?.(item)}>
            {onDetails && (
                <button
                    className="bg-transparent absolute top-0 right-0 rounded-full p-[2px] text-xs w-4 h-4 text-gray-400 hover:text-gray-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetails(item);
                    }}>
                    <InfoIcon />
                </button>
            )}
            {Icon && <Icon style={{ width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" }} />}
            <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-sm">
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

    const Icon = type === "brewer" ? ((item as Brewer).iconId ? brewer_icons[(item as Brewer).iconId!]?.icon : brewer_icons["1"].icon) :
        type === "grinder" ? ((item as Grinder).iconId ? grinder_icons[(item as Grinder).iconId!]?.icon : grinder_icons["1"].icon) :
            type === "bag" ? ((item as Bag).iconId ? bag_icons[(item as Bag).iconId!]?.icon : bag_icons["1"].icon) : undefined;

    return (type === "recipe" ? (
        <div
            className={"bg-yellow-200 w-12 min-w-12 h-12 min-h-12 flex flex-col items-center justify-stretch text-center px-[2px] py-2 gap-1 overflow-hidden relative" +
                (isSelected ? " inset-ring-2 inset-ring-yellow-500" : "") +
                (onItemSelected !== null ? " cursor-pointer" : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected?.(item)}>
            <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-sm">
                <div className="line-clamp-1 text-sm overflow-hidden max-w-full">
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
            {Icon && <Icon style={{ width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" }} />}
        </div >)
    )
}

export const LargeItemCard = ({ item, type, isSelected, onItemSelected, itemRef = null }: {
    item: ItemType;
    type: 'brewer' | 'grinder' | 'bag' | 'recipe';
    isSelected: boolean;
    onItemSelected: (item: ItemType) => void;
    itemRef?: React.Ref<HTMLDivElement> | null;
}) => {

    return (
        type === "recipe" ?
            (
                <div key={item.id}
                    className={"bg-yellow-200 w-50 min-w-50 h-50 min-h-50 cursor-pointer flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden" +
                        (isSelected ? " inset-ring-2 inset-ring-blue-500" : "")}
                    ref={itemRef}
                    onClick={() => onItemSelected(item)}>
                    <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-sm">
                        <div className="line-clamp-4">
                            {item.name}
                        </div>
                    </div>
                </div>
            ) :
            (
                <div key={item.id}
                    className={"bg-gray-200 w-18 min-w-18 h-24 min-h-24 rounded-lg cursor-pointer flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden" +
                        (isSelected ? " inset-ring-2 inset-ring-blue-500" : "")}
                    ref={itemRef}
                    onClick={() => onItemSelected(item)}>
                    {type === "brewer" && <GiCoffeePot style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }} />}
                    {type === "grinder" && <GiManualMeatGrinder style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }} />}
                    {type === "bag" && <GiCoffeeBeans style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }} />}
                    <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-sm">
                        <div className="line-clamp-2 text-ellipsis overflow-hidden max-w-full">
                            {item.name}
                        </div>
                    </div>
                </div>
            ))
}


export const EvaluationCard = ({ evaluation }: {
    evaluation: Evaluation,
}) => {
    return (
        <div className="flex justify-start gap-1 items-center">
            <div className="flex justify-start items-center">
                <EvaluationIcon style={{ width: "24px", height: "24px" }} />
            </div>
            <div className="flex justify-start items-center gap-[2px]">
                <SweetIcon />
                <span>
                    {evaluation.ratings.sweetness}
                </span>
            </div>
            <div className="flex justify-start gap-[2px] items-center">
                <AcidityIcon />
                <span>
                    {evaluation.ratings.acidity}
                </span>
            </div>
            <div className="flex justify-start gap-[2px] items-center">
                <BitterIcon />
                <span>
                    {evaluation.ratings.bitterness}
                </span>
            </div>
            <div className="flex justify-start gap-[2px] items-center">
                <BodyIcon />
                <span>
                    {evaluation.ratings.body}
                </span>
            </div>
            <div className="flex justify-start gap-[2px] items-center">
                <StrengthIcon />
                <span>
                    {evaluation.ratings.strength}
                </span>
            </div>
        </div>
    )
}


export const DialInCard = ({ dialIn, recipe, grinder, onSelected = null }: {
    dialIn: DialIn,
    recipe: Recipe,
    grinder: Grinder,
    onSelected?: (dialIn: DialIn) => void | null
}) => {
    const baseGrind = grinder.scaleMin + (grinder.scaleMax - grinder.scaleMin) * (recipe.grindPct / 100);
    const grindPrecision = grinder.stepSize < 1 ? (grinder.stepSize < 10 ? (grinder.stepSize < 100 ? (3) : 2) : 1) : 0;
    return (
        <div>
            <div className="flex justify-start gap-2 items-center">
                <div className="flex justify-start items-center">
                    <HiMiniAdjustmentsHorizontal style={{ width: "24px", height: "24px" }} />
                    <span>:</span>
                </div>
                <div className="flex justify-start gap-1 items-center">
                    <MdWaterDrop />
                    {dialIn.waterDelta === 0 ? (
                        <span>{recipe.waterMl}ml</span>
                    ) : (
                        <>
                            <span className="line-through">{recipe.waterMl}</span>
                            <span>{recipe.waterMl + dialIn.waterDelta}ml</span>
                        </>
                    )}
                </div>
                <div className="flex justify-start gap-1 items-center">
                    <MdGrain />
                    {dialIn.grinderDelta === 0 ? (
                        <>
                            <span>{baseGrind.toFixed(grindPrecision)}</span>
                        </>
                    ) : (
                        <>
                            <span className="line-through">{baseGrind.toFixed(grindPrecision)}</span>
                            <span>{(baseGrind + dialIn.grinderDelta).toFixed(grindPrecision)}</span>
                        </>
                    )}
                </div>
                <div className="flex justify-start gap-1 items-center">
                    <FaTemperatureHalf />
                    {dialIn.tempDelta === 0 ? (
                        <span>{recipe.tempC}°C</span>
                    ) : (
                        <>
                            <span className="line-through">{recipe.tempC}</span>
                            <span>{recipe.tempC + dialIn.tempDelta}°C</span>
                        </>
                    )}
                </div>
                <div className="flex justify-start gap-1 items-center">
                    <FaWeightHanging />
                    {dialIn.doseDelta === 0 ? (
                        <span>{recipe.doseGrams}g</span>
                    ) : (
                        <>
                            <span className="line-through">{recipe.doseGrams}</span>
                            <span>{recipe.doseGrams + dialIn.doseDelta}g</span>
                            <span> g</span>
                        </>
                    )}
                </div>
            </div>
            {dialIn.evaluations.length > 0 && (
                <div className="ml-8">
                    <EvaluationCard evaluation={dialIn.evaluations[dialIn.evaluations.length - 1]} />
                </div>
            )}
        </div>
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
                    <div className="flex items-center justify-start">
                        <TinyItemCard
                            item={brewer}
                            type="brewer"
                        />
                        <TinyItemCard
                            item={grinder}
                            type="grinder"
                        />
                        <TinyItemCard
                            item={bag}
                            type="bag"
                        />
                        <TinyItemCard
                            item={recipe}
                            type="recipe"
                        />
                    </div>
                    <div>
                        {brew.dialIns.length > 0 && brew.dialIns[0].evaluations.length > 0 ? (
                            <EvaluationCard evaluation={brew.dialIns[0].evaluations[brew.dialIns[0].evaluations.length - 1]} />
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







