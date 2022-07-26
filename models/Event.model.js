const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const eventSchema = new Schema(
    {
        title: {
            type: String,
        },

        start: {
            type: String    
        },

        end: {
            type: String
        },

        color: {
            type: String
        }

    }
);
 
module.exports = model('Event', eventSchema);