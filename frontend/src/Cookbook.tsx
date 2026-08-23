import type { Recipe } from './types';
import { useDialBean } from './DialBeanContext';
import { DialBeanLargeIcon } from './icons';
import { LibraryCard } from './components';

const Cookbook = () => {
    const { data, addRecipe, removeRecipe, editRecipe } = useDialBean();

    if (!data) { return <div className="flex items-center justify-center">Loading...</div>; }
    console.log("Cookbook data:", data);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="w-full h-full p-4 flex flex-col gap-2">
                <div className="w-full flex  items-center justify-start gap-1 mb-2 landscape:mb-1">
                    <DialBeanLargeIcon />
                    <h1>Cookbook</h1>
                </div>
                <div className="bg-bg2 px-2 flex-1 pt-4 pb-2 w-full h-full rounded-lg flex justify-stretch gap-4">
                    <LibraryCard
                        items={data.recipes}
                        usageMap={data.recipeUsedFlags}
                        onSelectDetails={true}
                        type="recipe"
                        onNewItem={(item) => addRecipe(item as Recipe)}
                        onRemoveItem={(item) => removeRecipe(item.id)}
                        onEditItem={(itemId, item) => editRecipe(itemId, item as Recipe)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Cookbook;




