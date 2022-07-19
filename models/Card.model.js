const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const cardSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        stat: {
            type: String,
            enum: ['TODO', 'PROGRESS', 'DONE']
        }
    }
);
 
module.exports = model('Card', cardSchema);