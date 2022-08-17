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

        limitDate: {
            type: String
        },

        project: { type: Schema.Types.ObjectId, ref: "Project" }

    }
);
// cardSchema.index({ title: 1, project: 1}, { unique: true });

 
module.exports = model('Card', cardSchema);