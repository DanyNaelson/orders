const Dish = require('./dish');
const Drink = require('./drink');
const Order = require('./order');

const createDishObject = (body) => {
    const nameNoAccents = body.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const nickname = nameNoAccents.replace(/[^A-Z0-9]/ig, '-').toLowerCase()
    const categoryNoAccents = body.category.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const nicknameCategory = categoryNoAccents.replace(/[^A-Z0-9]/ig, '-').toLowerCase()
    const category = {
        name: body.category.name,
        nickname: nicknameCategory,
        order: body.category.order
    }
    const newDish = new Dish({
        name: body.name,
        nickname,
        status: 'ACTIVE',
        picture: body.picture,
        category: category,
        price: body.price,
        description: body.description,
        extra_ingredients: {}
    })

    return newDish
}

const createDrinkObject = (body) => {
    const nameNoAccents = body.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const nickname = nameNoAccents.replace(/[^A-Z0-9]/ig, '-').toLowerCase()
    const categoryNoAccents = body.category.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const nicknameCategory = categoryNoAccents.replace(/[^A-Z0-9]/ig, '-').toLowerCase()
    const category = {
        name: body.category.name,
        nickname: nicknameCategory,
        order: body.category.order
    }
    const newDrink = new Drink({
        name: body.name,
        nickname,
        status: 'ACTIVE',
        picture: body.picture,
        category: category,
        price: body.price,
        description: body.description,
        specifications: body.specifications
    })

    return newDrink
}

const createOrderObject = (body, sequence) => {
    const { ownerId, orderItems } = body

    const newOrder = new Order({
        orderNum: sequence,
        status: "ORDERED",
        total: orderItems.reduce((a, b) => a + (b["total"] || 0), 0),
        ownerId,
        orderItems
    })

    return newOrder
}

module.exports = {
    createDishObject,
    createDrinkObject,
    createOrderObject
}