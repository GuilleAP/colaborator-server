const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const chatSchema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    
    {
        timestamps: true
    }
);
 
module.exports = model('Chat', chatSchema);