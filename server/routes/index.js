const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/authentication');
const {
    getDishes,
    createDish,
    getDishById,
    updateDish
} = require('../controllers/dish');

/**
 * Endpoint: API Dishes
 */
app.get('/', (req, res) => {
    res.send("API dishes")
})

/**
 * Endpoint: Get all dishes
 */
app.get('/dishes', getDishes)

/**
 * Endpoint: Create dish
 */
app.post('/dish', [verifyToken], createDish)

/**
 * Endpoint: Get dish by id
 */
app.get('/dish/:id', getDishById)

/**
 * Endpoint: Update dish
 */
app.put('/dish/:id', [verifyToken], updateDish)

module.exports = app;