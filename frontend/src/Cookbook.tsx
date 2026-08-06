import type { BaseRecipe } from './types';
import { useDileBean } from './DileBeanContext';

const Cookbook = () => {
    const { data } = useDileBean();
    const baseRecipes: BaseRecipe[] = data.recipes_base;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Recipes</h1>

            <section className="w-full max-w-xl">
                <h2 className="text-xl font-semibold mb-2">Base Recipes</h2>
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




