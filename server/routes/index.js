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
app.get(process.env.BASE_URL + '/', (req, res) => {
    res.send("API dishes")
})

/**
 * Endpoint: Get all dishes
 */
app.get(process.env.BASE_URL + '/dishes', getDishes)

/**
 * Endpoint: Create dish
 */
app.post(process.env.BASE_URL + '/dish', [verifyToken], createDish)

/**
 * Endpoint: Get dish by id
 */
app.get(process.env.BASE_URL + '/dish/:id', getDishById)

/**
 * Endpoint: Update dish
 */
app.put(process.env.BASE_URL + '/dish/:id', [verifyToken], updateDish)

module.exports = app;