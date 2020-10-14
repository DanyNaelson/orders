const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validStatus = {
    values: ['ACTIVE', 'INACTIVE'],
    message: 'invalid_status'
}
let Schema = mongoose.Schema;
let drinkSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name_required']
    },
    nickname: {
        type: String,
        required: [true, 'nickname_required']
    },
    status: {
        type: String,
        required: [true, 'status_required'],
        default: 'ACTIVE',
        enum: validStatus
    },
    picture: {
        type: String,
        required: false,
        default: ''
    },
    category: {
        name: {
            type: String,
            required: [true, 'category_name_required']
        },
        nickname: {
            type: String,
            required: [true, 'category_nickname_required']
        },
        order: {
            type: Number,
            required: [true, 'category_order_required']
        }
    },
    price: {
        type: Number,
        required: [true, 'price_required']
    },
    description: {
        type: String,
        required: [true, 'description_required']
    },
    specifications: {
        type: String
    }
})

drinkSchema.methods.toJSON = function() {
    let drink = this;
    let drinkObject = drink.toObject();

    return drinkObject;
}

drinkSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
})

module.exports = mongoose.model('Drink', drinkSchema);