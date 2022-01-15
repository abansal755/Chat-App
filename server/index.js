require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
const PassportLocal = require('passport-local');
const User = require('./models/User');
const apiRouter = require('./routes/api');
const path = require('path');
const sessionMiddleware = require('./config/sessionMiddleware');
const socketio = require('./socketio');
const https = require('https');
const fs = require('fs');

const database = require('./config/database');
database.connect();

app.use(express.json());

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api',apiRouter);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../client/build')));
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname,'../client/build/index.html'));
    });
}

const PORT = process.env.PORT || 4000;
let httpServer;
if(process.env.NODE_ENV === 'production'){
    httpServer = https.createServer({
        key: fs.readFileSync(path.join(__dirname, '../cert/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../cert/cert.pem'))
    }, app);
    httpServer.listen(PORT,() => console.log(`Server is running on port ${PORT}...`));
}
else httpServer = app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));

socketio(httpServer);