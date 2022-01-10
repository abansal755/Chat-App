const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL || 'mongodb://localhost/chat-app';

exports.connect = async () => {
    await mongoose.connect(dbUrl);
    console.log('MongoDB is running...');
}

exports.dbUrl = dbUrl;