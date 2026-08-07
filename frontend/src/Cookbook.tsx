import type { Recipe } from './types';
import { useDileBean } from './DileBeanContext';

const Cookbook = () => {
    const { data } = useDileBean();
    const baseRecipes: Recipe[] = data.recipes?.filter((recipe) => recipe.isBaseRecipe) || [];
    const userRecipes: Recipe[] = data.recipes?.filter((recipe) => !recipe.isBaseRecipe) || [];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Recipes</h1>

            <section className="w-full max-w-xl">
                <h2 className="text-xl font-semibold mb-2">Recipes</h2>
                <ul>
                    {userRecipes.length > 0 && (
                        <>
                        {userRecipes.map((recipe) => (
                            <li key={recipe.id}>
                                {recipe.name} — {recipe.brewMethod}
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
                                {recipe.name} — {recipe.brewMethod}
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




