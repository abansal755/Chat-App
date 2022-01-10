const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const wrapAsync = require('../../utils/wrapAsync');
const DirectMessage = require('../../models/DirectMessage');
const AppError = require('../../utils/AppError');
const User = require('../../models/User');
const Friendship = require('../../models/Friendship');
const Message = require('../../models/Message');

router.get('/', middleware.ensureLogin, wrapAsync(async (req,res) => {
    const dms = await DirectMessage.find({
        $or: [{user1: req.user._id}, {user2: req.user._id}]
    }).populate('user1').populate('user2');
    res.json(dms.map(dm => {
        let key;
        if(req.user._id.toString() !== dm.user1._id.toString()) key = 'user1';
        else key = 'user2';
        return {
            id: dm._id,
            recipient: {
                id: dm[key]._id,
                username: dm[key].username
            }
        }
    }));
}))

router.post('/', middleware.ensureLogin, wrapAsync(async (req,res) => {
    const {recipient: recipientId} = req.body;
    if(typeof recipientId !== 'string')
        throw new AppError('Value of recipient must be the id of the user with whom you want to create a direct message', 400);
    const recipient = await User.findById(recipientId);
    if(!recipient) throw new AppError('User not found', 404);
    const friendship = await Friendship.findOne({
        $or: [
            {
                user1: req.user._id,
                user2: recipientId
            },
            {
                user1: recipientId,
                user2: req.user._id
            }
        ]
    });
    if(!friendship) throw new AppError('Direct message can only be created with a friend');
    let dm = await DirectMessage.findOne({
        $or: [
            {
                user1: req.user._id,
                user2: recipientId
            },
            {
                user1: recipientId,
                user2: req.user._id
            }
        ]
    });
    if(dm) return res.json({
        id: dm._id,
        message: 'Direct message already created'
    });
    dm = new DirectMessage({
        user1: req.user._id,
        user2: recipientId
    });
    await dm.save();
    res.json({
        id: dm._id,
        message: 'Direct message created'
    });

    // SocketIO
    const recipientSocketId = userIdToSocketIdMap.get(recipientId);
    io.to(recipientSocketId).emit('DirectMessages:CreateDM', {
        id: dm._id,
        recipient: {
            id: recipientId,
            username: recipient.username
        }
    })
}))

router.get('/:id', middleware.ensureLogin, middleware.authorizeDirectMessage, wrapAsync(async (req,res) => {
    const {id} = req.params;
    const dm = await DirectMessage.findById(id).populate({
        path: 'messages',
        populate: {
            path: 'sender'
        }
    }).populate('user1').populate('user2');
    const messages = dm.messages.map(message => {
        return {
            id: message._id,
            text: message.text,
            timestamp: message.timestamp,
            sender: {
                id: message.sender._id,
                username: message.sender.username
            }
        }
    });

    let key;
    if(req.user._id.toString() === dm.user1._id.toString()) key = 'user2';
    else key = 'user1';
    res.json({
        id,
        recipient: {
            id: dm[key]._id,
            username: dm[key].username
        },
        messages
    });
}))

router.post('/:id', middleware.ensureLogin, middleware.authorizeDirectMessage, wrapAsync(async (req,res) => {
    const {id} = req.params;
    const {text} = req.body;
    if(typeof text !== 'string') throw new AppError('text must be a string', 400);
    const message = new Message({
        text,
        sender: req.user._id
    });
    await message.save();
    await DirectMessage.findByIdAndUpdate(id, {
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
    const dm = await DirectMessage.findById(id);
    let recipientId;
    if(dm.user1.toString() === req.user._id.toString()) recipientId = dm.user2;
    else recipientId = dm.user1;
    const recipientSocketId = userIdToSocketIdMap.get(recipientId.toString());
    if(recipientSocketId) io.to(recipientSocketId).emit('DirectMessages:SendMessage', {
        directMessageId: id,
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
}))

module.exports = router;