//dependencies
require('dotenv').config()

const express = require('express')
const app = express();
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

//variables
const port = process.env.PORT || 3000;
const users = []

// Socket io
io.on('connection', socket => {
    const socketId = socket.id
    const userId = socket.handshake.query.userId
    users.push({ User_Id: userId, Socket_Id: socketId })

    console.log(`a new socket connection (${userId})`);
    // Join A Person To A New Room
    socket.on('join-room', (event) => {
        socket.join(`ROOMID:: ${event.roomId}`)
        console.log(`user ${userId} Join to a room ${event.roomId}`);

    })

    // leave A Person from a Room
    socket.on('leave-room', (event) => {
        socket.leave(`ROOMID:: ${event.roomId}`)
        console.log(`user ${userId} left from room ${event.roomId}`);

    })

    //Send Message indiviual 

    socket.on('send-message', (event) => {
        console.log(`user ${userId} sent a message to ${event.to} > ${event.message}`);
        const filteredUsers = users.filter((elem) => elem.User_Id == event.to)

        const receiverSocketId = filteredUsers[0].Socket_Id
        socket.broadcast.to(receiverSocketId).emit('onMessage', {
            'message': event.message,
            'from': userId
        })

    })
    //Discconnect
    socket.on('disconnect', (event) => {
        console.log(`user (${userId}) disconnected!`);
        const index = users.filter((elem) => elem.userid == userId)

        users.slice(index, 1)
    })
})


//Restfull Apis
app.get('/', (req, res) => {
    res.send(`<h1>Hello Websocket!!</h1>`)
})
//Server Listner
server.listen(port, () => {
    console.log(`Server in running on port: ${port}`);
})