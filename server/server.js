const path = require('path');
//Another built-in node module.
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

//Notice how the hop back a folder is cleared out.
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
console.log(publicPath);

const app = express();
//Note the slight change to make room for socket.io.
const server = http.createServer(app);
//Creating our web sockets server, which we'll use to communicate
//between Express server and client.
const io = socketIO(server);

//Must call express.static inside app.use.
app.use(express.static(publicPath));

//Several built-in events one can listen for, like a connection to the socket.io server.
//This message prints to my terminal every time I refresh @ the localhost3000.
io.on('connection', (socket) => {
  console.log('New client connected.');
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat room!'));
  //I had used separate custom event types here, but no need!
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has entered the chat room.'));

  //The listener expects a callback to come with the event emission.
  //It will call this function as ACKNOWLEDGEMENT of the event.
  socket.on('createMessage', (message, callback) => {
    callback('Data received.');
    io.emit('newMessage', generateMessage(message.from, message.text));
  });

  socket.on('createLocationMessage', function (location) {
    io.emit('newLocationMessage', generateLocationMessage('Admin', location.latitude, location.longitude));
  });

  socket.on('disconnect', () => {
    console.log('Client has disconnected.');
  });
});


server.listen(port, () => {
  console.log(`Server up on Port ${port}`);
});
