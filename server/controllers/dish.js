const _ = require('underscore');
const { requiredField } = require('../shared/fieldValidation');
const { createDishObject } = require('../models/actions')
const Dish = require('../models/dish');

/**
 * Get all dishes
 * @param {*} req 
 * @param {*} res 
 */
const getDishes = (req, res) => {
    Dish.find({})
        .exec((err, dishes) => {
            if(err)
                return res.status(400).json({ ok: false, err });

            Dish.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    dishes,
                    count
                })
            })

        })
}

/**
 * Create dish
 * @param {*} req 
 * @param {*} res 
 */
const createDish = (req, res) => {
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

    /** Search dish in database */
    Dish.findOne({ name: body.name }, (err, dishDB) => {
        if(err)
            return res.status(500).json({ ok: false, err })

        if(dishDB){
            return res.status(400).json({ ok: false, message: 'registered_dish' })
        }

        /** Create dish */
        const newDish = createDishObject(body);

        /** Save dish into database */
        newDish.save((err, dishDB) => {
            if(err)
                return res.status(400).json({ ok: false, err })
    
            /** Return user data */
            res.json({ ok: true, dish: dishDB })
        })
    })
}

/**
 * Get user by id
 * @param {*} req 
 * @param {*} res 
 */
const getDishById = (req, res) => {
    const objectIdRegexp = new RegExp("^[0-9a-fA-F]{24}$");
    const id = req.params.id

    /** Check if id parameter is object id type or nickname */
    const isObjectId = objectIdRegexp.test(id)
    const query = isObjectId ? { _id: id } : { nickname: id }

    Dish.findOne(query)
        .exec((err, dish) => {console.log()
            if(err)
                return res.status(400).json({ ok: false, err });

            if(!dish)
                return res.status(404).json({ ok: false, message: 'dish_not_found' });

            if(dish.status === 'INACTIVE')
                return res.status(404).json({ ok: false, message: 'dish_not_found' });

            res.json({ ok: true, dish })
        })
}

/**
 * Update user
 * @param {*} req 
 * @param {*} res 
 */
const updateDish = (req, res) => {
    const id = req.params.id
    let body = _.pick(req.body, ['name', 'status', 'category', 'price', 'description'])

    if(body.name){
        const nameNoAccents = body.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const nickname = nameNoAccents.replace(/[^A-Z0-9]/ig, '-').toLowerCase();
        body.nickname = nickname
    }

    Dish.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, dish) => {
        if(err)
            return res.status(400).json({ ok: false, err })

        if(!dish){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'dish_not_found'
                }
            })
        }
        
        res.json({ ok: true, dish })
    })
}

module.exports = {
    getDishes,
    createDish,
    getDishById,
    updateDish
}