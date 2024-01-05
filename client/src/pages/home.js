import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [searchResults, setSearchResults] = useState([]); // State to hold the filtered results


  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://chef-connect.onrender.com/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://chef-connect.onrender.com/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("https://chef-connect.onrender.com/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);


  useEffect(() => {
    const filteredRecipes = recipes.filter((recipe) => {
      const lowerCaseName = recipe.name.toLowerCase();
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const nameMatch = lowerCaseName.includes(lowerCaseSearchTerm);

      const ingredientsMatch = recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(lowerCaseSearchTerm)
      );

      return nameMatch || ingredientsMatch;
    });

    setSearchResults(filteredRecipes);
  }, [searchTerm, recipes]);


  return (
    <div className="home-container">
      <h1>Recipes</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for recipes or ingrediants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="recipe-list">
        {searchResults.map((recipe) => (
          <li key={recipe._id} className="recipe-card">
            <div>
              <Link to={`/recipes/${recipe._id}`}>
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="recipe-image"
                />
              </Link>
              <div className="recipe-details">
                <h2 className="recipe-title">{recipe.name}</h2>
                <p className="description">{recipe.description}</p>


                <button
                  onClick={() => saveRecipe(recipe._id)}
                  className="save-button"
                  disabled={isRecipeSaved(recipe._id)}
                >
                  {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                </button>




                <p>Cooking Time: {recipe.cookingTime} minutes</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
