const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validStatus = {
    values: ['ACTIVE', 'INACTIVE'],
    message: 'invalid_role'
}
let Schema = mongoose.Schema;
let dishSchema = new Schema({
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
    extra_ingredients: {
        name: {
            type: String
        },
        quantity: {
            type: Number
        }
    }
})

dishSchema.methods.toJSON = function() {
    let dish = this;
    let dishObject = dish.toObject();

    return dishObject;
}

dishSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
})

module.exports = mongoose.model('Dish', dishSchema);