async function getRecipes() {
    const sessionResponse = await fetch('/user')
    const sessionData = await sessionResponse.json()
    const userId = sessionData.userId
    
    let userResponse = await fetch(`/users/${userId}`)
    const user = await userResponse.json()

    let response
    if(user.Permissions === 1) {
        response = await fetch(`/recipesByUserId/${userId}`)
    } else {
        response = await fetch(`/recipes`)
    }

    const recipes = await response.json()

    recipes.forEach(recipe => {
        const newLine = document.createElement('tr')
        newLine.innerHTML = `
        <th scope="row">${recipe.Id}</th>
        <td>${recipe.Name}</td>
        <td>${recipe.Category}</td>
        <td>${recipe.Area}</td>
        <td class='image'>${recipe.Image}</td>
        <td class='inst'>${recipe.Instructions}</td>
        <td>
            <button onclick='deleteMeal(${recipe.Id})'>Delete</button>
            <button onclick='edit(${recipe.Id})'>Edit</button>
        </td>`
        document.querySelector('main section table tbody').appendChild(newLine)
    })
}

async function deleteMeal(recipeId) {
    let ingredientsResponse = await fetch(`/ingredientsByRecipeId/${recipeId}`)
    const ingredientes = await ingredientsResponse.json()

    ingredientes.forEach(async ingrediente => {
        try {
            const response = await fetch(`/ingredients/${ingrediente.Id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
    
            if (!response.ok) {
                alert("Failed to delete the recipe")
            } else {
                window.location.href = "/recipes.html"
            }
        } catch (error) {
            console.log('An error occurred')
        }
    })

    try {
        const response = await fetch(`/recipes/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (!response.ok) {
            alert("Failed to delete the recipe")
        } else {
            window.location.reload()
        }
    } catch (error) {
        console.log('An error occurred')
    }
}

async function edit(recipeId) {
    let response = await fetch(`/recipeById/${recipeId}`)
    const recipe = await response.json()

    const editSection = document.createElement('section')
    editSection.id = 'edit-section'
    editSection.innerHTML = `
    <article>
        <input type='text' placeholder='Name' id='name' value='${recipe.Name}'>
        <select id='category'></select>
        <select id='area'></select>
        <input type='text' placeholder='Image' id='image' value='${recipe.Image}'>
        <textarea placeholder='Instructions' id='instructions'>${recipe.Instructions}</textarea>
        <button onclick='saveChanges(${recipeId})'>Save Changes</button>
        <button onclick='closeEdit()'>Cancel</button>
    </article>`

    document.querySelector('main').appendChild(editSection)
    await populateCategories(recipe.Category)
    await populateAreas(recipe.Area)
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
        console.error('Erro ao buscar categorias:', error.message)
        return []
    }
}

async function populateCategories(selectedCategory = '') {
    const categories = await getCategories()

    const select = document.getElementById('category')
    select.innerHTML = ''

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

    const select = document.getElementById('area')
    select.innerHTML = ''

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

async function saveChanges(recipeId) {
    let name = document.getElementById('name').value
    let category = document.getElementById('category').value
    let area = document.getElementById('area').value
    let image = document.getElementById('image').value
    let instructions = document.getElementById('instructions').value

    try {
        const response = await fetch(`/recipes/update/${recipeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, category, area, image, instructions })
        })

        if (!response.ok) {
            throw new Error('Failed to update recipe')
        }

        console.log('Recipe updated successfully')
        window.location.reload()
    } catch (error) {
        console.error('Error updating recipe:', error)
    }
}

function closeEdit(){
    const editSection = document.getElementById('edit-section')

    editSection.remove()
}

getRecipes()