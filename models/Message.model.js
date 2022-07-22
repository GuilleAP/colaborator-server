const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        text: String,
        chatId: { type: Schema.Types.ObjectId, ref: "Chat" },


    },
    {
        timestamps: true
    }
);
 
module.exports = model('Message', messageSchema);