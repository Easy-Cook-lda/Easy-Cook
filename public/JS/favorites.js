async function getRecipesInFavorites() {
    const sessionResponse = await fetch('/user');
    const sessionData = await sessionResponse.json();
    const userId = sessionData.userId;
    const sessionActive = sessionData && sessionData.userId;

    let listsResponse = await fetch(`/listByUserId/${userId}`)
    const list = await listsResponse.json()

    let response = await fetch(`/recipesLists/${list.Id}`)
    const recipes = await response.json()

    const receitasSection = document.getElementById('receitas');
    receitasSection.innerHTML = '';
    
    for (let recipe of recipes) {
        const recipesRespose = await fetch(`/recipes`)
        const allRecipes = await recipesRespose.json()

        let meal
        const isRecipeInList = allRecipes.some(r => r.Id === recipe.RecipeId);

        if(isRecipeInList) {
            const response = await fetch(`/recipeById/${recipe.RecipeId}`)
            meal = await response.json()
        } else {
            const apiResponse = await fetch(`http://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.RecipeId}`);
            const data = await apiResponse.json();
            meal = data.meals[0];
        }

        const mealElement = document.createElement('div');
        mealElement.classList.add('receita');
        mealElement.innerHTML = `
            <h3>${meal.Name || meal.strMeal}</h3>
            <p>${meal.Area || meal.strArea} - ${meal.Category || meal.strCategory}</p>
            <img src="${meal.Image || meal.strMealThumb}" alt="${meal.Name || meal.strMeal}" draggable="false">
            <p>${(meal.Instructions || meal.strInstructions).substring(0, 100)}...</p>
            <a href="/recipe/${meal.Id || meal.idMeal}">Ver receita</a>
        `;
            
        if (sessionActive) {
            const isFavorite = await verifyFavorites(meal.Id || meal.idMeal);

            if (isFavorite) {
                mealElement.innerHTML += `<button onclick='removeFromFavorites(${meal.Id || meal.idMeal})'>Remove From Favorites</button>`;
            } else {
                mealElement.innerHTML += `<button onclick='favorites(${meal.Id || meal.idMeal})'>Add To Favorites</button>`;
            }
        }
    
        receitasSection.appendChild(mealElement);
    }
}

async function favorites(recipeId) {
    const sessionResponse = await fetch('/user');
    const sessionData = await sessionResponse.json();
    const userId = sessionData.userId;

    let listsResponse = await fetch(`/listByUserId/${userId}`)
    const list = await listsResponse.json()

    recipesListsData = {
        recipeId, 
        listId: list.Id
    }

    try {
        const response = await fetch('/recipesLists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipesListsData)
        }) 

        if(response.ok) {
            window.location.reload()
        }
    } catch (error) {
        console.log('An error occurred')
    }
}

async function removeFromFavorites(recipeId) {
    try {
        const response = await fetch(`/recipesLists/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            alert("Failed to delete the recipe from the list");
        } else {
            window.location.reload()
        }
    } catch (error) {
        console.log('An error occurred')
    }
}

async function verifyFavorites(recipeId) {
    const sessionResponse = await fetch('/user');
    const sessionData = await sessionResponse.json();
    const userId = sessionData.userId;

    let listsResponse = await fetch(`/listByUserId/${userId}`)
    const list = await listsResponse.json()

    try {
        let response = await fetch(`/recipesLists/${recipeId}/${list.Id}`);
        const recipe = await response.json();
        
        if (recipe[0] ==null) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error('Erro ao verificar favoritos:', error);
        return false; // Retorna falso em caso de erro
    }
}

getRecipesInFavorites()