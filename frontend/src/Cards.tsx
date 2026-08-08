import { GiCoffeePot, GiManualMeatGrinder, GiCoffeeBeans } from "react-icons/gi";
import type { ItemType } from './types';

export const SmallItemCard = ({ item, type, isSelected, onItemSelected, itemRef = null }: {
    item: ItemType;
    type: 'brewer' | 'grinder' | 'bag' | 'recipe';
    isSelected: boolean;
    onItemSelected: (item: ItemType) => void;
    itemRef?: React.Ref<HTMLDivElement> | null;
}) => {

    return (type === "recipe" ? (
        <div
            className={"bg-yellow-200 w-24 min-w-24 h-24 min-h-24 cursor-pointer flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden" +
                (isSelected ? " inset-ring-2 inset-ring-yellow-500" : "")
            }
            ref={itemRef}
            onClick={() => onItemSelected(item)}>
            <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-sm">
                <div className="line-clamp-4">
                    {item.name}
                </div>
            </div>
        </div >
    ) : (
        <div
            className={"bg-gray-200 w-18 min-w-18 h-24 min-h-24 rounded-lg cursor-pointer flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden" +
                (isSelected ? " inset-ring-2 inset-ring-blue-500" : "")
            }
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
        </div >)
    )
}

export const MediumItemCard = ({ item, type, isSelected, onItemSelected, onDetails, itemRef = null }: {
    item: ItemType;
    type: 'brewer' | 'grinder' | 'bag' | 'recipe';
    isSelected: boolean;
    onItemSelected: (item: ItemType) => void;
    onDetails?: ((item: ItemType) => void) | null;
    itemRef?: React.Ref<HTMLDivElement> | null;
}) => {

    return (
        type === "recipe" ?
            (
                <div key={item.id}
                    className={"relative bg-yellow-200 w-30 min-w-30 h-30 min-h-30 cursor-pointer flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden" +
                        (isSelected ? " inset-ring-2 inset-ring-blue-500" : "")}
                    ref={itemRef}
                    onClick={() => onItemSelected(item)}>
                    {onDetails && (
                        <button
                            className="absolute top-1 right-1 bg-gray-300 rounded-full p-1 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDetails(item);
                            }}
                        >
                            Details
                        </button>
                    )}
                    <div className="flex-1 max-w-full inline-flex items-center justify-center flex-col text-sm">
                        <div className="line-clamp-4">
                            {item.name}
                        </div>
                    </div>
                </div>
            ) :
            (
                <div key={item.id}
                    className={"relative bg-gray-200 w-18 min-w-18 h-24 min-h-24 rounded-lg cursor-pointer flex flex-col items-center justify-stretch text-center p-1 gap-1 overflow-hidden" +
                        (isSelected ? " inset-ring-2 inset-ring-blue-500" : "")}
                    ref={itemRef}
                    onClick={() => onItemSelected(item)}>
                    {onDetails && (
                        <button
                            className="absolute top-1 right-1 bg-gray-300 rounded-full p-1 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDetails(item);
                            }}
                        >
                            Details
                        </button>
                    )}
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











