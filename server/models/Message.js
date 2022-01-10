const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: () => new Date()
    },
    text: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Message', messageSchema);