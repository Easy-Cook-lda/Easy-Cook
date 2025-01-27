async function getAllMeals() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const baseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?f='
    let allMeals = []

    for (const letter of alphabet) {
        try {
            const response = await fetch(`${baseUrl}${letter}`)
            const data = await response.json()

            if (data.meals) {
                allMeals = allMeals.concat(data.meals)
            }
        } catch (error) {
            console.error(`Erro ao buscar receitas para a letra ${letter}:`, error.message)
        }
    }

    if (allMeals.length === 0) {
        document.getElementById('load').style.display = 'flex'
    } else {
        document.getElementById('load').style.display = 'none'
    }

    return allMeals
}

async function carregarReceitas() {
    const receitasSection = document.getElementById('receitas')

    try {
        const response = await fetch('/recipes')
        const receitas = await response.json()

        const sessionResponse = await fetch('/user')
        const sessionData = await sessionResponse.json()
        const sessionActive = sessionData && sessionData.userId

        for (const receita of receitas) {
            let receitaDiv = document.createElement('div')
            receitaDiv.className = 'receita'
            receitaDiv.innerHTML =
            `
                <h3>${receita.Name}</h3>
                <p>${receita.Area} - ${receita.Category}</p>
                <img src="${receita.Image}" alt="${receita.Name}" draggable="false">
                <p>${receita.Instructions.substring(0, 100)}...</p>
                <a href="/recipe/${receita.Id}">Ver receita</a>
            `
            
            if (sessionActive) {
                const isFavorite = await verifyFavorites(receita.Id)
    
                if (isFavorite) {
                    receitaDiv.innerHTML += `<button onclick='removeFromFavorites(${receita.Id})'>Remove From Favorites</button>`
                } else {
                    receitaDiv.innerHTML += `<button onclick='favorites(${receita.Id})'>Add To Favorites</button>`
                }
            }
    
            receitasSection.appendChild(receitaDiv)
        }
    } catch (error) {
        console.error('Erro ao carregar as receitas:', error)
        receitasSection.innerHTML = '<p>Ocorreu um erro ao carregar as receitas.</p>'
    }
}

async function search() {
    let search = document.getElementById('search').value
    console.log()
    document.getElementById('areas').value = '0'
    document.getElementById('categories').value = '0'

    if(search == '') {
        document.getElementById('receitas').innerHTML = ''
        
        carregarReceitas()
        populateCategories()
    } else {
        
        let response = await fetch(`/recipesByName/${search}`)
        const receitas = await response.json()
        
        const receitasSection = document.getElementById('receitas')
        receitasSection.innerHTML = ''

        const sessionResponse = await fetch('/user')
        const sessionData = await sessionResponse.json()
        const sessionActive = sessionData && sessionData.userId
        
        for (const receita of receitas) {
            let receitaDiv = document.createElement('div')
            receitaDiv.className = 'receita'
            receitaDiv.innerHTML =
            `
                <h3>${receita.Name}</h3>
                <p>${receita.Area} - ${receita.Category}</p>
                <img src="${receita.Image}" alt="${receita.Name}" draggable="false">
                <p>${receita.Instructions.substring(0, 100)}...</p>
                <a href="/recipe/${receita.Id}">Ver receita</a>
            `
            
            if (sessionActive) {
                const isFavorite = await verifyFavorites(receita.Id)
    
                if (isFavorite) {
                    receitaDiv.innerHTML += `<button onclick='removeFromFavorites(${receita.Id})'>Remove From Favorites</button>`
                } else {
                    receitaDiv.innerHTML += `<button onclick='favorites(${receita.Id})'>Add To Favorites</button>`
                }
            }
    
            receitasSection.appendChild(receitaDiv)
        }
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
        console.error('Erro ao buscar areas:', error.message)
        return []
    }
}


// async function getMealsByCategory(category) {
//     const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
//     try {
//         const response = await fetch(url)
//         const data = await response.json()
//         return data.meals || []
//     } catch (error) {
//         console.error('Erro ao buscar receitas por categoria:', error.message)
//         return []
//     }
// }

// async function getMealsByArea(area) {
//     const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${area}`
//     try {
//         const response = await fetch(url)
//         const data = await response.json()
//         return data.meals || []
//     } catch (error) {
//         console.error('Erro ao buscar receitas por area:', error.message)
//         return []
//     }
// }

// Atualizar a função para exibir receitas filtradas por categoria e área
async function displayMealsByFilters(category, area) {
    const receitasSection = document.getElementById('receitas')
    let url = '/recipesByFilters'

    // Garantir que os filtros sejam combinados ou apenas um seja usado
    if (category != 0 && area != 0) {
        url = `/recipesByAreaAndCategory/${area}/${category}`;  // Filtro por ambos
    } else if (category != 0 && area == 0) {
        url = `/recipesByCategory/${category}`;  // Filtro apenas por categoria
    } else if (category == 0 && area != 0) {
        url = `/recipesByArea/${area}`;  // Filtro apenas por área
    } else {
        // Se ambos estiverem vazios, podemos exibir todas as receitas
        url = `/recipesByFilters`;  // Endpoint para todas as receitas (sem filtros)
    }

    try {
        const response = await fetch(url)
        const receitas = await response.json()

        receitasSection.innerHTML = ''

        const sessionResponse = await fetch('/user')
        const sessionData = await sessionResponse.json()
        const sessionActive = sessionData && sessionData.userId

        for (const receita of receitas) {
            let receitaDiv = document.createElement('div')
            receitaDiv.className = 'receita'
            receitaDiv.innerHTML =
            `
                <h3>${receita.Name}</h3>
                <p>${receita.Area} - ${receita.Category}</p>
                <img src="${receita.Image}" alt="${receita.Name}" draggable="false">
                <p>${receita.Instructions.substring(0, 100)}...</p>
                <a href="/recipe/${receita.Id}">Ver receita</a>
            `

            if (sessionActive) {
                const isFavorite = await verifyFavorites(receita.Id)

                if (isFavorite) {
                    receitaDiv.innerHTML += `<button onclick='removeFromFavorites(${receita.Id})'>Remove From Favorites</button>`
                } else {
                    receitaDiv.innerHTML += `<button onclick='favorites(${receita.Id})'>Add To Favorites</button>`
                }
            }

            receitasSection.appendChild(receitaDiv)
        }
    } catch (error) {
        console.error('Erro ao buscar receitas:', error)
        receitasSection.innerHTML = '<p>Ocorreu um erro ao carregar as receitas.</p>'
    }
}

async function favorites(recipeId) {
    const sessionResponse = await fetch('/user')
    const sessionData = await sessionResponse.json()
    const userId = sessionData.userId

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
        })

        if (!response.ok) {
            alert("Failed to delete the recipe from the list")
        } else {
            window.location.reload()
        }
    } catch (error) {
        console.log('An error occurred')
    }
}

async function verifyFavorites(recipeId) {
    const sessionResponse = await fetch('/user')
    const sessionData = await sessionResponse.json()
    const userId = sessionData.userId

    let listsResponse = await fetch(`/listByUserId/${userId}`)
    const list = await listsResponse.json()

    try {
        let response = await fetch(`/recipesLists/${recipeId}/${list.Id}`)
        const recipe = await response.json()
        
        if (recipe[0] ==null) {
            return false
        } else {
            return true
        }
    } catch (error) {
        console.error('Erro ao verificar favoritos:', error)
        return false 
    }
}

async function populateCategories() {
    const categories = await getCategories()
    const select = document.getElementById('categories')

    categories.forEach(category => {
        const option = document.createElement('option')
        option.value = category.strCategory
        option.textContent = category.strCategory
        select.appendChild(option)
    })

    select.addEventListener('change', () => {
        const selectedCategory = select.value
        const selectedArea = document.getElementById('areas').value
        displayMealsByFilters(selectedCategory, selectedArea)  // Passar ambos os filtros
    })
}

async function populateAreas() {
    const areas = await getAreas()
    const select = document.getElementById('areas')

    areas.forEach(area => {
        const option = document.createElement('option')
        option.value = area.strArea
        option.textContent = area.strArea
        select.appendChild(option)
    })

    select.addEventListener('change', () => {
        const selectedArea = select.value
        const selectedCategory = document.getElementById('categories').value
        displayMealsByFilters(selectedCategory, selectedArea)  // Passar ambos os filtros
    })
}

function resetFilters() {
    window.location.reload()
}

getAllMeals()
carregarReceitas()
populateCategories()
populateAreas()