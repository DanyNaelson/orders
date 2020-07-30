const Dish = require('./dish');

const createDishObject = (body) => {
    const nameNoAccents = body.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const nickname = nameNoAccents.replace(/[^A-Z0-9]/ig, '-').toLowerCase();
    const newDish = new Dish({
        name: body.name,
        nickname,
        status: 'ACTIVE',
        picture: 'url_dish',
        category: body.category,
        price: body.price,
        description: body.description,
        extra_ingredients: {}
    })

    return newDish
}

module.exports = {
    createDishObject
}