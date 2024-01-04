 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();
  const userID = useGetUserID();


  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/${id}`
        );
        setRecipe(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userID == recipe.userOwner &&
        <div>
          <Link to={`/recipes/edit/${recipe._id}`}>

            <button>Edit</button>
          </Link>
        </div>}
      <h1 >{recipe.name}</h1>
      <p>{recipe.description}</p>

      <img src={recipe.imageUrl} alt={recipe.name} />
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <div className="instructions">
        <p>{recipe.instructions}</p>
      </div>
      <p>Cooking Time: {recipe.cookingTime} minutes</p>
      {/* Add more details as needed */}
    </div>

  );
};

export default RecipeDetails;
