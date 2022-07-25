const mongoose = require('mongoose');
const { Schema, model } = mongoose;
 
const daySchema = new Schema(
    {
        date: {
            type: String,
            required: true,
            unique: true
        },

        events: [{ type: Schema.Types.ObjectId, ref: "Event" }],

        isCurrentMonth: {
            type: Boolean
            
        },

        isToday: {
            type: Boolean
        },

        isSelected: {
            type: Boolean
        }

    }
);
 
module.exports = model('Day', daySchema);