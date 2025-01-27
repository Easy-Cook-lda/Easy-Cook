const express = require('express')
const axios = require('axios')
const https = require('https')
const path = require('path')
const mysql = require('mysql2/promise');
const { getRecipes, getRecipesByName, getRecipesByCategory, getRecipeById, getIngredientsByRecipeId, addUser, getUsers, getUserById, addlist, getRecipesByUserId, deleteRecipe, deleteIngredients, editRecipe, getListByUserId, addToRecipeslists, getRecipesListsByRecipeIdAndListId, getRecipesListsByListId, deleteRecipesListsByRecipeId, addRecipe, getRecipesByArea, getRecipesByAreaAndCategory } = require('./models')

const router = express.Router()

const url = 'https://www.themealdb.com/api/json/v1/1/search.php?f=a' 

// Configurar Axios para ignorar a verificação do certificado SSL
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'easycook'
});

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const baseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';

router.get('/import', async (req, res) => {
    try {
        for (let char of alphabet) {
            const response = await axiosInstance.get(baseUrl + char);
            const recipes = response.data.meals;


            if (!recipes) {
                return res.status(404).json({ message: 'Nenhuma receita encontrada na API externa.' });
            }

            for (const recipe of recipes) {
                const { idMeal, strMeal, strCategory, strArea, strMealThumb, strInstructions } = recipe;

                await db.query(
                    'INSERT INTO recipes (Id, Name, Category, Area, Image, Instructions) VALUES (?, ?, ?, ?, ?, ?)',
                    [idMeal, strMeal, strCategory, strArea, strMealThumb, strInstructions]
                );

                for (let i = 1; i <= 20; i++) {
                    const ingredientName = recipe[`strIngredient${i}`];

                    if (ingredientName && ingredientName.trim() !== '') {
                        let [ingredientResult] = await db.query('SELECT id FROM ingredients WHERE Name = ?', [ingredientName]);
                        if (ingredientResult.length === 0) {
                            await db.query(
                                'INSERT INTO ingredients (Name, RecipeId) VALUES (?, ?)',
                                [ingredientName, idMeal]
                            );
                        } else {
                            const ingredientId = ingredientResult[0].id;
                            await db.query(
                                'UPDATE ingredients SET RecipeId = ? WHERE id = ?',
                                [idMeal, ingredientId]
                            );
                        }
                    }
                }
            }
        }
        res.status(200).json({ message: 'Receitas importadas com sucesso!' });
    } catch (error) {
        console.error('Erro ao importar receitas:', error.message);
        res.status(500).json({ message: 'Erro ao importar receitas.' });
    }
});


router.get('/api/meals', async (req, res) => {
    try {
        const response = await axios.get(url, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })

        res.json(response.data)
    } catch (error) {
        console.error('Erro ao obter dados da API:', error.message)
        res.status(500).json({ error: 'Erro ao obter dados da API' })
    }
})

router.get('/recipes', async (req, res) => {
    try {
        const recipes = await getRecipes()
        res.json(recipes)
    } catch (error) {
        console.error('Erro ao buscar receitas da base de dados:', error)
        res.status(500).send('Erro ao buscar receitas.')
    }
})

router.post('/recipes', express.json(), async (req, res) => {
    const { name, category, area, image, instructions, time, cost, difficulty, userId } = req.body

    try {
        await addRecipe({ name, category, area, image, instructions, time, cost, difficulty, userId })
        res.status(201).json({ message: 'Receita criada com sucesso!' })
    } catch (error) {
        console.error('Erro ao criar receita:', error)
        res.status(500).json({ error: 'Erro ao criar receita.' })
    }
})

router.get('/recipeById/:id', async (req, res) => {
    const { id } = req.params

    try {
        const recipe = await getRecipeById(id)
        res.json(recipe)
    } catch (error) {
        console.error('Erro ao buscar receita da base de dados:', error)
        res.status(500).send('Erro ao buscar receita.')
    }
})

router.get('/recipesByUserId/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const recipes = await getRecipesByUserId(userId)
        res.json(recipes)
        console.log(recipes)
    } catch (error) {
        console.error('Erro ao buscar receita da base de dados:', error)
        res.status(500).send('Erro ao buscar receita.')
    }
})

router.get('/recipesByName/:name', express.json(), async (req, res) => {
    const { name } = req.params

    try {
        const recipes = await getRecipesByName(name)
        res.json(recipes)
    } catch (error) {
        console.error('Erro ao buscar receitas da base de dados:', error)
        res.status(500).send('Erro ao buscar receitas.')
    }
})

router.get('/recipesByCategory/:category', express.json(), async (req, res) => {
    const { category } = req.params

    try {
        const recipes = await getRecipesByCategory(category)
        res.json(recipes)
    } catch (error) {
        console.error('Erro ao buscar receitas da base de dados:', error)
        res.status(500).send('Erro ao buscar receitas.')
    }
})

router.get('/recipesByArea/:area', express.json(), async (req, res) => {
    const { area } = req.params

    try {
        const recipes = await getRecipesByArea(area)
        res.json(recipes)
    } catch (error) {
        console.error('Erro ao buscar receitas da base de dados:', error)
        res.status(500).send('Erro ao buscar receitas.')
    }
})

router.get('/recipesByAreaAndCategory/:area/:category', express.json(), async (req, res) => {
    const { area, category } = req.params

    try {
        const recipes = await getRecipesByAreaAndCategory(area, category)
        res.json(recipes)
    } catch (error) {
        console.error('Erro ao buscar receitas da base de dados:', error)
        res.status(500).send('Erro ao buscar receitas.')
    }
})

router.delete('/recipes/:id', express.json(), async (req, res) => {
    const { id } = req.params

    try {
        await deleteRecipe(id)

        res.status(200).send({ message: 'Receita removida da lista.' })
    } catch (error) {
        console.error('Error ao remover Receita:', error)
        res.status(500).send({ error: 'Falha ao remover Receita.' })
    }
})

router.patch('/recipes/update/:id', express.json(), async (req, res) => {
    const { id } = req.params
    const { name, category, area, image, instructions } = req.body

    try {
        await editRecipe(id, name, category, area, image, instructions)
        res.status(200).json({ message: 'Recipe updated successfully' })
    } catch (error) {
        console.error('Erro ao atualizar a receita da base de dados:', error)
        res.status(500).send('Erro ao atualizar receita.')
    }
})

router.get('/ingredientsByRecipeId/:recipeId', async (req, res) => {
    const { recipeId } = req.params

    try {
        const ingredients = await getIngredientsByRecipeId(recipeId)
        res.json(ingredients)
    } catch (error) {
        console.error('Erro ao buscar ingredientes da base de dados:', error)
        res.status(500).send('Erro ao buscar ingredientes.')
    }
})

router.delete('/ingredients/:id', express.json(), async (req, res) => {
    const { id } = req.params

    try {
        await deleteIngredients(id)

        res.status(200).send({ message: 'Ingrediente removida da lista.' })
    } catch (error) {
        console.error('Error ao remover Ingrediente:', error)
        res.status(500).send({ error: 'Falha ao remover Ingrediente.' })
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await getUsers()
        res.json(users)
    } catch (error) {
        console.error('Erro ao buscar users da base de dados:', error)
        res.status(500).send('Erro ao buscar users.')
    }
})

router.get('/users/:id', async (req, res) => {
    const { id } = req.params

    try {
        const user = await getUserById(id)
        console.log(user)
        res.json(user)
    } catch (error) {
        console.error('Erro ao buscar user da base de dados:', error)
        res.status(500).send('Erro ao buscar user.')
    }
})

router.get('/user', (req, res) => {
    if (req.session.userId) {
        res.send({ userId: req.session.userId })
    } else {
        res.status(401).send({ message: 'Não autenticado' })
    }
})

router.post('/users', express.json(), async (req, res) => {
    const { id, name, email, password } = req.body

    try {
        await addUser({ id, name, email, password })
        res.status(201).json({ message: 'User criado com sucesso!' })
    } catch (error) {
        console.error('Erro ao criar User:', error)
        res.status(500).json({ error: 'Erro ao criar User.' })
    }
})

router.get('/listByUserId/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const recipes = await getListByUserId(userId)
        res.json(recipes)
    } catch (error) {
        console.error('Erro ao buscar lista da base de dados:', error)
        res.status(500).send('Erro ao buscar lista.')
    }
})

router.post('/lists', express.json(), async (req, res) => {
    const { id, userId } = req.body

    try {
        await addlist({ id, userId })
        res.status(201).json({ message: 'Lista criada com sucesso!' })
    } catch (error) {
        console.error('Erro ao criar lista:', error)
        res.status(500).json({ error: 'Erro ao criar lista.' })
    }
})

router.get('/recipesLists/:listId', async (req, res) => {
    const { listId } = req.params

    try {
        const recipes = await getRecipesListsByListId(listId)
        res.json(recipes)
    } catch (error) {
        console.error('Erro ao buscar receita na lista da base de dados:', error)
        res.status(500).send('Erro ao buscar receita na lista.')
    }
})

router.get('/recipesLists/:recipeId/:listId', async (req, res) => {
    const { recipeId, listId } = req.params

    try {
        const recipes = await getRecipesListsByRecipeIdAndListId(recipeId, listId)
        res.json(recipes)
    } catch (error) {
        console.error('Erro ao buscar receita na lista da base de dados:', error)
        res.status(500).send('Erro ao buscar receita na lista.')
    }
})

router.delete('/recipesLists/:recipeId', express.json(), async (req, res) => {
    const { recipeId } = req.params

    try {
        await deleteRecipesListsByRecipeId(recipeId)

        res.status(200).send({ message: 'Receita removida da lista.' })
    } catch (error) {
        console.error('Error ao remover Receita da lista:', error)
        res.status(500).send({ error: 'Falha ao remover Receita da lista.' })
    }
})

router.post('/recipesLists', express.json(), async (req, res) => {
    const { recipeId, listId } = req.body

    try {
        await addToRecipeslists({ recipeId, listId })
        res.status(201).json({ message: 'Receita adicionada aos favoritos!' })
    } catch (error) {
        console.error('Erro ao adicionar receita aos favoritos:', error)
        res.status(500).json({ error: 'Erro ao adicionar receita aos favoritos.' })
    }
})

router.post('/login', (req, res) => {
    const { userId } = req.body
    req.session.userId = userId 
    res.send({ message: 'Sessão iniciada com sucesso!' })
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err)
        return res.status(500).send('Error logging out')
      }
      res.clearCookie('connect.sid') 
      res.redirect('/')
    })
})

router.get(`/`, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

router.get(`/recipe/:id`, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'recipe.html'))
})

router.get(`/login`, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'login.html'))
})

router.get(`/signin`, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'signin.html'))
})

router.get(`/favorites`, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'favorites.html'))
})

router.get(`/edit`, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'edit.html'))
})

router.get(`/add`, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'add.html'))
})

router.get(`/profile`, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'HTML', 'profile.html'))
})

module.exports = router