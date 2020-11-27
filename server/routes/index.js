const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/authentication');
const {
    getDishes,
    createDish,
    getDishById,
    updateDish
} = require('../controllers/dish');
const {
    getDrinks,
    createDrink,
    getDrinkById,
    updateDrink
} = require('../controllers/drink');
const {
    createOrder,
    getOrdersByUser
} = require('../controllers/order');

/**
 * Endpoint: API Dishes
 */
app.get(process.env.BASE_URL + '/', (req, res) => {
    res.send("API Menu")
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

/**
 * Endpoint: Get all drinks
 */
app.get(process.env.BASE_URL + '/drinks', getDrinks)

/**
 * Endpoint: Create drink
 */
app.post(process.env.BASE_URL + '/drink', [verifyToken], createDrink)

/**
 * Endpoint: Get drink by id
 */
app.get(process.env.BASE_URL + '/drink/:id', getDrinkById)

/**
 * Endpoint: Update drink
 */
app.put(process.env.BASE_URL + '/drink/:id', [verifyToken], updateDrink)

/**
 * Endpoint: Save favorite drinks and favorite dishes
 */
app.post(process.env.BASE_URL + '/order', [verifyToken], createOrder)

/**
 * Endpoint: Get orders by user
 */
app.get(process.env.BASE_URL + '/orders/user/:ownerId', [verifyToken], getOrdersByUser)

module.exports = app;