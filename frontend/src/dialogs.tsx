import { useEffect, useState, useRef } from 'react';
import type { Brew, Brewer, Recipe, Grinder, Bag, ItemType } from './types';
import { useDialBean } from './DialBeanContext';
import { SmallItemCard, DialInCard } from './Cards';
import { brewer_icons, grinder_icons, bag_icons } from "./icons";


export const ItemDetailsDialog = ({ item, type, onClose }: { item: ItemType; type: 'brewer' | 'grinder' | 'bag' | 'recipe'; onClose: () => void }) => {
    const Icon = type === "brewer" ? ((item as Brewer).iconId ? brewer_icons[(item as Brewer).iconId!]?.icon : brewer_icons["1"].icon) :
        type === "grinder" ? ((item as Grinder).iconId ? grinder_icons[(item as Grinder).iconId!]?.icon : grinder_icons["1"].icon) :
            type === "bag" ? ((item as Bag).iconId ? bag_icons[(item as Bag).iconId!]?.icon : bag_icons["1"].icon) : undefined;
    return (
        type === "recipe" ? (
            <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
                <div className="bg-gray-200 rounded-xl shadow-xl z-60 p-4 rounded shadow-md min-w-64 relative z-1 max-h-[90dvh] overflow-y-auto shadow-md w-96">
                    <div>{type.charAt(0).toUpperCase() + type.slice(1)} Details:</div>
                    <div>Name: {item.name}</div>
                    <div>Method: {(item as Recipe).method}</div>
                    <div>Instructions: {(item as Recipe).instructions}</div>
                    <button
                        className="absolute top-2 right-2"
                        onClick={onClose}>Close Details</button>
                </div>
            </div>
        ) : (

            <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
                <div className="bg-gray-200 rounded-lg z-60 p-4 rounded shadow-md relative z-1 max-h-[90dvh] overflow-y-auto shadow-md w-40 h-60">
                    <div className="flex items-center justify-center w-full mt-6">
                        {Icon && <Icon style={{ width: "40px", height: "40px", minWidth: "40px", minHeight: "40px" }} />}
                    </div>
                    {type === "brewer" &&
                        <>
                            <div>{item.name}</div>
                            <div>{(item as Brewer).method}</div>
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
                        className="absolute top-2 right-2"
                        onClick={onClose}>Close Details</button>
                </div>
            </div>

        )
    );
}

export const PickItemDialog = ({ onItemSelected, onCancel, type }: { onItemSelected: (item: ItemType) => void; onCancel: () => void, type: 'brewer' | 'grinder' | 'bag' | 'recipe'; }) => {
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
            ((type === "brewer" || type === "recipe") && (item as Brewer).method.toLowerCase().includes(part)) ||
            (type === "recipe" && (item as Recipe).instructions.toLowerCase().includes(part))
        ) ||
        filter === '');
    const [detailsItem, setDetailsItem] = useState<ItemType | null>(null);
    return (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-gray-200 opacity-50"></div>
            <div className="bg-white z-60 p-4 rounded shadow-md min-w-64 relative z-1">
                {detailsItem && (
                    <ItemDetailsDialog
                        item={detailsItem}
                        type={type}
                        onClose={() => setDetailsItem(null)}
                    />
                )}
                <div>{type.charAt(0).toUpperCase() + type.slice(1)} Gallery:</div>
                <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter items..." />
                <button onClick={() => setFilter('')}>Clear Filter</button>
                <div className="overflow-y-auto h-96 min-h-96 max-h-96 w-84 min-w-72">
                    <div className="flex flex-wrap gap-2">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <SmallItemCard
                                    key={item.id}
                                    item={item}
                                    type={type}
                                    isSelected={false}
                                    onItemSelected={onItemSelected}
                                    onDetails={(item) => setDetailsItem(item)}
                                    itemRef={null}
                                />
                            ))
                        ) : (
                            <div>No items available.</div>
                        )}
                    </div>
                </div>
                <button
                    className="absolute top-2 right-2"
                    onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}


export const PickItemCarousel = ({ selectedItem, onItemSelected, type }: { selectedItem: ItemType | null; onItemSelected: (item: ItemType) => void; type: 'brewer' | 'grinder' | 'bag' | 'recipe'; }) => {
    const { data } = useDialBean();
    let items: ItemType[];
    // let visibleItems: ItemType[];
    if (type === 'brewer') {
        items = data.brewers;
    } else if (type === 'grinder') {
        items = data.grinders;
    } else if (type === 'bag') {
        items = data.bags;
    } else if (type === 'recipe') {
        items = data.recipes;
    } else {
        throw new Error(`Invalid type: ${type}`);
    }
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

    useEffect(() => {
        if (!selectedItem) {
            if (visibleItems.length > 0) {
                onItemSelected(visibleItems[0]);
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
        <div className="relative">
            {detailsItem && (
                <ItemDetailsDialog
                    item={detailsItem}
                    type={type}
                    onClose={() => setDetailsItem(null)}
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
            <div className="overflow-x-auto no-scrollbar"
                ref={containerRef}>
                <div className="flex items-center justify-start gap-2">
                    {visibleItems.length > 0 && (
                        visibleItems.map((item) => (
                            <SmallItemCard
                                key={item.id}
                                item={item}
                                type={type}
                                isSelected={selectedItem?.id === item.id}
                                onItemSelected={onItemSelected}
                                onDetails={(item) => setDetailsItem(item)}
                                itemRef={selectedItem?.id === item.id ? selectedItemRef : null}
                            />
                        ))
                    )}
                    <div className="px-4 py-1 bg-gray-100 border rounded-md"
                        onClick={() => setSelectDialogActive(true)}>
                        Gallery...
                    </div>
                    {selectDialogActive && (
                        <PickItemDialog
                            onItemSelected={(item) => {
                                onItemSelected(item);
                                setSelectDialogActive(false);
                            }}
                            onCancel={() => setSelectDialogActive(false)}
                            type={type}
                        />
                    )}
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


export const NewBrewDialog = ({ brew, brewerId, grinderId, bagId, recipeId, onSaveBrew, onCancel }: { brew?: Brew; brewerId?: string; grinderId?: string; bagId?: string; recipeId?: string; onSaveBrew: (brew: Brew) => void; onCancel: () => void }) => {
    const { data } = useDialBean();
    const [name, setName] = useState(brew?.name || `Brew ${data.brews.length + 1}`);
    const [brewer, setBrewer] = useState(
        (
            brew?.brewerId && data.brewers.find((b) => b.id === brew.brewerId)) ||
        data.brewers.find((b) => b.id === brewerId
        ) ||
        null
    );
    const [grinder, setGrinder] = useState(
        (
            brew?.grinderId && data.grinders.find((g) => g.id === brew.grinderId)) ||
        data.grinders.find((g) => g.id === grinderId
        ) ||
        null
    );
    const [bag, setBag] = useState(
        (
            brew?.bagId && data.bags.find((b) => b.id === brew.bagId)) ||
        data.bags.find((b) => b.id === bagId
        ) ||
        null
    );
    const [recipe, setRecipe] = useState(
        (
            brew?.recipeId && data.recipes.find((r) => r.id === brew.recipeId)) ||
        data.recipes.find((r) => r.id === recipeId
        ) ||
        null
    );


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
                        type="brewer"
                    />
                </div>
                <div>{grinder ? "Grinder" : 'Grinder not selected'}
                    <PickItemCarousel
                        selectedItem={grinder}
                        onItemSelected={(item) => {
                            setGrinder(item as Grinder);
                        }}
                        type="grinder"
                    />
                </div>
                <div>{bag ? "Bag" : 'Bag not selected'}
                    <PickItemCarousel
                        selectedItem={bag}
                        onItemSelected={(item) => {
                            setBag(item as Bag);
                        }}
                        type="bag"
                    />
                </div>
                <div>{recipe ? "Recipe" : 'Recipe not selected'}
                    <PickItemCarousel
                        selectedItem={recipe}
                        onItemSelected={(item) => {
                            setRecipe(item as Recipe);
                        }}
                        type="recipe"
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

export const BrewDetailsDialog = ({ brew, onClose }: { brew: Brew; onClose: () => void }) => {
    const { data } = useDialBean();
    const brewer: Brewer | undefined = data.brewers.find((b) => b.id === brew.brewerId);
    const grinder: Grinder | undefined = data.grinders.find((g) => g.id === brew.grinderId);
    const bag: Bag | undefined = data.bags.find((b) => b.id === brew.bagId);
    const recipe: Recipe | undefined = data.recipes.find((r) => r.id === brew.recipeId);
    const [detailsItem, setDetailsItem] = useState<ItemType | null>(null);
    const [detailsItemType, setDetailsItemType] = useState<'brewer' | 'grinder' | 'bag' | 'recipe' | null>('recipe');
    if (!brewer) return;
    if (!grinder) return;
    if (!bag) return;
    if (!recipe) return;

    return (
        <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center z-10">
            {detailsItem && (
                <ItemDetailsDialog
                    item={detailsItem}
                    type={detailsItemType}
                    onClose={() => setDetailsItem(null)}
                />
            )}
            <div className="fixed inset-0 h-dvh w-screen overflow-hidden bg-amber-200 opacity-50 z-10"></div>
            <div className="bg-white p-4 rounded max-h-[90dvh] overflow-y-auto shadow-md w-96 max-w-96 relative z-11">
                <button className="absolute top-2 right-2" onClick={onClose}>Close</button>
                <div>Brew Details: {brew.name}</div>
                <div className="flex justify-start items-center gap-1">
                    <SmallItemCard
                        item={brewer}
                        type="brewer"
                        onDetails={(item) => {
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
                    />
                    <SmallItemCard
                        item={bag}
                        type="bag"
                        onDetails={(item) => {
                            setDetailsItem(item);
                            setDetailsItemType("bag");
                        }}
                    />
                    <SmallItemCard
                        item={recipe}
                        type="recipe"
                        onDetails={(item) => {
                            setDetailsItem(item);
                            setDetailsItemType("recipe");
                        }}
                    />
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
            </div>
        </div>
    );
}
