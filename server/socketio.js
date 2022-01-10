const {Server} = require('socket.io');
const wrapMiddleware = require('./utils/wrapMiddleware');
const sessionMiddleware = require('./config/sessionMiddleware');
const passport = require('passport');

module.exports = httpServer => {
    global.io = new Server(httpServer);
    io.use(wrapMiddleware(sessionMiddleware));
    io.use(wrapMiddleware(passport.initialize()));
    io.use(wrapMiddleware(passport.session()));
    io.use((socket,next) => {
        if(socket.request.isAuthenticated()) return next();
        throw new Error('You must be logged in');
    });

    global.userIdToSocketIdMap = new Map();

    io.on('connection', socket => {
        userIdToSocketIdMap.set(socket.request.user._id.toString(), socket.id);
        
        socket.on('disconnect', () => {
            userIdToSocketIdMap.delete(socket.request.user._id);
        })
    })
}