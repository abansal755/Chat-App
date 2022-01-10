const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const wrapAsync = require('../../utils/wrapAsync');
const Room = require('../../models/Room');
const AppError = require('../../utils/AppError');
const User = require('../../models/User');
const Friendship = require('../../models/Friendship');
const Message = require('../../models/Message');

router.get('/', middleware.ensureLogin, wrapAsync(async (req,res) => {
    const rooms = await Room.find({
        users: req.user._id
    }).populate('users');
    res.json(rooms.map(room => {
        return {
            id: room._id,
            title: room.title,
        }
    }))
}))

router.post('/', middleware.ensureLogin, wrapAsync(async (req,res) => {
    const {title, users = []} = req.body;
    if(typeof title !== 'string') throw new AppError('title must be a string', 400);
    if(!(users instanceof Array)) throw new AppError('users must be an array', 400);
    for(const id of users){
        const user = await User.findById(id);
        if(!user) throw new AppError('User not found', 400);
        const friendship = await Friendship.findOne({
            $or: [
                {
                    user1: req.user._id,
                    user2: user._id
                },
                {
                    user1: user._id,
                    user2: req.user._id
                }
            ]
        });
        if(!friendship) throw new AppError('Only allowed to add friends', 400);
    }
    
    const room = new Room({
        title,
        users: [req.user._id, ...users],
        admin: req.user._id
    });
    await room.save();
    res.json({
        id: room._id,
        title: room.title
    });

    // SocketIO
    for(const id of room.users){
        const recipientId = id.toString();
        if(recipientId === req.user._id.toString()) continue;
        const recipientSocketId = userIdToSocketIdMap.get(recipientId);
        if(recipientSocketId) io.to(recipientSocketId).emit('Rooms:CreateRoom', {
            id: room._id,
            title: room.title
        })
    }
}))

router.get('/:id', middleware.ensureLogin, middleware.authorizeRoom, wrapAsync(async (req,res) => {
    const {id} = req.params;
    const room = await Room.findById(id).populate('users');
    if(!room) throw new AppError('Room not found', 404);
    const users = room.users.map(user => {
        return {
            id: user._id,
            username: user.username
        }
    });
    for(let i = 0; i < users.length; i++){
        if(users[i].id.toString() === req.user._id.toString()) continue;
        const friendhsip = await Friendship.findOne({
            $or: [
                {
                    user1: req.user._id,
                    user2: users[i].id
                },
                {
                    user1: users[i].id,
                    user2: req.user._id
                }
            ]
        });
        if(friendhsip) users[i].isFriend = true;
        else users[i].isFriend = false;
        const recipient = await User.findById(users[i].id);
        if(recipient.requests.includes(req.user._id)) users[i].isRequestSent = true;
        else users[i].isRequestSent = false;
    }
    res.json({
        id: room._id,
        title: room.title,
        admin: room.admin,
        users
    })
}))

router.get('/:id/messages', middleware.ensureLogin, middleware.authorizeRoom, wrapAsync(async (req,res) => {
    const {id} = req.params;
    const room = await Room.findById(id).populate({
        path: 'messages',
        populate: {
            path: 'sender'
        }
    });
    res.json(room.messages.map(message => {
        return {
            id: message._id,
            text: message.text,
            timestamp: message.timestamp,
            sender: {
                id: message.sender._id,
                username: message.sender.username
            }
        }
    }));
}))

router.post('/:id/messages', middleware.ensureLogin, middleware.authorizeRoom, wrapAsync(async (req,res) => {
    const {id} = req.params;
    const {text} = req.body;
    if(typeof text !== 'string') throw new AppError('text must be a string', 400);
    const message = new Message({
        text,
        sender: req.user._id
    });
    await message.save();
    await Room.findByIdAndUpdate(id, {
        $push: {
            messages: message._id
        }
    });
    res.json({
        id: message._id,
        text: message.text,
        timestamp: message.timestamp
    });

    // SocketIO
    const room = await Room.findById(id);
    for(const recipient of room.users){
        const recipientId = recipient.toString();
        if(recipientId === req.user._id.toString()) continue;
        const recipientSocketId = userIdToSocketIdMap.get(recipientId);
        if(recipientSocketId) io.to(recipientSocketId).emit('Rooms:SendMessage', {
            room: {
                id,
                title: room.title
            },
            message: {
                id: message._id,
                text: message.text,
                timestamp: message.timestamp,
                sender: {
                    id: req.user._id,
                    username: req.user.username
                }
            }
        })
    }
}))

router.patch('/:id/users', middleware.ensureLogin, middleware.authorizeRoom, wrapAsync(async (req,res) => {
    const {id} = req.params;
    const {users = []} = req.body;
    const room = await Room.findById(id);
    if(room.admin.toString() !== req.user._id.toString()) throw new AppError('Only admin is allowed', 403);
    if(!(users instanceof Array)) throw new AppError('users must be an array', 400);
    for(const id of users){
        const user = await User.findById(id);
        if(!user) throw new AppError('User not found', 404);
        if(room.users.includes(id)) throw new AppError('User already present', 400);
        const friendship = await Friendship.findOne({
            $or: [
                {
                    user1: req.user._id,
                    user2: id
                },
                {
                    user1: id,
                    user2: req.user._id
                }
            ]
        });
        if(!friendship) throw new AppError('Only allowed to add friends', 400);
    }
    await Room.findByIdAndUpdate(id, {
        $push: {
            users: {
                $each: users
            }
        }
    });
    res.json({
        message: 'Added the users'
    });

    // SocketIO
    const socketUsers = [];
    for(const userId of users){
        const user = await User.findById(userId);
        socketUsers.push({
            id: user._id,
            username: user.username
        });
    }
    for(const recipient of room.users){
        const recipientId = recipient.toString();
        const recipientSocketId = userIdToSocketIdMap.get(recipientId);
        if(recipientSocketId) io.to(recipientSocketId).emit('Rooms:AddedUsers_ToAllUsers', {
            room: {
                id,
                title: room.title
            },
            users: socketUsers
        })
    }
    for(const recipient of users){
        const recipientId = recipient.toString();
        const recipientSocketId = userIdToSocketIdMap.get(recipientId);
        if(recipientSocketId) io.to(recipientSocketId).emit('Rooms:AddedUsers_ToNewUsers', {
            room: {
                id,
                title: room.title
            },
            users: socketUsers
        })
    }
}))

module.exports = router;