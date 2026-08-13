import { useEffect, useState, useRef } from 'react';
import type { Brew, Brewer, Recipe, Grinder, Bag, ItemType, MachineType } from './types';
import { useDialBean } from './DialBeanContext';
import { SmallItemCard, DialInCard } from './Cards';
import { brewer_icons, grinder_icons, bag_icons, XIcon } from "./icons";
import { MdClose } from "react-icons/md";
import { formatLastUsed } from './formating';

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

export const ItemLibraryDialog = ({ onItemSelected, onClose, onNewItem, onRemoveItem, type, onSelectedDetails = false }:
    {
        onItemSelected?: (item: ItemType) => void | null;
        onClose: () => void;
        onNewItem?: ((item: ItemType) => void) | null;
        onRemoveItem?: ((item: ItemType) => void) | null;
        type: 'brewer' | 'grinder' | 'bag' | 'recipe';
        onSelectedDetails?: boolean;
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
    const filterParts = filter.split(" ").map((part) => part.trim().toLowerCase()).filter((part) => part.length > 0);
    const filteredItems = items.filter((item) =>
        filterParts.every((part) => item.name.toLowerCase().includes(part) ||
            ((type === "brewer" || type === "recipe") && (item as Brewer).type.toLowerCase().includes(part)) ||
            (type === "recipe" && (item as Recipe).instructions.toLowerCase().includes(part))
        ) ||
        filter === '');
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
                <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter items..." />
                <button onClick={() => setFilter('')}>Clear Filter</button>
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
        selectedItem = null,
        onItemSelected = null,
        onSelectDetails = false,
        onNewItem = null,
        onRemoveItem = null
    }: {
        items: ItemType[];
        type: 'brewer' | 'grinder' | 'bag' | 'recipe';
        selectedItem?: ItemType | null;
        onItemSelected?: ((item: ItemType) => void) | null;
        onSelectDetails?: boolean;
        onNewItem?: ((item: ItemType) => void) | null;
        onRemoveItem?: ((item: ItemType) => void) | null;
    }) => {
    const activeUsedItems = items.filter((item) => item.active && !item.isBase);
    const inactiveUserItems = items.filter((item) => !item.active && !item.isBase);
    const activeBaseItems = items.filter((item) => item.isBase && item.active);
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
        if (!selectedItem) {
            if (visibleItems.length > 0) {
                onItemSelected?.(visibleItems[0]);
            }
        }
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
            {canScrollLeft && (
                <button
                    onClick={() => handleScroll(-200)}
                    className="absolute top-0 left-0 h-full p-1 rounded-sm bg-gray-100 shadow-[4px_0_8px_-4px_#0005] 
                    z-10 opacity-50 hover:opacity-100 transition-opacity"
                    aria-label="Scroll Left"
                >
                    ◀
                </button>
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
                    <div className="px-4 py-1 bg-gray-100 border rounded-md"
                        onClick={() => setSelectDialogActive(true)}>
                        Library...
                    </div>
                </div>
            </div>
            {canScrollRight && (
                <button
                    onClick={() => handleScroll(200)}
                    className="absolute top-0 right-0 h-full p-1 rounded-sm bg-gray-100 shadow-[-4px_0_8px_-4px_#0005] z-10 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center"
                    aria-label="Scroll Right"
                >
                    ▶
                </button>
            )}
        </div>
    );
};


export const NewBrewDialog = ({ brew, brewerId, grinderId, bagId, recipeId, onSaveBrew, onCancel,
    onAddBag, onAddBrewer, onAddGrinder, onAddRecipe, bags, brewers, grinders, recipes, brews,
    onRemoveBag, onRemoveBrewer, onRemoveGrinder, onRemoveRecipe
}:
    {
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

    console.log(onRemoveBrewer);


    return (
        <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center z-10">
            <div className="fixed inset-0 h-dvh w-screen overflow-hidden bg-amber-200 opacity-50 z-10"></div>
            <div className="bg-white p-4 rounded max-h-[90dvh] overflow-y-auto shadow-md w-96 max-w-96 relative z-11">
                <div>New Brew</div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Brew Name" />
                <button onClick={() => setName("")}>Default Name</button>
                <div>{brewer ? "Brewer" : 'Brewer not selected'}
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
                <div>{grinder ? "Grinder" : 'Grinder not selected'}
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
                <div>{bag ? "Bag" : 'Bag not selected'}
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
                <div>{recipe ? "Recipe" : 'Recipe not selected'}
                    <PickItemCarousel
                        items={recipes}
                        selectedItem={recipe}
                        onItemSelected={(item) => {
                            setRecipe(item as Recipe);
                        }}
                        type="recipe"
                        onNewItem={(item) => onAddRecipe(item as Recipe)}
                        onRemoveItem={onRemoveRecipe ? (item) => onRemoveRecipe(item as Recipe) : undefined}
                    />
                </div>
                <button onClick={() => {
                    if (!brewer || !grinder || !bag || !recipe) {
                        alert("Please select a brewer, grinder, bag, and recipe before saving.");
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
                }}
                    disabled={!brewer || !grinder || !bag || !recipe}
                >Save Brew</button>
                <button className="absolute top-2 right-2" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export const BrewDetailsDialog = ({ brew, onClose, brewers, grinders, bags, recipes, onAddBag, onAddGrinder, onAddRecipe, onAddBrewer,
}:
    {
        brew: Brew;
        onClose: () => void;
        brewers: Brewer[];
        grinders: Grinder[];
        bags: Bag[];
        recipes: Recipe[];
        onAddBag: (bag: Bag) => void;
        onAddBrewer: (brewer: Brewer) => void;
        onAddGrinder: (grinder: Grinder) => void;
        onAddRecipe: (recipe: Recipe) => void;
    }) => {
    const brewer: Brewer | undefined = brewers.find((b) => b.id === brew.brewerId);
    const grinder: Grinder | undefined = grinders.find((g) => g.id === brew.grinderId);
    const bag: Bag | undefined = bags.find((b) => b.id === brew.bagId);
    const recipe: Recipe | undefined = recipes.find((r) => r.id === brew.recipeId);
    const [detailsItem, setDetailsItem] = useState<ItemType | null>(null);
    const [detailsItemType, setDetailsItemType] = useState<'brewer' | 'grinder' | 'bag' | 'recipe' | null>('recipe');
    const [newItemDialogActive, setNewItemDialogActive] = useState(false);
    const [newItemCopy, setNewItemCopy] = useState<ItemType | null>(null);

    if (!brewer || !grinder || !bag || !recipe) return;

    return (
        <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center z-10">
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
            <div className="fixed inset-0 overflow-hidden backdrop-blur-xs z-10" onClick={onClose}></div>
            <div className="bg-bg2 border border-bg4 p-4 rounded-xl max-h-[90dvh] overflow-y-auto shadow-2xl/40 min-w-50 min-h-50 max-w-[90dvw] relative z-11 flex flex-col gap-1">
                <div className="flex flex-col">
                    <button className="bg-transparent absolute top-1 right-1 rounded-full p-1" onClick={onClose}><XIcon /></button>
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
                <div className="pt-2">
                    {brew.dialIns.length > 0 &&
                        <DialInCard
                            dialIn={brew.dialIns[brew.dialIns.length - 1]}
                            recipe={recipe}
                            grinder={grinder}
                        />
                    }
                </div>
                <button>Dial In</button>
                <button>evaluate</button>
                <button>remove</button>
                <button>copy</button>
                <button>edit?</button>
            </div>
        </div>
    );
}
