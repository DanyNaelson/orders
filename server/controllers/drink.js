const _ = require('underscore');
const { requiredField } = require('../shared/fieldValidation');
const { createDrinkObject } = require('../models/actions')
const Drink = require('../models/drink');

/**
 * Get all drinks
 * @param {*} req 
 * @param {*} res 
 */
const getDrinks = (req, res) => {
    const query = req.query
    const drink = query.hasOwnProperty('drink') ? query.drink : null
    const category = query.hasOwnProperty('category') ? query.category : null
    let parameters = {}

    if(drink)
        parameters.nickname = new RegExp(drink, "i")

    if(category)
        parameters["category.nickname"] = category

    Drink.find(parameters)
        .exec((err, drinks) => {
            if(err)
                return res.status(400).json({ ok: false, err });

            res.json({
                ok: true,
                drinks,
                count: drinks.length
            })

        })
}

/**
 * Create drink
 * @param {*} req 
 * @param {*} res 
 */
const createDrink = (req, res) => {
    const body = req.body;

    /** Validate if the name field exists in the submitted body */
    validation = requiredField(body, 'name')
    if(!validation.ok)
        return res.status(400).json(validation)

    /** Validate if the category field exists in the submitted body */
    validation = requiredField(body, 'category')
    if(!validation.ok)
        return res.status(400).json(validation)

    /** Validate if the price field exists in the submitted body */
    validation = requiredField(body, 'price')
    if(!validation.ok)
        return res.status(400).json(validation)

    /** Validate if the description field exists in the submitted body */
    validation = requiredField(body, 'description')
    if(!validation.ok)
        return res.status(400).json(validation)

    /** Search drink in database */
    Drink.findOne({ name: body.name }, (err, drinkDB) => {
        if(err)
            return res.status(500).json({ ok: false, err })

        if(drinkDB){
            return res.status(400).json({ ok: false, message: 'registered_drink' })
        }

        /** Create drink */
        const newDrink = createDrinkObject(body);

        /** Save drink into database */
        newDrink.save((err, drinkDB) => {
            if(err)
                return res.status(400).json({ ok: false, err })
    
            /** Return drink data */
            res.json({ ok: true, drink: drinkDB })
        })
    })
}

/**
 * Get drink by id
 * @param {*} req 
 * @param {*} res 
 */
const getDrinkById = (req, res) => {
    const objectIdRegexp = new RegExp("^[0-9a-fA-F]{24}$");
    const id = req.params.id

    /** Check if id parameter is object id type or nickname */
    const isObjectId = objectIdRegexp.test(id)
    const query = isObjectId ? { _id: id } : { nickname: id }

    Drink.findOne(query)
        .exec((err, drink) => {
            if(err)
                return res.status(400).json({ ok: false, err });

            if(!drink)
                return res.status(404).json({ ok: false, message: 'drink_not_found' });

            if(drink.status === 'INACTIVE')
                return res.status(404).json({ ok: false, message: 'drink_not_found' });

            res.json({ ok: true, drink })
        })
}

/**
 * Update drink
 * @param {*} req 
 * @param {*} res 
 */
const updateDrink = (req, res) => {
    const id = req.params.id
    let body = _.pick(req.body, ['name', 'status', 'category', 'price', 'description', 'specifications'])

    if(body.name){
        const nameNoAccents = body.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const nickname = nameNoAccents.replace(/[^A-Z0-9]/ig, '-').toLowerCase();
        body.nickname = nickname
    }

    Drink.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, drink) => {
        if(err)
            return res.status(400).json({ ok: false, err })

        if(!drink){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'drink_not_found'
                }
            })
        }
        
        res.json({ ok: true, drink })
    })
}

module.exports = {
    getDrinks,
    createDrink,
    getDrinkById,
    updateDrink
}