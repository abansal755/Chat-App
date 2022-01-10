const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);