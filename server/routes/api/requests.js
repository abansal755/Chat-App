const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const AppError = require('../../utils/AppError');
const wrapAsync = require('../../utils/wrapAsync');
const User = require('../../models/User');
const Friendship = require('../../models/Friendship');

router.get('/', middleware.ensureLogin, wrapAsync(async (req,res) => {
    await req.user.populate('requests');
    res.json(req.user.requests.map(user => {
        return {
            id: user._id,
            username: user.username
        }
    }))
}))

router.post('/', middleware.ensureLogin, wrapAsync(async (req,res) => {
    const {username} = req.body;
    if(typeof username !== 'string') throw new AppError('Username must be a string', 400);
    const user = await User.findOne({
        username
    })
    if(!user) throw new AppError('User not found', 404);
    const id = user._id.toString();
    if(id === req.user._id.toString()) throw new AppError('Cannot send request to yourself', 400);
    const recepient = await User.findById(id);
    if(!recepient) throw new AppError('User not found', 404);
    if(recepient.requests.includes(req.user._id)) throw new AppError('Request already sent', 400);
    const friendship = await Friendship.findOne({
        $or: [
            {
            user1: id,
            user2: req.user._id
            },
            {
                user1: req.user._id,
                user2: id
            }
        ]
    })
    if(friendship) throw new AppError('Already friends', 400);
    await User.findByIdAndUpdate(id, {
        $push: {
            requests: req.user._id
        }
    })
    res.json({
        message: 'Request sent'
    })

    // SocketIO
    const recipientSocketId = userIdToSocketIdMap.get(id);
    if(recipientSocketId) io.to(recipientSocketId).emit('Requests:SendRequest', {
        id: req.user._id,
        username: req.user.username
    })
}))

router.post('/:id/respond', middleware.ensureLogin, wrapAsync(async (req,res) => {
    const {id} = req.params;
    const {accept} = req.body;
    if(typeof accept !== 'boolean') throw new AppError('accept must be a boolean', 400);
    if(!req.user.requests.includes(id)) throw new AppError('Request not found', 404);
    await User.findByIdAndUpdate(req.user._id, {
        $pull: {
            requests: id
        }
    });
    if(accept){
        const friendship = new Friendship({
            user1: req.user._id,
            user2: id
        });
        await friendship.save();
        res.json({
            message: 'Request accepted'
        })
    }
    else res.json({
        message: 'Request rejected'
    })

    // SocketIO
    const recipientSocketId = userIdToSocketIdMap.get(id);
    if(accept){
        if(recipientSocketId) io.to(recipientSocketId).emit('Requests:AcceptedRequest', {
            id: req.user._id,
            username: req.user.username
        })
    }
    else {
        if(recipientSocketId) io.to(recipientSocketId).emit('Requests:RejectedRequest', {
            id: req.user._id,
            username: req.user.username
        })
    }
}))

module.exports = router;