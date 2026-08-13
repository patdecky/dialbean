import type { Recipe } from './types';
import { useDialBean } from './DialBeanContext';

const Cookbook = () => {
    const { data } = useDialBean();
    const baseRecipes: Recipe[] = data.recipes?.filter((recipe) => recipe.isBase) || [];
    const userRecipes: Recipe[] = data.recipes?.filter((recipe) => !recipe.isBase) || [];

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <h1 className="text-2xl font-bold mb-4 max-w-100">Recipes</h1>

            <section className="w-full max-w-xl">
                <h2 className="text-xl font-semibold mb-2">Recipes</h2>
                <ul>
                    {userRecipes.length > 0 && (
                        <>
                        {userRecipes.map((recipe) => (
                            <li key={recipe.id}>
                                {recipe.name} — {recipe.type}
                            </li>
                            ))}
                            <hr />
                        </>
                    )}
                </ul>
                <ul>
                    {baseRecipes.length > 0 ? (
                        baseRecipes.map((recipe) => (
                            <li key={recipe.id}>
                                {recipe.name} — {recipe.type}
                            </li>
                        ))
                    ) : (
                        <li>No base recipes available.</li>
                    )}
                </ul>
            </section>
        </div>
    );
};

export default Cookbook;




