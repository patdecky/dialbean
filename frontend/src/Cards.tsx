import { GiCoffeePot, GiManualMeatGrinder, GiCoffeeBeans } from "react-icons/gi";
import { MdGrain, MdWaterDrop } from "react-icons/md";
import { FaWeightHanging, FaTemperatureHalf, FaRegLemon  } from "react-icons/fa6";
import { LuCandy, LuHop, LuMilk, LuSearchCheck, LuInfo } from "react-icons/lu";
import { BiSolidCoffeeBean } from "react-icons/bi";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";

import { brewer_icons, grinder_icons, bag_icons } from "./icons";



import type { Bag, Brewer, DialIn, Evaluation, Grinder, ItemType, Recipe } from './types';

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
                <div className="line-clamp-4">
                    {item.name}
                </div>
            </div>
        </div >
    ) : (
        <div
            className={"bg-gray-200 w-18 min-w-18 h-24 min-h-24 rounded-lg flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden relative" +
                (isSelected ? " inset-ring-2 inset-ring-blue-500" : "") +
                (onItemSelected !== null ? " cursor-pointer" : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected?.(item)}>
            {onDetails && (
                <LuInfo
                    className="absolute top-0 right-0 hover:bg-gray-300 rounded-full p-1 text-xs w-5 h-5 text-gray-400 hover:text-gray-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetails(item);
                    }} />
            )}
            {Icon && <Icon style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }} />}
            <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-sm">
                <div className="line-clamp-2 text-ellipsis overflow-hidden max-w-full">
                    {item.name}
                </div>
            </div>
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


export const EvaluationCard = ({ evaluation, onSelected = null }: {
    evaluation: Evaluation,
    onSelected?: (evaluation: Evaluation) => void | null
}) => {
    return (
        <div>
            <div className="flex justify-start gap-2 items-center">
                <div className="flex justify-start items-center">
                    <LuSearchCheck style={{ width: "24px", height: "24px" }} />
                    <span>:</span>
                </div>
                <div className="flex justify-start gap-1 items-center">
                    <LuCandy />
                    <span>
                        {evaluation.ratings.sweetness}
                    </span>
                </div>
                <div className="flex justify-start gap-1 items-center">
                    <FaRegLemon />
                    <span>
                        {evaluation.ratings.acidity}
                    </span>
                </div>
                <div className="flex justify-start gap-1 items-center">
                    <LuHop />
                    <span>
                        {evaluation.ratings.bitterness}
                    </span>
                </div>
                <div className="flex justify-start gap-1 items-center">
                    <LuMilk />
                    <span>
                        {evaluation.ratings.body}
                    </span>
                </div>
                <div className="flex justify-start gap-1 items-center">
                    <BiSolidCoffeeBean />
                    <span>
                        {evaluation.ratings.strength}
                    </span>
                </div>
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







