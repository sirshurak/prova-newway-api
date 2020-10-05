/**
 * Modelo para o MongoDB: Product
 */

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const ProductSchema = mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [String],
    avaliations: [{
        id: {
            type: mongoose.ObjectId
        },
        date: {
            type: Date,
            default: Date.now
        },
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            required: true
        },        
        description: {
            type: String
        }
    }]
});

// Inicilização do plugin de auto incremento
autoIncrement.initialize(mongoose);

// Adicionando plugin de auto incremento
ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', startAt: 10000 });

module.exports = mongoose.model('Product', ProductSchema);