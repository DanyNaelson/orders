const _ = require('underscore');
const { requiredField } = require('../shared/fieldValidation');
const { createOrderObject } = require('../models/actions');
const Order = require('../models/order');

/**
 * Create order
 * @param {*} req 
 * @param {*} res 
 */
const createOrder = (req, res) => {
    const { orderItems} = req.body

    /** Validate if ownerId field exists in the submitted body */
    validation = requiredField(req.body, 'ownerId')
    if(!validation.ok)
        return res.status(400).json(validation)

    /** Validate if orderItems field exists in the submitted body */
    validation = requiredField(req.body, 'orderItems')
    if(!validation.ok)
        return res.status(400).json(validation)

    if(orderItems.length === 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: "items_order_required",
                field: "order_items",
                required: true
            }
        })

    Order.estimatedDocumentCount({}, function(err, count) {
        if(err){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "error_getting_orders"
                }
            })
        }

        /** Create order */
        const newOrder = createOrderObject(req.body, count + 1);

        /** Save order into database */
        newOrder.save((err, orderDB) => {
            if(err)
                return res.status(400).json({ ok: false, err })

            /** Return drink data */
            res.json({ ok: true, orderDB: orderDB })
        })
    })
}

/**
 * Create order
 * @param {*} req 
 * @param {*} res 
 */
const getOrdersByUser = (req, res) => {
    const ownerId = req.params.ownerId
    let parameters = {
        ownerId: ownerId
    }

    Order.find(parameters)
        .exec((err, orders) => {
            if(err)
                return res.status(400).json({ ok: false, err });

            res.json({
                ok: true,
                orders,
                count: orders.length
            })

        })
}

module.exports = {
    createOrder,
    getOrdersByUser
}