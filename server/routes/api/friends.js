const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const wrapAsync = require('../../utils/wrapAsync');
const Friendship = require('../../models/Friendship');

router.get('/', middleware.ensureLogin, wrapAsync(async (req,res) => {
    const friendships = await Friendship.find({
        $or: [{user1: req.user._id}, {user2: req.user._id}]
    }).populate('user1').populate('user2');
    res.json(friendships.map(friendship => {
        let key;
        if(friendship.user1._id.toString() !== req.user._id.toString()) key = 'user1';
        else key = 'user2';
        return {
            id: friendship[key]._id,
            username: friendship[key].username
        }
    }))
}))

module.exports = router;