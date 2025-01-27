async function loadPage() {
    const sessionResponse = await fetch('/user');
    const sessionData = await sessionResponse.json();
    const userId = sessionData.userId;

    if(userId != null) {
        document.querySelector('main section').innerHTML = `<article>
                <h2>Use this google search to find and copy an image address for your recipe</h2>
                <br>
                <div class="gcse-search"></div>
            </article>
            <form onsubmit="event.preventDefault(), createRecipe()">
                <input type="text" placeholder="Recipe Name" id="name">
                <select id="areas">
                    <option value="0" selected disabled>Select Area</option>
                </select>
                <select id="categories">
                    <option value="0" selected disabled>Select category</option>
                </select>
                <input type="text" placeholder="Image Url" id="image">
                <textarea placeholder="Instructions" id="instructions"></textarea>
                <input type="number" placeholder="Time in minutes" id="time">
                <input type="number" placeholder="Cost in euros" id="cost">
                <select id="difficulty">
                    <option value="0" selected disabled>Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <button>Create Recipe</button>
            </form>`
    } else {
        document.querySelector('main section').innerHTML = '<h1>Login in your account to access this page!</h1>'
    }
}

async function getCategories() {
    const url = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data.meals || []
    } catch (error) {
        console.error('Erro ao buscar categorias:', error.message)
        return []
    }
}

async function getAreas() {
    const url = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list'
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data.meals || []
    } catch (error) {
        console.error('Erro ao buscar áreas:', error.message)  // Corrigido aqui
        return []
    }
}

async function populateCategories(selectedCategory = '') {
    const categories = await getCategories()

    const select = document.getElementById('categories')
    select.innerHTML = ''  // Limpa as opções anteriores

    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = 'Select category'
    select.appendChild(defaultOption)

    categories.forEach(category => {
        const option = document.createElement('option')
        option.value = category.strCategory
        option.textContent = category.strCategory
        if (category.strCategory === selectedCategory) {
            option.selected = true
        }
        select.appendChild(option)
    })
}

async function populateAreas(selectedArea = '') {
    const areas = await getAreas()

    const select = document.getElementById('areas')
    select.innerHTML = ''  // Limpa as opções anteriores

    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = 'Select area'
    select.appendChild(defaultOption)

    areas.forEach(area => {
        const option = document.createElement('option')
        option.value = area.strArea
        option.textContent = area.strArea
        if (area.strArea === selectedArea) {
            option.selected = true
        }
        select.appendChild(option)
    })
}

async function createRecipe() {
    let name = document.getElementById('name').value
    let categoryId = document.getElementById('categories').value
    let areaId = document.getElementById('areas').value
    let image = document.getElementById('image').value
    let instructions = document.getElementById('instructions').value
    let time = document.getElementById('time').value
    let cost = document.getElementById('cost').value
    let difficulty = document.getElementById('difficulty').value

    const sessionResponse = await fetch('/user')
    const sessionData = await sessionResponse.json()
    const userId = sessionData.userId

    const recipeData = {
        name,
        category: categoryId,
        area: areaId,
        image,
        instructions,
        time,
        cost,
        difficulty,
        userId
    }
    
    try {
        const response = await fetch('/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        })
        
        if (!response.ok) {
            throw new Error('Falha ao criar a receita')
        }
        const data = await response.json()
        console.log('Receita criada com sucesso:', data)
    } catch (error) {
        console.error('Erro ao criar receita:', error.message)
    }
}

loadPage()
populateCategories()
populateAreas()