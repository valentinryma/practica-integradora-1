const mongoose = require('mongoose');

const collection = 'messages';

const schema = new mongoose.Schema({
    user: { type: String, require: true },
    message: { type: String, require: true }
})

module.exports = mongoose.model('Message', schema, collection)