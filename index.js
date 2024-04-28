//dependencies
require('dotenv').config()

const express = require('express')
const app = express();
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

//variables
const port = process.env.PORT || 3000;

// Socket io
io.on('connection', socket => {
    const socketId = socket.id
    const userId = socket.handshake.query.userId
    
    console.log(`a new socket connection (${userId})`);

    socket.on('disconnect',(event)=>{
        console.log(`user (${userId}) disconnected!`);
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