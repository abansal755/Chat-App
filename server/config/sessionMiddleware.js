const MongoStore = require("connect-mongo");
const session = require("express-session");
const database = require('./database');

module.exports = session({
    name: 'session',
    secret: process.env.COOKIE_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 30*24*60*60*1000
    },
    store: MongoStore.create({
        mongoUrl: database.dbUrl,
        crypto: {
            secret: process.env.STORE_SECRET || 'secret2'
        }
    })
})