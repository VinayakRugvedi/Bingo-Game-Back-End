const express = require('express')

const PORT = 8000
const app = express()
const server = app.listen(PORT, () => console.log(`Started to listen on PORT : ${PORT}`))

var roomNO = 1

const io = require('socket.io')(server)

io.on('connection', function(socket) {
  console.log('A Client connected!')

  if(io.sockets.adapter.rooms['bingo' + roomNO]) {
    var roomLength = io.sockets.adapter.rooms['bingo' + roomNO].length
    if(roomLength === 2) roomNO+=1
  }

  socket.join('bingo'+roomNO)
  socket.roomNO = roomNO
  socket.emit('sendRoomName', {roomName : 'bingo'+roomNO})
  if(io.sockets.adapter.rooms['bingo' + roomNO].length === 2) {
    io.in('bingo' + roomNO).emit('playerAvailable', {size : io.sockets.adapter.rooms['bingo' + roomNO].length})
  }

  socket.on('myValue', function(number, room) {
    console.log(`I recieved the number ${number} to be sent to ${room}`)
    socket.in(room).emit('update', {value : number})
  })

  socket.on('winner', () => {
    socket.in('bingo'+socket.roomNO).emit('lost')
  })

  socket.on('disconnect', () => {
    console.log('The player is disconnected')
    io.in('bingo'+socket.roomNO).emit('playerDisconnected')
  })
})
