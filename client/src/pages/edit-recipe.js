import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom"; 
import { useParams } from "react-router-dom";

export const EditRecipe = () => {
    const userID = useGetUserID();
    const { id } = useParams();
    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        ingredients: [],
        instructions: "",
        imageUrl: "",
        cookingTime: 0,
        userOwner: userID,
    });


    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(
                    `https://chef-connect.onrender.com/recipes/${id}`
                );
                setRecipe(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchRecipe();
    }, [id]);

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleIngredientChange = (event, index) => {
        const { value } = event.target;
        const ingredients = [...recipe.ingredients];
        ingredients[index] = value;
        setRecipe({ ...recipe, ingredients });
    };

    const handleAddIngredient = () => {
        const ingredients = [...recipe.ingredients, ""];
        setRecipe({ ...recipe, ingredients });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {


            await axios.put(
                `https://chef-connect.onrender.com/recipes/edit/${id}`,
                recipe
            );

            alert("Recipe Updated");
            navigate(`/recipes/${id}`);
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div className="create-recipe">
            <h2>update Recipe</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={recipe.name}
                    onChange={handleChange}
                />
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={recipe.description}
                    onChange={handleChange}
                ></textarea>
                <label htmlFor="ingredients">Ingredients</label>
                {recipe.ingredients.map((ingredient, index) => (
                    <input
                        key={index}
                        type="text"
                        name="ingredients"
                        value={ingredient}
                        onChange={(event) => handleIngredientChange(event, index)}
                    />
                ))}
                <button type="button" onClick={handleAddIngredient}>
                    Add Ingredient
                </button>
                <label htmlFor="instructions">Instructions</label>
                <textarea
                    id="instructions"
                    name="instructions"
                    value={recipe.instructions}
                    onChange={handleChange}
                ></textarea>
                <label htmlFor="imageUrl">Image URL</label>
                <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={recipe.imageUrl}
                    onChange={handleChange}
                />
                <label htmlFor="cookingTime">Cooking Time (minutes)</label>
                <input
                    type="number"
                    id="cookingTime"
                    name="cookingTime"
                    value={recipe.cookingTime}
                    onChange={handleChange}
                />
                <button type="submit">Update Recipe</button>
            </form>
        </div>
    );
};
