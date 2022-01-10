const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const friendsRouter = require('./friends');
const requestsRouter = require('./requests');
const directmessagesRouter = require('./directmessages');
const roomsRouter = require('./rooms');

router.use('/users', usersRouter);
router.use('/friends', friendsRouter);
router.use('/requests', requestsRouter);
router.use('/directmessages', directmessagesRouter);
router.use('/rooms', roomsRouter);

router.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({
        error: {
            message
        }
    });
});

module.exports = router;