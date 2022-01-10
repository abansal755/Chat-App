module.exports = middleware => {
    return (socket,next) => {
        middleware(socket.request, {}, next);
    }
}