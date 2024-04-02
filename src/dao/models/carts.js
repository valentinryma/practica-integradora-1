const mongoose = require('mongoose');

const collection = 'carts';

const prodcutSchema = new mongoose.Schema({
    productId: { type: Number, require: true },
    quantity: { type: Number, require: true, default: 1 }
})

const schema = new mongoose.Schema({
    products: [prodcutSchema],
})


// Virtual
schema.virtual('id').get(function () {
    return this._id.toString();
});

module.exports = mongoose.model('Cart', schema, collection)