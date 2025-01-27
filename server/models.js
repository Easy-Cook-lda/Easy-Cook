const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'easycook'
});

async function getRecipes() {
    const query = 'SELECT * FROM recipes ORDER BY Id DESC';
    const [rows] = await db.execute(query);
    return rows;
}

async function addRecipe(recipeData) {
    try {
        const { name, category, area, image, instructions, time, cost, difficulty, userId } = recipeData;

        const query = `INSERT INTO recipes (Name, Category, Area, Image, Instructions, Time, Cost, Difficulty, UserId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [results] = await db.query(query, [name, category, area, image, instructions, time, cost, difficulty, userId]);

        return { id: results.insertId, ...recipeData };
    } catch (error) {
        console.error('Erro ao criar User:', error);
        throw error;
    }
}

async function getRecipesByName(name) {
    const query = `SELECT * FROM recipes WHERE Name LIKE ?`;
    const [rows] = await db.query(query, [`%${name}%`]);
    return rows;
}

async function getRecipesByCategory(category) {
    const query = `SELECT * FROM recipes WHERE Category LIKE ?`;
    const [rows] = await db.query(query, [`${category}%`]);
    return rows;
}

async function getRecipesByArea(area) {
    const query = `SELECT * FROM recipes WHERE Area LIKE ?`;
    const [rows] = await db.query(query, [`${area}%`]);
    return rows;
}

async function getRecipesByAreaAndCategory(area, category) {
    const query = `SELECT * FROM recipes WHERE Area LIKE ? AND Category LIKE ?`;
    const [rows] = await db.query(query, [area, category]);
    return rows;
}

async function getRecipeById(id) {
    const query = `SELECT * FROM recipes WHERE Id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
}

async function getRecipesByUserId(userId) {
    const query = `SELECT * FROM recipes WHERE UserId LIKE ?`;
    const [rows] = await db.query(query, [`${userId}%`]);
    return rows;
}

async function deleteRecipe(recipeId) {
    const query = 'DELETE FROM recipes WHERE Id = ?';
    return db.query(query, [recipeId]);
}

async function editRecipe(id, name, category, area, image, instructions) {
    const query = `UPDATE recipes SET Name = ?, Category = ?, Area = ?, Image = ?, Instructions = ? WHERE Id = ?`;
    return await db.query(query, [name, category, area, image, instructions, id]);
}

async function getIngredientsByRecipeId(recipeId) {
    const query = 'SELECT * FROM ingredients WHERE RecipeId = ?';
    const [rows] = await db.query(query, [`${recipeId}%`]);
    return rows;
}

async function deleteIngredients(id) {
    const query = 'DELETE FROM ingredients WHERE Id = ?';
    return db.query(query, [id]);
}

async function getUsers() {
    const query = 'SELECT * FROM users';
    const [rows] = await db.execute(query);
    return rows;
}

async function getUserById(id) {
    const query = `SELECT * FROM users WHERE Id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
}

async function addUser(userData) {
    try {
        const { id, name, email, password } = userData;

        const query = `INSERT INTO users (Id, Name, Email, Password) VALUES (?, ?, ?, ?)`;

        const [results] = await db.query(query, [id, name, email, password]);

        return { id: results.insertId, ...userData };
    } catch (error) {
        console.error('Erro ao criar User:', error);
        throw error;
    }
}

async function getListByUserId(userId) {
    const query = `SELECT * FROM lists WHERE UserId LIKE ?`;
    const [rows] = await db.query(query, [`${userId}%`]);
    return rows[0];
}

async function getRecipesListsByListId(listId) {
    const query = `SELECT * FROM recipes_lists WHERE ListId LIKE ?`;
    const [rows] = await db.query(query, [listId]);
    return rows;  
}

async function getRecipesListsByRecipeIdAndListId(recipeId, listId) {
    const query = `SELECT * FROM recipes_lists WHERE RecipeId LIKE ? AND ListId LIKE ?`;
    const [rows] = await db.query(query, [recipeId, listId]);
    return rows;  
}

async function deleteRecipesListsByRecipeId(recipeId) {
    const query = `DELETE FROM recipes_lists WHERE RecipeId = ?`;
    return db.query(query, [recipeId]);  
}

async function addlist(listData) {
    try {
        const { id, userId } = listData;

        const query = `INSERT INTO lists (Id, UserId) VALUES (?, ?)`;

        const [results] = await db.query(query, [id, userId]);

        return { id: results.insertId, ...listData };
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        throw error;
    }
}

async function addToRecipeslists(recipesListsData) {
    try {
        const { recipeId, listId } = recipesListsData;

        const query = `INSERT INTO recipes_lists (RecipeId, ListId) VALUES (?, ?)`;

        const [results] = await db.query(query, [recipeId, listId]);

        return { id: results.insertId, ...recipesListsData };
    } catch (error) {
        console.error('Erro ao adicionar aos favoritos:', error);
        throw error;
    }
}

module.exports = {
    getRecipes,
    getRecipesByName,
    getRecipesByCategory,
    getRecipeById,
    getIngredientsByRecipeId,
    addUser,
    getUsers,
    getUserById,
    addlist,
    getRecipesByUserId,
    deleteRecipe,
    deleteIngredients,
    editRecipe,
    getListByUserId,
    addToRecipeslists,
    getRecipesListsByListId,
    getRecipesListsByRecipeIdAndListId,
    deleteRecipesListsByRecipeId,
    addRecipe,
    getRecipesByArea,
    getRecipesByAreaAndCategory,
};