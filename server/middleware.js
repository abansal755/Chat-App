const DirectMessage = require("./models/DirectMessage");
const Room = require("./models/Room");
const AppError = require("./utils/AppError");
const wrapAsync = require("./utils/wrapAsync");

exports.ensureLogin = (req,res,next) => {
    if(req.isAuthenticated()) next();
    else throw new AppError('You must be logged in', 401);
}

exports.ensureNoLogin = (req,res,next) => {
    if(!req.isAuthenticated()) next();
    else throw new AppError('You must be logged out',403);
}

exports.authorizeDirectMessage = wrapAsync(async (req,res,next) => {
    const {id} = req.params;
    const dm = await DirectMessage.findById(id).populate('user1').populate('user2');
    if(!dm) throw new AppError('Not found', 404);
    if((req.user._id.toString() !== dm.user1._id.toString()) && (req.user._id.toString() !== dm.user2._id.toString()))
        throw new AppError('Unauthorized', 403);
    next();
})

exports.authorizeRoom = wrapAsync(async (req,res,next) => {
    const {id} = req.params;
    const room = await Room.findById(id);
    if(!room) throw new AppError('Room not found', 404);
    if(!room.users.includes(req.user._id)) throw new AppError('Unauthorized', 403);
    next();
})