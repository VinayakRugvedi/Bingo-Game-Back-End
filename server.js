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
    // console.log(roomLength)
    if(roomLength === 2) roomNO+=1
  }
  console.log('bingo'+roomNO)
  socket.join('bingo'+roomNO)
  socket.emit('sendRoom', {room : 'bingo'+roomNO})
  socket.on('myValue', function(number, room) {
    console.log(`I recieved the number ${number} to be sent to` + room)

    socket.in(room).emit('update', {value : number})
  })
})
