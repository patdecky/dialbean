import { useDialBean } from "./DialBeanContext.tsx"
import { PickItemCarousel } from "./components.tsx"
import { DialBeanLargeIcon } from "./icons.tsx";
import type { Brewer, Grinder, Bag } from "./types.ts";

const Cupboard = () => {
    const { data, addBag, removeBag, editBag,
        editBrewer, addBrewer, removeBrewer,
        editGrinder, addGrinder, removeGrinder
    } = useDialBean();

    if (!data) { return <div className="flex items-center justify-center">Loading...</div>; }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="w-full h-full p-4 flex flex-col gap-2">
                <div className="w-full flex  items-center justify-start gap-1 mb-2 landscape:mb-1">
                    <DialBeanLargeIcon />
                    <h1>Cupboard</h1>
                </div>
                <div className="bg-bg2 px-2 py-4 rounded-lg flex flex-col gap-4">
                    <div className="w-full flex flex-col gap-2">
                        <div className="label">Bags:</div>
                        <PickItemCarousel
                            items={data.bags}
                            usageMap={data.bagUsedFlags}
                            onSelectDetails={true}
                            type="bag"
                            onNewItem={(item) => addBag(item as Bag)}
                            onRemoveItem={(item) => removeBag(item.id)}
                            onEditItem={(itemId, item) => editBag(itemId, item as Bag)}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <div className="label">Grinders:</div>
                        <PickItemCarousel
                            items={data.grinders}
                            usageMap={data.grinderUsedFlags}
                            onSelectDetails={true}
                            type="grinder"
                            onNewItem={(item) => addGrinder(item as Grinder)}
                            onRemoveItem={(item) => removeGrinder(item.id)}
                            onEditItem={(itemId, item) => editGrinder(itemId, item as Grinder)}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <div className="label">Brewers:</div>
                        <PickItemCarousel
                            items={data.brewers}
                            usageMap={data.brewerUsedFlags}
                            onSelectDetails={true}
                            type="brewer"
                            onNewItem={(item) => addBrewer(item as Brewer)}
                            onRemoveItem={(item) => removeBrewer(item.id)}
                            onEditItem={(itemId, item) => editBrewer(itemId, item as Brewer)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cupboard;




