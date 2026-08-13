import { useDialBean } from "./DialBeanContext.tsx"
import { PickItemCarousel } from "./dialogs.tsx"

const Cupboard = () => {
    const { data } = useDialBean();

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="flex flex-col items-start justify-start max-w-100 gap-2">
                <div className="w-full">
                    <PickItemCarousel
                        items={data.brewers}
                        onSelectDetails={true}
                        type="brewer"
                    />
                </div>
                <div className="w-full">
                    <PickItemCarousel
                        items={data.grinders}
                        onSelectDetails={true}
                        type="grinder"
                    />
                </div>
                <div className="w-full">
                    <PickItemCarousel
                        items={data.bags}
                        onSelectDetails={true}
                        type="bag"
                    />
                </div>
                <div className="w-full">
                    <PickItemCarousel
                        items={data.recipes}
                        onSelectDetails={true}
                        type="recipe"
                    />
                </div>

            </div>
        </div>
    )
}

export default Cupboard;




