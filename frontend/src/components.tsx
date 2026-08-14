import { useEffect, useState, useRef } from 'react';
import type { Brew, Brewer, Recipe, Grinder, Bag, ItemType, MachineType, DialIn, Evaluation, BrewerType } from './types';
import { useDialBean } from './DialBeanContext';
import { SmallItemCard, DialInCard, EvaluationCard, SingleRatingCard } from './cards';
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
    GrindIcon
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
} from "./action_icons";

import { MdClose } from "react-icons/md";
import { formatLastUsed } from './formating';
import { BrewRatingInfo, ConfirmBagFinishedModal, ConfirmCloseEvaluation, ConfirmDeleteDialInModal, ConfirmDeleteEvaluationModal } from './modals';
import { suggestDialIn } from './brain';

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

export const PickTypeDialog = ({ type, onIconSelected, onClose, selectedIconId }:
    {
        type: 'brewer' | 'grinder' | 'bag';
        onIconSelected: (iconId: string) => void;
        onClose: () => void;
        selectedIconId?: string;
    }) => {
    const icons = type === 'brewer' ? brewer_icons : type === 'grinder' ? grinder_icons : bag_icons;
    return (
        <div className="fixed top-0 left-0 w-full h-full z-100 flex items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
            <div className="bg-white shadow-xl z-60 p-4 rounded shadow-md min-w-64 relative max-h-[90dvh] overflow-y-auto shadow-md w-96">
                <div>Select type of {type}</div>
                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-96">
                    {Object.values(icons).map((iconEntry) => (
                        <div key={iconEntry.id} className="flex flex-col items-center">
                            <button
                                onClick={() => onIconSelected(iconEntry.id)}
                                className={`m-1 p-1 border rounded ${selectedIconId === iconEntry.id ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>
                                <iconEntry.icon style={{ width: "48px", height: "48px" }} />
                            </button>
                            <div className="text-center text-sm" style={{ maxWidth: "48px" }}>{iconEntry.name}</div>
                        </div>
                    ))}
                </div>
                <button className="absolute top-2 right-2 hover:bg-gray-200 rounded-full p-1" onClick={onClose}><MdClose /></button>
            </div>
        </div>
    );
};

export const ItemDetailsDialog = ({ item, type, onClose, onCopyItem, onRemoveItem }:
    {
        item: ItemType;
        type: 'brewer' | 'grinder' | 'bag' | 'recipe';
        onClose: () => void;
        onCopyItem?: ((item: ItemType) => void) | null;
        onRemoveItem?: ((item: ItemType) => void) | null;
    }) => {
    console.log(onRemoveItem)
    const Icon = type === "brewer" ? ((item as Brewer).iconId ? brewer_icons[(item as Brewer).iconId!]?.icon : brewer_icons["1"].icon) :
        type === "grinder" ? ((item as Grinder).iconId ? grinder_icons[(item as Grinder).iconId!]?.icon : grinder_icons["1"].icon) :
            type === "bag" ? ((item as Bag).iconId ? bag_icons[(item as Bag).iconId!]?.icon : bag_icons["1"].icon) : undefined;
    return (
        type === "recipe" ? (
            <div className="fixed top-0 left-0 w-full h-full z-100 flex items-center justify-center">
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
                <div className="bg-yellow-200 shadow-xl z-60 p-4 rounded shadow-md min-w-64 relative z-1 max-h-[90dvh] overflow-y-auto shadow-md w-96">
                    <div>Name: {item.name}</div>
                    <div>Method: {(item as Recipe).type}</div>
                    <div>Instructions: {(item as Recipe).instructions}</div>
                    <button
                        className="absolute top-2 right-2 hover:bg-yellow-300 rounded-full p-1"
                        onClick={onClose}><MdClose /></button>
                    <div className="flex gap-1">
                        {onCopyItem && <button className="border px-2 py-1 rounded-md hover:bg-yellow-300" onClick={() => onCopyItem(item)}>Copy</button>}
                        {onRemoveItem && <button className="border px-2 py-1 rounded-md hover:bg-yellow-300" onClick={() => onRemoveItem(item)}>Remove</button>}
                    </div>
                </div>
            </div>
        ) : (

            <div className="fixed top-0 left-0 w-full h-full z-100 flex items-center justify-center">
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
                <div className="bg-gray-200 rounded-lg z-60 p-4 rounded shadow-md relative z-1 max-h-[90dvh] overflow-y-auto shadow-md w-40 h-60">
                    <div className="flex items-center justify-center w-full mt-6">
                        {Icon && <Icon style={{ width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }} />}
                    </div>
                    {type === "brewer" &&
                        <>
                            <div>{item.name}</div>
                            <div>{(item as Brewer).type}</div>
                        </>
                    }
                    {type === "grinder" &&
                        <>
                            <div>{item.name}</div>
                            <div>{(item as Grinder).scaleMin} - {(item as Grinder).scaleMax}</div>
                        </>
                    }
                    {type === "bag" &&
                        <>
                            <div>{item.name}</div>
                            <div>{(item as Bag).roaster}</div>
                        </>
                    }
                    <button
                        className="absolute top-2 right-2 hover:bg-gray-300 rounded-full p-1"
                        onClick={onClose}><MdClose /></button>
                    <div className="flex gap-1">
                        {onCopyItem && <button className="border px-2 py-1 rounded-md hover:bg-gray-300" onClick={() => onCopyItem(item)}>Copy</button>}
                        {onRemoveItem && <button className="border px-2 py-1 rounded-md hover:bg-gray-300" onClick={() => onRemoveItem(item)}>Remove</button>}
                    </div>
                </div>
            </div>

        )
    );
}


export const NewRecipeDialog = ({ recipe, onClose, onSave }:
    {
        recipe?: Recipe | null;
        onClose: () => void;
        onSave: (recipe: Recipe) => void;
    }) => {
    return (

        <div className="fixed top-0 left-0 w-full h-full z-100 flex items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
            <div className="bg-yellow-200 shadow-xl z-60 p-4 rounded shadow-md min-w-64 relative z-1 max-h-[90dvh] overflow-y-auto shadow-md w-96">
                <div>
                    New Recipe
                </div>
                <button
                    className="hover:bg-yellow-300 rounded-full p-1"
                    onClick={() => onSave(recipe!)}>Save</button>
                <button
                    className="absolute top-2 right-2 hover:bg-yellow-300 rounded-full p-1"
                    onClick={onClose}><MdClose /></button>
            </div>
        </div>
    );
}

export const NewItemDialog = ({ item, type, onClose, onSave }:
    {
        item?: MachineType | null;
        type: 'brewer' | 'grinder' | 'bag';
        onClose: () => void;
        onSave: (item: ItemType) => void;
    }) => {
    const [iconId, setIconId] = useState((item?.iconId) ?? "1");
    const [iconDialogActive, setIconDialogActive] = useState(false);
    const [name, setName] = useState(item?.name ?? (type === "brewer" ? "Brewer" : type === "grinder" ? "Grinder" : "Bag"));
    const [method, setMethod] = useState((item as Brewer)?.type ?? "Pour-Over");
    const [scaleMin, setScaleMin] = useState((item as Grinder)?.scaleMin ?? 0);
    const [scaleMax, setScaleMax] = useState((item as Grinder)?.scaleMax ?? 10);
    const [roaster, setRoaster] = useState((item as Bag)?.roaster ?? "Roaster");
    const [roastLevel, setRoastLevel] = useState((item as Bag)?.roastLevel ?? "Medium");
    const useMethod = type === "brewer";
    const useScale = type === "grinder";
    const useRoaster = type === "bag";
    const useRoastLevel = type === "bag";
    const icon_pack = type === "brewer" ? brewer_icons : type === "grinder" ? grinder_icons : bag_icons;
    const Icon = icon_pack[iconId]?.icon;
    const handleSave = () => {
        if (type === "bag") {
            onSave({ ...(item as Bag), name, iconId } as Bag);
        } else if (type === "brewer") {
            onSave({ ...(item as Brewer), name, iconId } as Brewer);
        } else if (type === "grinder") {
            onSave({ ...(item as Grinder), name, iconId } as Grinder);
        }
    }
    return (
        <div className="fixed top-0 left-0 w-full h-full z-100 flex items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
            <div className="bg-gray-200 rounded-lg z-60 p-4 rounded shadow-md relative z-1 max-h-[90dvh] overflow-y-auto shadow-md w-40 h-60">
                {iconDialogActive && (
                    <PickTypeDialog
                        type={type}
                        selectedIconId={iconId}
                        onIconSelected={(iconId: string) => {
                            setIconId(iconId);
                            setIconDialogActive(false);
                        }}
                        onClose={() => setIconDialogActive(false)}
                    />
                )}
                <div className="flex items-center justify-center w-full mt-6">
                    <Icon onClick={() => setIconDialogActive(true)}
                        style={{ width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }} />
                </div>
                <div>
                    New Item
                </div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item Name" />
                {useMethod && <div>{method}</div>}
                {useScale && <div>{scaleMin} - {scaleMax}</div>}
                {useRoaster && <div>{roaster}</div>}
                {useRoastLevel && <div>{roastLevel}</div>}
                <button
                    className="hover:bg-gray-300 rounded-full p-1"
                    onClick={handleSave}>Save</button>
                <button
                    className="absolute top-2 right-2 hover:bg-gray-300 rounded-full p-1"
                    onClick={onClose}><MdClose /></button>
            </div>
        </div>
    );
}

export const ItemLibraryDialog = ({ onItemSelected,
    onClose,
    onNewItem,
    onRemoveItem,
    type,
    onSelectedDetails = false,
    brewerType }:
    {
        onItemSelected?: (item: ItemType) => void | null;
        onClose: () => void;
        onNewItem?: ((item: ItemType) => void) | null;
        onRemoveItem?: ((item: ItemType) => void) | null;
        type: 'brewer' | 'grinder' | 'bag' | 'recipe';
        onSelectedDetails?: boolean;
        brewerType?: BrewerType | null;
    }) => {
    const { data } = useDialBean();
    let items: ItemType[];
    if (type === 'brewer') {
        items = data.brewers;
    }
    else if (type === 'grinder') {
        items = data.grinders;
    }
    else if (type === 'bag') {
        items = data.bags;
    }
    else if (type === 'recipe') {
        items = data.recipes;
    }
    else {
        throw new Error(`Invalid type: ${type}`);
    }

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
    const [detailsItem, setDetailsItem] = useState<ItemType | null>(null);
    const [newItemDialogActive, setNewItemDialogActive] = useState(false);
    const [newItemCopy, setNewItemCopy] = useState<ItemType | null>(null);
    const [toRemoveItem, setToRemoveItem] = useState<ItemType | null>(null);
    return (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
            <div className="bg-white z-60 p-4 rounded shadow-md min-w-64 relative z-1">
                {detailsItem && (
                    <ItemDetailsDialog
                        item={detailsItem}
                        type={type}
                        onClose={() => setDetailsItem(null)}
                        onCopyItem={onNewItem ? (item: ItemType) => {
                            setNewItemCopy(item);
                            setNewItemDialogActive(true);
                            setDetailsItem(null);
                        } : undefined}
                        onRemoveItem={
                            onRemoveItem ? (item: ItemType) => {
                                setToRemoveItem(item);
                            } : undefined}
                    />
                )}
                {newItemDialogActive && (
                    <NewItemDialog
                        item={newItemCopy!}
                        onClose={() => setNewItemDialogActive(false)}
                        type={type}
                        onSave={(item) => {
                            onNewItem?.(item);
                            setNewItemDialogActive(false);
                        }}
                    />
                )}
                {toRemoveItem && (
                    <ConfirmDialog
                        message={`Are you sure you want to remove ${toRemoveItem.name}?`}
                        onConfirm={() => {
                            try {
                                onRemoveItem?.(toRemoveItem);
                                setToRemoveItem(null);
                            }
                            catch (error) {
                                alert((error as Error).message);
                                setToRemoveItem(null);
                            }
                        }}
                        onCancel={() => setToRemoveItem(null)}
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
                                        onItemSelected={onItemSelected ? onItemSelected : (onSelectedDetails ? (item) => setDetailsItem(item) : undefined)}
                                        onDetails={(item) => setDetailsItem(item)}
                                        itemRef={null}
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
        onRemoveItem = null
    }: {
        items: ItemType[];
        type: 'brewer' | 'grinder' | 'bag' | 'recipe';
        brewerType?: BrewerType | null;
        selectedItem?: ItemType | null;
        onItemSelected?: ((item: ItemType) => void) | null;
        onSelectDetails?: boolean;
        onNewItem?: ((item: ItemType) => void) | null;
        onRemoveItem?: ((item: ItemType) => void) | null;
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

    const [selectDialogActive, setSelectDialogActive] = useState(false);
    const [detailsItem, setDetailsItem] = useState<ItemType | null>(null);
    const [newItemDialogActive, setNewItemDialogActive] = useState(false);
    const [newItemCopy, setNewItemCopy] = useState<ItemType | null>(null);
    const [toRemoveItem, setToRemoveItem] = useState<ItemType | null>(null);

    useEffect(() => {
        if (selectedItem) {
            selectedItemRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        }
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
            {detailsItem && (
                <ItemDetailsDialog
                    item={detailsItem}
                    type={type}
                    onClose={() => setDetailsItem(null)}
                    onCopyItem={onNewItem ? (item: ItemType) => {
                        setNewItemCopy(item);
                        setNewItemDialogActive(true);
                        setDetailsItem(null);
                    } : undefined}
                    onRemoveItem={onRemoveItem ? (item: ItemType) => {
                        setToRemoveItem(item);
                    } : undefined}
                />
            )}
            {selectDialogActive && (
                <ItemLibraryDialog
                    onItemSelected={onItemSelected ? (item) => {
                        onItemSelected(item);
                        setSelectDialogActive(false);
                    } : undefined
                    }
                    onClose={() => setSelectDialogActive(false)}
                    onSelectedDetails={onSelectDetails}
                    onNewItem={onNewItem ? onNewItem : undefined}
                    onRemoveItem={onRemoveItem ? onRemoveItem : undefined}
                    type={type}
                    brewerType={brewerType ? brewerType : undefined}
                />
            )}
            {newItemDialogActive && (
                <NewItemDialog
                    item={newItemCopy!}
                    onClose={() => setNewItemDialogActive(false)}
                    type={type}
                    onSave={(item) => {
                        onNewItem?.(item);
                        setNewItemDialogActive(false);
                    }}
                />
            )}
            {toRemoveItem && (
                <ConfirmDialog
                    message={`Are you sure you want to remove ${toRemoveItem.name}?`}
                    onConfirm={() => {
                        try {
                            onRemoveItem?.(toRemoveItem);
                            setToRemoveItem(null);
                        }
                        catch (error) {
                            alert((error as Error).message);
                            setToRemoveItem(null);
                        }
                    }}
                    onCancel={() => setToRemoveItem(null)}
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
                <div className="flex items-center justify-start gap-2">
                    {visibleItems.length > 0 && (
                        visibleItems.map((item) => (
                            <SmallItemCard
                                key={item.id}
                                item={item}
                                type={type}
                                isSelected={selectedItem?.id === item.id}
                                onItemSelected={onItemSelected ? onItemSelected : (onSelectDetails ? (item) => setDetailsItem(item) : undefined)}
                                onDetails={(item) => setDetailsItem(item)}
                                itemRef={selectedItem?.id === item.id ? selectedItemRef : null}
                            />
                        ))
                    )}
                    <button className="sm"
                        onClick={() => setSelectDialogActive(true)}>
                        More ...
                    </button>
                </div>
            </div>

        </div>
    );
};


export const NewBrewDialog = ({ brew, edit = false, brewerId, grinderId, bagId, recipeId, onSaveBrew, onCancel,
    onAddBag, onAddBrewer, onAddGrinder, onAddRecipe, bags, brewers, grinders, recipes, brews,
    onRemoveBag, onRemoveBrewer, onRemoveGrinder, onRemoveRecipe
}:
    {
        edit?: boolean;
        brew?: Brew;
        brewerId?: string;
        grinderId?: string;
        bagId?: string;
        recipeId?: string;
        onSaveBrew: (brew: Brew) => void;
        onCancel: () => void;
        onAddBag: (bag: Bag) => void;
        onAddBrewer: (brewer: Brewer) => void;
        onAddGrinder: (grinder: Grinder) => void;
        onAddRecipe: (recipe: Recipe) => void;
        bags: Bag[];
        brewers: Brewer[];
        grinders: Grinder[];
        recipes: Recipe[];
        brews: Brew[];
        onRemoveBag: (bag: Bag) => void;
        onRemoveBrewer: (brewer: Brewer) => void;
        onRemoveGrinder: (grinder: Grinder) => void;
        onRemoveRecipe: (recipe: Recipe) => void;
    }) => {
    const [name, setName] = useState(brew?.name || `Brew ${brews.length + 1}`);
    const [brewer, setBrewer] = useState(
        (
            brew?.brewerId && brewers.find((b) => b.id === brew.brewerId)) ||
        brewers.find((b) => b.id === brewerId
        ) ||
        null
    );
    const [grinder, setGrinder] = useState(
        (
            brew?.grinderId && grinders.find((g) => g.id === brew.grinderId)) ||
        grinders.find((g) => g.id === grinderId
        ) ||
        null
    );
    const [bag, setBag] = useState(
        (
            brew?.bagId && bags.find((b) => b.id === brew.bagId)) ||
        bags.find((b) => b.id === bagId
        ) ||
        null
    );
    const [recipe, setRecipe] = useState(
        (
            brew?.recipeId && recipes.find((r) => r.id === brew.recipeId)) ||
        recipes.find((r) => r.id === recipeId
        ) ||
        null
    );

    const [showErrors, setShowErrors] = useState(false);

    return (
        <div className="dialog">
            <div className="backdrop" onClick={onCancel}></div>
            <div className="details flex flex-col gap-2">
                <h2>{edit ? "Edit Brew" : "New Brew"}</h2>
                <div className="flex flex-col gap-1">

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. India on Aeropress"
                        className="w-full max-w-75 border rounded-sm border-fg3 text-fg1"
                    />
                    {brewer && recipe && brewer.type !== recipe.type && (
                        <div className="text-red-500 text-sm">Brewer type does not match recipe type.</div>
                    )}
                    <div>
                        {!bag && showErrors && <div className="text-sm text-red-500">No bag selected</div>}
                        <PickItemCarousel
                            selectedItem={bag}
                            onItemSelected={(item) => {
                                setBag(item as Bag);
                            }}
                            items={bags}
                            type="bag"
                            onNewItem={(item) => onAddBag(item as Bag)}
                            onRemoveItem={onRemoveBag ? (item) => onRemoveBag(item as Bag) : undefined}
                        />
                    </div>
                    <div>
                        {!grinder && showErrors && <div className="text-sm text-red-500">No grinder selected</div>}
                        <PickItemCarousel
                            selectedItem={grinder}
                            onItemSelected={(item) => {
                                setGrinder(item as Grinder);
                            }}
                            items={grinders}
                            type="grinder"
                            onNewItem={(item) => onAddGrinder(item as Grinder)}
                            onRemoveItem={onRemoveGrinder ? (item) => onRemoveGrinder(item as Grinder) : undefined}
                        />
                    </div>
                    <div>
                        {!brewer && showErrors && <div className="text-sm text-red-500">No brewer selected</div>}
                        <PickItemCarousel
                            selectedItem={brewer}
                            onItemSelected={(item) => {
                                setBrewer(item as Brewer);
                            }}
                            items={brewers}
                            type="brewer"
                            onNewItem={(item) => onAddBrewer(item as Brewer)}
                            onRemoveItem={onRemoveBrewer ? (item) => onRemoveBrewer(item as Brewer) : undefined}
                        />
                    </div>
                    <div>
                        {!recipe && showErrors && <div className="text-sm text-red-500">No recipe selected</div>}
                        <PickItemCarousel
                            items={recipes}
                            selectedItem={recipe}
                            onItemSelected={(item) => {
                                setRecipe(item as Recipe);
                            }}
                            type="recipe"
                            brewerType={brewer?.type}
                            onNewItem={(item) => onAddRecipe(item as Recipe)}
                            onRemoveItem={onRemoveRecipe ? (item) => onRemoveRecipe(item as Recipe) : undefined}
                        />
                    </div>
                </div>
                <button onClick={() => {
                    if (!brewer || !grinder || !bag || !recipe) {
                        setShowErrors(true);
                        return;
                    }
                    onSaveBrew({
                        ...brew || {},
                        id: crypto.randomUUID(),
                        name: name,
                        brewerId: brewer.id,
                        grinderId: grinder.id,
                        bagId: bag.id,
                        recipeId: recipe.id,
                        timestamp: new Date().toISOString(),
                        dialIns: brew?.dialIns || []
                    })
                }}>
                    Save Brew
                </button>
                <button className="absolute top-2 right-2 p-1 rounded-full bg-transparent" onClick={onCancel}><XActionIcon strokeColor="var(--color-fg1)" /></button>
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
    onDeleteBrew,
    onCopyBrew,
    onEditBrew,
    onAddBag,
    onAddGrinder,
    onAddRecipe,
    onAddBrewer,
    onBagOpened,
    onBagFinished,
    onSaveEvaluation,
    onSaveDialIn,
    onDeleteEvaluation,
    onDeleteDialIn
}:
    {
        brew: Brew;
        onClose: () => void;
        brewers: Brewer[];
        grinders: Grinder[];
        bags: Bag[];
        recipes: Recipe[];
        onDeleteBrew: (brew: Brew) => void;
        onCopyBrew: (brew: Brew) => void;
        onEditBrew: (brew: Brew) => void;
        onAddBag: (bag: Bag) => void;
        onAddBrewer: (brewer: Brewer) => void;
        onAddGrinder: (grinder: Grinder) => void;
        onAddRecipe: (recipe: Recipe) => void;
        onBagOpened: (bag: Bag) => void;
        onBagFinished: (bag: Bag) => void;
        onSaveEvaluation: (brew: Brew, evaluation: Omit<Evaluation, 'timestamp'>) => void;
        onSaveDialIn: (brew: Brew, dialIn: DialIn) => void;
        onDeleteEvaluation: (brew: Brew, evaluation: Evaluation) => void;
        onDeleteDialIn: () => void;
    }) => {
    const brewer: Brewer | undefined = brewers.find((b) => b.id === brew.brewerId);
    const grinder: Grinder | undefined = grinders.find((g) => g.id === brew.grinderId);
    const bag: Bag | undefined = bags.find((b) => b.id === brew.bagId);
    const recipe: Recipe | undefined = recipes.find((r) => r.id === brew.recipeId);
    //dialogs
    const [detailsItem, setDetailsItem] = useState<ItemType | null>(null);
    const [detailsItemType, setDetailsItemType] = useState<'brewer' | 'grinder' | 'bag' | 'recipe' | null>('recipe');
    const [newItemDialogActive, setNewItemDialogActive] = useState(false);
    const [newItemCopy, setNewItemCopy] = useState<ItemType | null>(null);
    const [showBagFinishedModal, setShowBagFinishedModal] = useState<boolean>(false);
    const [showNewEvaluationDialog, setShowNewEvaluationDialog] = useState<boolean>(false);
    const [showNewDialInDialog, setShowNewDialInDialog] = useState<boolean>(false);
    const [showConfirmDeleteEvaluationDialog, setShowConfirmDeleteEvaluationDialog] = useState<boolean>(false);
    const [showConfirmDeleteDialInDialog, setShowConfirmDeleteDialInDialog] = useState<boolean>(false);
    // gui
    const [showDialIns, setShowDialIns] = useState<boolean>(false);
    const [showOptionButtons, setShowOptionButtons] = useState<boolean>(false);
    if (!brewer || !grinder || !bag || !recipe) return;

    return (
        <div className="dialog">
            {detailsItem && detailsItemType && (
                <ItemDetailsDialog
                    item={detailsItem}
                    type={detailsItemType}
                    onClose={() => setDetailsItem(null)}
                    onCopyItem={
                        (item) => {
                            setNewItemCopy(item);
                            setNewItemDialogActive(true);
                        }
                    }
                />
            )}
            {newItemDialogActive && detailsItemType && (
                <NewItemDialog
                    item={newItemCopy!}
                    onClose={() => setNewItemDialogActive(false)}
                    type={detailsItemType}
                    onSave={(item) => {
                        if (detailsItemType === "brewer") {
                            onAddBrewer(item as Brewer);
                        } else if (detailsItemType === "grinder") {
                            onAddGrinder(item as Grinder);
                        } else if (detailsItemType === "bag") {
                            onAddBag(item as Bag);
                        } else if (detailsItemType === "recipe") {
                            onAddRecipe(item as Recipe);
                        }
                        setNewItemDialogActive(false);
                    }}
                />
            )}
            {showBagFinishedModal && (
                <ConfirmBagFinishedModal bag={bag} onCancel={() => setShowBagFinishedModal(false)} onConfirm={() => {
                    onBagFinished(bag);
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
                    onClose={() => setShowNewDialInDialog(false)}
                    onSaveDialIn={(dialIn) => {
                        console.log("Saving dial-in", dialIn);
                    }}
                />
            )}
            {showConfirmDeleteEvaluationDialog && (
                <ConfirmDeleteEvaluationModal
                    onConfirm={() => {
                        const lastDialIn = brew.dialIns[brew.dialIns.length - 1];
                        const lastEvaluation = lastDialIn?.evaluations[lastDialIn.evaluations.length - 1];
                        if (lastEvaluation) {
                            onDeleteEvaluation(brew, lastEvaluation);
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
                        onDeleteDialIn();
                        setShowConfirmDeleteDialInDialog(false);
                    }}
                    onCancel={() => setShowConfirmDeleteDialInDialog(false)}
                />
            )}
            <div className="backdrop" onClick={onClose}></div>
            <div className="details flex flex-col gap-1">
                <div className="flex flex-col">
                    <div className="absolute top-1 right-1 gap-2 flex items-start justify-end">
                        {showOptionButtons &&
                            <div className="flex gap-1">
                                <button className="bg-transparent rounded-full p-1" onClick={() => onDeleteBrew(brew)}>
                                    <DeleteActionIcon strokeColor='var(--color-fg1)' fillColor="var(--color-bg1)" /></button>

                                <button className="bg-transparent rounded-full p-1" onClick={() => onCopyBrew(brew)}>
                                    <CopyActionIcon strokeColor='var(--color-fg1)' fillColor="var(--color-bg1)" /></button>
                                <button className="bg-transparent rounded-full p-1" onClick={() => onEditBrew(brew)}>
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
                <div className="flex justify-start items-center gap-1">
                    <SmallItemCard
                        item={brewer}
                        type="brewer"
                        onDetails={(item) => {
                            setDetailsItem(item);
                            setDetailsItemType("brewer");
                        }}
                        onItemSelected={(item) => {
                            setDetailsItem(item);
                            setDetailsItemType("brewer");
                        }}
                    />
                    <SmallItemCard
                        item={grinder}
                        type="grinder"
                        onDetails={(item) => {
                            setDetailsItem(item);
                            setDetailsItemType("grinder");
                        }}
                        onItemSelected={(item) => {
                            setDetailsItem(item);
                            setDetailsItemType("grinder");
                        }}
                    />
                    <SmallItemCard
                        item={bag}
                        type="bag"
                        onDetails={(item) => {
                            setDetailsItem(item);
                            setDetailsItemType("bag");
                        }}
                        onItemSelected={(item) => {
                            setDetailsItem(item);
                            setDetailsItemType("bag");
                        }}
                    />
                    {/* <SmallItemCard
                        item={recipe}
                        type="recipe"
                        onDetails={(item) => {
                            setDetailsItem(item);
                            setDetailsItemType("recipe");
                            }}
                            onItemSelected={(item) => {
                                setDetailsItem(item);
                                setDetailsItemType("recipe");
                                }}
                    /> */}
                </div>
                {brew.dialIns.length > 0 &&
                    <>
                        {showDialIns ? (
                            <>
                                <button className="sm my-1" onClick={() => setShowDialIns(false)}>Hide Dial-Ins</button>
                                {brew.dialIns.map((dialIn, index) => (
                                    <>
                                        <div key={index} className="">
                                            <DialInCard
                                                dialIn={dialIn}
                                                recipe={recipe}
                                                grinder={grinder}
                                            />
                                            {index === brew.dialIns.length - 1 && dialIn.evaluations.length === 0 &&
                                                <button className="xs" onClick={() => setShowConfirmDeleteDialInDialog(true)}
                                                >Delete Dial-In</button>
                                            }
                                        </div>
                                        {dialIn.evaluations.length > 0 &&
                                            <div className="pl-2">
                                                {dialIn.evaluations.map((evaluation, evalIndex) => (
                                                    <div key={`eval-${evalIndex}`} className="mb-1">
                                                        <EvaluationCard
                                                            evaluation={evaluation}
                                                            showNotes={true}
                                                        />
                                                        {index === brew.dialIns.length - 1 && evalIndex === dialIn.evaluations.length - 1 &&
                                                            <button className="xs"
                                                                onClick={() => setShowConfirmDeleteEvaluationDialog(true)}
                                                            >Delete Evaluation</button>
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                    </>
                                ))}
                            </>
                        ) : (
                            <div className="mt-2 relative cursor-pointer"
                                onClick={() => setShowDialIns(!showDialIns)}>
                                <DialInCard
                                    dialIn={brew.dialIns[brew.dialIns.length - 1]}
                                    recipe={recipe}
                                    grinder={grinder}
                                />
                                {brew.dialIns.length > 0 && brew.dialIns[brew.dialIns.length - 1].evaluations.length > 0 &&
                                    <div className="pt-1 pl-2">
                                        <EvaluationCard
                                            evaluation={brew.dialIns[brew.dialIns.length - 1].evaluations[brew.dialIns[brew.dialIns.length - 1].evaluations.length - 1]}
                                        />
                                    </div>

                                }
                            </div>
                        )}
                    </>
                }
                <div className="flex items-end justify-end gap-1">
                    {!bag.isBase && bag.dateOpened && !bag.isFinished && <button className="sm" onClick={() => setShowBagFinishedModal(true)}>Finish Bag</button>}
                    {!bag.isBase && !bag.dateOpened && <button className="sm" onClick={() => onBagOpened(bag)}>Open Bag</button>}
                    <button className="sm" onClick={() => setShowNewEvaluationDialog(true)}>Evaluate</button>
                    <button className="sm" onClick={() => setShowNewDialInDialog(true)}>Dial In</button>
                </div>

            </div>
        </div>
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
                    <>
                        <div className="text-xs">Last:</div>
                        <EvaluationCard
                            evaluation={lastEvaluation}
                            showNotes={true}
                        />
                    </>
                }
                {lastEvaluation && <div className="text-xs">New:</div>}
                <div className="flex flex-col items-center">
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
                        <textarea
                            className="w-full border rounded-sm border-fg3 text-fg1 p-1 text-sm"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
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

export const NewDialInDialog = ({ brew, recipe, grinder, onSaveDialIn, onClose }:
    {
        brew: Brew;
        recipe: Recipe;
        grinder: Grinder;
        onSaveDialIn: (dialIn: DialIn) => void;
        onClose: () => void;
    }) => {


    const lastDialIn = brew.dialIns.length > 0 ? brew.dialIns[brew.dialIns.length - 1] : null;
    const lastEvaluation = lastDialIn && lastDialIn.evaluations.length > 0 ? lastDialIn.evaluations[lastDialIn.evaluations.length - 1] : null;
    const evaluationAvailable = lastDialIn && lastDialIn.evaluations.length > 1 ? true : false;
    const [showEvaluations, setShowEvaluations] = useState<boolean>(false)
    const [showSuggestRequests, setShowSuggestRequests] = useState<boolean>(false);

    const [doseDelta, setDoseDelta] = useState<number>(lastDialIn ? lastDialIn.doseDelta : 0);
    const [tempDelta, setTempDelta] = useState<number>(lastDialIn ? lastDialIn.tempDelta : 0);
    const [grinderDelta, setGrinderDelta] = useState<number>(lastDialIn ? lastDialIn.grinderDelta : 0);

    const handleSuggest = (request: DialInRequest) => {
        const suggestedDialIn = suggestDialIn({ brew, recipe, grinder, request });
        setDoseDelta(suggestedDialIn.doseDelta);
        setTempDelta(suggestedDialIn.tempDelta);
        setGrinderDelta(suggestedDialIn.grinderDelta);
    }

    return (
        <div className="dialog">
            <div className="backdrop"></div>
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
                        {lastEvaluation && (
                            showEvaluations && evaluationAvailable ? (
                                <div>
                                    {lastDialIn.evaluations.map((evaluation, index) => (
                                        <div key={index} className="mb-1">
                                            <EvaluationCard evaluation={evaluation} showNotes={true} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EvaluationCard evaluation={lastEvaluation} showNotes={true} />
                            )
                        )}
                    </div>
                }
                <div>
                    <button onClick={() => setShowSuggestRequests(!showSuggestRequests)}>Suggest</button>
                    {showSuggestRequests &&
                        <div className="flex gap-1">
                            <div className="flex flex-col">
                                <SweetIcon />
                                <button onClick={() => handleSuggest('More Sweet')} className="xs"><UpActionIcon /></button>
                                <button onClick={() => handleSuggest('Less Sweet')} className="xs inverse"><DownActionIcon /></button>
                            </div>
                            <div className="flex flex-col">
                                <AcidityIcon />
                                <button onClick={() => handleSuggest('More Acidic')} className="xs"><UpActionIcon /></button>
                                <button onClick={() => handleSuggest('Less Acidic')} className="xs inverse"><DownActionIcon /></button>
                            </div>
                            <div className="flex flex-col">
                                <BitterIcon />
                                <button onClick={() => handleSuggest('More Bitter')} className="xs"><UpActionIcon /></button>
                                <button onClick={() => handleSuggest('Less Bitter')} className="xs inverse"><DownActionIcon /></button>
                            </div>
                            <div className="flex flex-col">
                                <BodyIcon />
                                <button onClick={() => handleSuggest('More Body')} className="xs"><UpActionIcon /></button>
                                <button onClick={() => handleSuggest('Less Body')} className="xs inverse"><DownActionIcon /></button>
                            </div>
                            <div className="flex flex-col">
                                <StrengthIcon />
                                <button onClick={() => handleSuggest('More Strength')} className="xs"><UpActionIcon /></button>
                                <button onClick={() => handleSuggest('Less Strength')} className="xs inverse"><DownActionIcon /></button>
                            </div>
                        </div>
                    }
                </div>
                <div>
                    <div className="flex"><WeightIcon /> {doseDelta}</div>
                    <div className="flex"><TemperatureIcon /> {tempDelta}</div>
                    <div className="flex"><GrindIcon /> {grinderDelta}</div>
                </div>
                <button className="" onClick={() => onSaveDialIn({ /* fill in dial-in details here */ })}>Save Dial-In</button>
                <button className='bg-transparent absolute top-2 right-2 p-1 rounded-full' onClick={onClose}><XActionIcon strokeColor='var(--color-fg3)' /></button>
            </div>
        </div>
    )
}