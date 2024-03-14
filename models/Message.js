// message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    author: String,
    message: String,
    image: String,
    time: String,
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    }
});


const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
