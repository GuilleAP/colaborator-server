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
        },

        color: {
            type: String,
            enum:['white', 'blue', 'red', 'yellow', 'gray', 'orange', 'green']
        },

        project: { type: Schema.Types.ObjectId, ref: "Project" }

    }
);
 
module.exports = model('Card', cardSchema);