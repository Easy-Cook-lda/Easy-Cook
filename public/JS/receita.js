async function getMealDataFromDB() {
    try {
        // const sessionResponse = await fetch('/api/user');
        // const sessionData = await sessionResponse.json();
        // const userId = sessionData.userId;

        const path = window.location.pathname;
        const pathSegments = path.split('/');
        const recipeId = parseInt(pathSegments[pathSegments.length - 1])

        let response = await fetch(`/recipeById/${recipeId}`)
        const recipe = await response.json()

        let ingredientsResponse = await fetch(`/ingredientsByRecipeId/${recipeId}`)
        const ingredientes = await ingredientsResponse.json()

        document.querySelector('body main section').innerHTML = 
        `<article id='image-info'>
            <img src='${recipe.Image}'>
            <div id='recipe-info'>
                <h1>${recipe.Name}</h1>
                <p>${recipe.Area} - ${recipe.Category}</p>
                <h2>Ingredients</h2>
                <div id='ingredientes'></div>
            </div>
        </article>
        <article id='instructions'>
            <p>${recipe.Instructions}</p>
        </article>`

        let tcd = document.createElement('ul')
        tcd.className = 'tcd'

        switch (true) {
            case (recipe.Time != null):
                let time = document.createElement('li')
                time.textContent = `Time: ${recipe.Time}min`
                tcd.appendChild(time)
            case (recipe.Cost != null):
                let cost = document.createElement('li')
                cost.textContent = `Cost: ${recipe.Cost}€`
                tcd.appendChild(cost)
            case (recipe.Difficulty != null):
                let difficulty = document.createElement('li')
                difficulty.textContent = `Difficulty: ${recipe.Difficulty}`
                difficulty.id = 'difficulty'
                tcd.appendChild(difficulty)
                break;
            default:
                break;
        }
        document.querySelector('body main section').appendChild(tcd)

        ingredientes.forEach(ingrediente => {
            let ingredienteElement = document.createElement('p')
            ingredienteElement.textContent = ingrediente.Name
            document.getElementById('ingredientes').appendChild(ingredienteElement)
        });

        document.title = `Easy Cook - ${recipe.Name}`
    } catch (error) {
        
    }
}

async function getMealDataFromAPI() {
    try {
        // const sessionResponse = await fetch('/api/user');
        // const sessionData = await sessionResponse.json();
        // const userId = sessionData.userId;

        const path = window.location.pathname
        const pathSegments = path.split('/')
        const recipeId = parseInt(pathSegments[pathSegments.length - 1])

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
        const data = await response.json()
        const recipe = data.meals[0]
        console.log(recipe)

        let ingredientes = []

        for (let i = 1; i <= 20; i++) {
            const ingrediente = recipe[`strIngredient${i}`];
            if (ingrediente) {
                ingredientes.push(ingrediente);
            }
        }

        console.log(ingredientes)

        document.querySelector('body main section').innerHTML = 
        `<article id='image-info'>
            <img src='${recipe.strMealThumb}'>
            <div id='recipe-info'>
                <h1>${recipe.strMeal}</h1>
                <p>${recipe.strArea} - ${recipe.strCategory}</p>
                <h2>Ingredients</h2>
                <div id='ingredientes'></div>
            </div>
        </article>
        <article id='instructions'>
            <p>${recipe.strInstructions}</p>
        </article>`

        ingredientes.forEach(ingrediente => {
            let ingredienteElement = document.createElement('p')
            ingredienteElement.textContent = ingrediente
            document.getElementById('ingredientes').appendChild(ingredienteElement)
        });

        document.title = `Easy Cook - ${recipe.strMeal}`
    } catch (error) {
        
    }
}

// getMealDataFromAPI()
getMealDataFromDB()