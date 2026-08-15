import { useEffect, useState, useRef, Fragment, useMemo } from 'react';
import type { Brew, Brewer, Recipe, Grinder, Bag, ItemType, MachineType, DialIn, Evaluation, BrewerType, DialInRequest, DialInSuggestion } from './types';
import { useDialBean } from './DialBeanContext';
import { SmallItemCard, DialInCard, EvaluationCard, SingleRatingCard, EvaluationAverageCard, MediumRecipeCard } from './cards';
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
    MinusActionIcon,
    PlusActionIcon,
} from "./action_icons";

import { MdClose, MdVisibility } from "react-icons/md";
import { formatLastUsed } from './formating';
import { BrewRatingInfo, ConfirmBagFinishedModal, ConfirmCloseEvaluation, ConfirmCopyBrewModal, ConfirmDeleteBrewModal, ConfirmDeleteDialInModal, ConfirmDeleteEvaluationModal, ConfirmEditBrewModal } from './modals';
import { getGrind, getGrindPrecision, suggestDialIn, suggestRequest } from './brain';

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

export const ItemDetailsDialog = ({ item, type, onClose, onCopyItem, onRemoveItem, onEditItem }:
    {
        item: ItemType;
        type: 'brewer' | 'grinder' | 'bag' | 'recipe';
        onClose: () => void;
        onCopyItem?: ((item: ItemType) => void) | null;
        onRemoveItem?: ((item: ItemType) => void) | null;
        onEditItem?: ((item: ItemType) => void) | null;
    }) => {
    const Icon = type === "brewer" ? ((item as Brewer).iconId ? brewer_icons[(item as Brewer).iconId!]?.icon : brewer_icons["1"].icon) :
        type === "grinder" ? ((item as Grinder).iconId ? grinder_icons[(item as Grinder).iconId!]?.icon : grinder_icons["1"].icon) :
            type === "bag" ? ((item as Bag).iconId ? bag_icons[(item as Bag).iconId!]?.icon : bag_icons["1"].icon) : undefined;

    const [showOptionButtons, setShowOptionButtons] = useState(false);

    return (
        type === "recipe" ? (
            <div className="dialog">
                <div className="backdrop" onClick={onClose}></div>
                <div className="recipe">
                    <div className="absolute top-2 right-2 flex gap-2">
                        {(onRemoveItem || onCopyItem || onEditItem) &&
                            (
                                showOptionButtons ?
                                    (<div className="flex gap-2">
                                        {onRemoveItem && <button onClick={() => onRemoveItem(item)}
                                            className="p-1 bg-transparent rounded-full" >
                                            <DeleteActionIcon strokeColor="var(--color-fg1)" fillColor="white" />
                                        </button>}
                                        {onCopyItem && <button onClick={() => onCopyItem(item)}
                                            className="p-1 bg-transparent rounded-full" >
                                            <CopyActionIcon strokeColor="var(--color-fg1)" fillColor="white" />
                                        </button>}
                                        {onEditItem && <button onClick={() => onEditItem(item)}
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
                    <div>Name: {item.name}</div>
                    <div>Method: {(item as Recipe).type}</div>
                    <div>Instructions: {(item as Recipe).instructions}</div>
                    <div className="flex gap-1">
                        {onRemoveItem && <button className="border px-2 py-1 rounded-md hover:bg-yellow-300" onClick={() => onRemoveItem(item)}>Remove</button>}
                    </div>
                </div>
            </div >
        ) : (

            <div className="dialog">
                <div className="backdrop"></div>
                <div className="item">
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
                <div className="flex items-center justify-start gap-2 min-h-15">
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
    onDeleteLastEvaluation,
    onDeleteLastDialIn
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
        onDeleteLastEvaluation: (brew: Brew) => void;
        onDeleteLastDialIn: (brew: Brew) => void;
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
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
    const [showConfirmCopyModal, setShowConfirmCopyModal] = useState<boolean>(false);
    const [showConfirmEditModal, setShowConfirmEditModal] = useState<boolean>(false);

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
                    bag={bag}
                    onClose={() => setShowNewDialInDialog(false)}
                    onSaveDialIn={(dialIn) => {
                        console.log("Saving dial-in", dialIn);
                    }}
                />
            )}
            {showConfirmDeleteModal && (
                <ConfirmDeleteBrewModal
                    brew={brew}
                    onCancel={() => setShowConfirmDeleteModal(false)}
                    onConfirm={() => {
                        onDeleteBrew(brew);
                        setShowConfirmDeleteModal(false);
                    }}
                />
            )}
            {showConfirmEditModal && (
                <ConfirmEditBrewModal
                    brew={brew}
                    onCancel={() => setShowConfirmEditModal(false)}
                    onConfirm={() => {
                        onEditBrew(brew);
                        setShowConfirmEditModal(false);
                    }}
                />
            )}
            {showConfirmCopyModal && (
                <ConfirmCopyBrewModal
                    brew={brew}
                    onCancel={() => setShowConfirmCopyModal(false)}
                    onConfirm={() => {
                        onCopyBrew(brew);
                        setShowConfirmCopyModal(false);
                    }}
                />
            )}

            <div className="backdrop" onClick={onClose}></div>
            <div className="details flex flex-col gap-2">
                <div className="flex flex-col">
                    <div className="absolute top-2 right-2 gap-2 flex items-start justify-end">
                        {showOptionButtons &&
                            <div className="flex gap-2">
                                <button className="bg-transparent rounded-full p-1" onClick={() => setShowConfirmDeleteModal(true)}>
                                    <DeleteActionIcon strokeColor='var(--color-fg1)' fillColor="var(--color-bg1)" /></button>
                                <button className="bg-transparent rounded-full p-1" onClick={() => setShowConfirmCopyModal(true)}>
                                    <CopyActionIcon strokeColor='var(--color-fg1)' fillColor="var(--color-bg1)" /></button>
                                <button className="bg-transparent rounded-full p-1" onClick={() => setShowConfirmEditModal(true)}>
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
                <div className="flex justify-center">
                    <MediumRecipeCard
                        recipe={recipe}
                        onItemSelected={() => {
                            setDetailsItem(recipe);
                            setDetailsItemType("recipe");
                        }}
                        onDetails={() => {
                            setDetailsItem(recipe);
                            setDetailsItemType("recipe");
                        }}
                    />
                </div>
                {brew.dialIns.length > 0 &&
                    <div className="flex justify-center">
                        {showDialIns ? (
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
                        ) : (
                            <div className="mt-2 relative cursor-pointer"
                                onClick={() => setShowDialIns(!showDialIns)}>
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
                        )}
                    </div>
                }
                <div className="flex items-end gap-1">
                    {!bag.isBase && bag.dateOpened && !bag.isFinished && <button className="sm flex-1" onClick={() => setShowBagFinishedModal(true)}>Finish Bag</button>}
                    {!bag.isBase && !bag.dateOpened && <button className="sm flex-1" onClick={() => onBagOpened(bag)}>Open Bag</button>}
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

export const NewDialInDialog = ({ brew, recipe, grinder, bag, onSaveDialIn, onClose }:
    {
        brew: Brew;
        recipe: Recipe;
        grinder: Grinder;
        bag: Bag;
        onSaveDialIn: (dialIn: DialIn) => void;
        onClose: () => void;
    }) => {

    console.log(brew, recipe, grinder, bag);

    const requestSuggestion = useMemo(() => suggestRequest(brew, recipe, grinder, bag), [brew, recipe, grinder, bag]);
    const suggestedDialIn = useMemo(() => {
        if (requestSuggestion.request) {
            return suggestDialIn({ brew, recipe, grinder, bag, request: requestSuggestion.request });
        }
        return null;
    }, [brew, recipe, grinder, requestSuggestion.request]);

    const lastDialIn = brew.dialIns.length > 0 ? brew.dialIns[brew.dialIns.length - 1] : null;
    const evaluationAvailable = lastDialIn && lastDialIn.evaluations.length > 1 ? true : false;
    const [showEvaluations, setShowEvaluations] = useState<boolean>(false)
    const [optimizationUsed, setOptimizationUsed] = useState<boolean>(true);

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
        // 
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
    }

    const requestMatchesSuggestion = request === requestSuggestion.request;

    const baseOptimizationStyle = "xs p-2";
    const upOpStyle = baseOptimizationStyle + " inverse";
    const activeUpOpStyle = baseOptimizationStyle + " ";
    const downOpStyle = baseOptimizationStyle + " inverse";
    const activeDownOpStyle = baseOptimizationStyle + " ";

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
                            {requestSuggestion.comment}
                            {" => "}
                            {requestSuggestion.request ? requestSuggestion.request : "No Suggestion"}
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
                    <button className={"sm self-end mt-2" + (optimizationUsed ? " opacity-50" : "")}
                        onClick={handleOptimize}>
                        {request ? ((optimizationUsed ? "Optimized: " : "Optimize: ") + request) : "Select to Optimize"}
                    </button>
                </div>
                <div className="grid grid-cols-[auto_auto_auto_auto_auto] gap-2 place-items-center">
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
                        {(recipe.doseGrams).toFixed(1)}g
                    </div>
                    <div className={"row-4 col-3" +
                        (lastDialIn?.doseDelta !== 0 ? " line-through" : "")}
                    >
                        {
                            lastDialIn?.doseDelta !== 0 ?
                                (recipe.doseGrams + (lastDialIn?.doseDelta ?? 0)).toFixed(1) + "g"
                                :
                                "-"
                        }
                    </div>
                    <div className="row-4 col-4">
                        {doseDelta !== 0 ? (recipe.doseGrams + doseDelta).toFixed(1) + "g" : "-"}
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
                <button className='bg-transparent absolute top-2 right-2 p-1 rounded-full' onClick={onClose}><XActionIcon strokeColor='var(--color-fg3)' /></button>
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