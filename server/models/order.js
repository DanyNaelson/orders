const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validStatus = {
    values: ['ORDERED', 'CANCELED', 'CONFIRMED', 'DELIVERED', 'PAID'],
    message: 'invalid_status'
}

let validTypes = {
    values: ['DISH', 'DRINK'],
    message: 'invalid_type'
}

let Schema = mongoose.Schema;
let orderItem = new Schema({
    id: {
        type: String,
        required: [true, 'id_required']
    },
    name: {
        type: String,
        required: [true, 'name_required']
    },
    picture: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: [true, 'type_required'],
        default: 'DISH',
        enum: validTypes
    },
    quantity: {
        type: Number,
        required: [true, 'quantity_required']
    },
    price: {
        type: Number,
        required: [true, 'price_required']
    },
    total: {
        type: Number,
        required: [true, 'total_required']
    },
    specifications: {
        type: String,
        required: false
    }
},{ _id : false })

let orderSchema = new Schema({
    orderNum: {
        type: String,
        required: [true, 'name_required']
    },
    status: {
        type: String,
        required: [true, 'status_required'],
        default: 'ACTIVE',
        enum: validStatus
    },
    total: {
        type: Number,
        required: [true, 'total_required']
    },
    ownerId: {
        type: String,
        required: [true, 'owner_required']
    },
    orderItems: {
        type: [ orderItem ]
    },
},
{
    timestamps: true
})

orderSchema.pre('findOneAndUpdate', function(next) {
    this.update({}, { $set: { updatedAt: new Date() } });
    next()
})

orderSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
})

module.exports = mongoose.model('Order', orderSchema);