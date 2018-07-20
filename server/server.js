const path = require('path');
//Another built-in node module.
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validator');
const {Users} = require('./utils/users');

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
//We'll use just ONE instance, since we can filter by room.
const users = new Users();

//Must call express.static inside app.use.
app.use(express.static(publicPath));

//Several built-in events one can listen for, like a connection to the socket.io server.
//This message prints to my terminal every time I refresh @ the localhost3000.
io.on('connection', (socket) => {
  //The event, and a function with the incoming data and callback functionality as args.
  socket.on('join', (params, callback) => {
    if (users.users.filter((user) => user.name == params.name && user.room == params.room).length !== 0) {
      return callback('Name already taken.');
    } else if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name required.');
    } else {
      //With no args, callback() just prints 'No error.' on user console.
      callback();
      socket.join(params.room);
      //Make sure to clear that user off list to avoid duplication, if was in other room before.
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat room!'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', params.name + ' has entered the chat room.'));
    }
  });

  //The listener expects a callback to come with the event emission.
  //It will call this function as ACKNOWLEDGEMENT of the event.
  socket.on('createMessage', (message, callback) => {
    //Clears the message form.
    callback();
    //Emits the submitted message as newMessage, if not blank.
    if (isRealString(message.text)) {
      io.to(message.room).emit('newMessage', generateMessage(message.from, message.text));
    };
  });

  socket.on('createLocationMessage', function (location) {
    io.to(location.room).emit('newLocationMessage', generateLocationMessage(location.from, location.latitude, location.longitude));
  });

  socket.on('disconnect', () => {
    console.log('Client has disconnected.');
    var departingUser = users.removeUser(socket.id);

    //Want to make sure this person actually joined a room.
    if (departingUser) {
      io.to(departingUser.room).emit('newMessage', generateMessage('Admin', departingUser.name + ' has left the chat room.'))
      io.to(departingUser.room).emit('updateUserList', users.getUserList(departingUser.room));
    };
  });
});


server.listen(port, () => {
  console.log(`Server up on Port ${port}`);
});
