const path = require('path');
//Another built-in node module.
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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
  //The socket arg above lets us call socket.on here just like we did in the .html file.
  socket.emit('newMessage', {
    from: 'Server',
    text: 'Client, your friend in a far-away place says \'Hello.\'',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (data) => {
    console.log('Client has sent new message.', data);
  });

  socket.on('disconnect', () => {
    console.log('Client has disconnected.');
  });
});


server.listen(port, () => {
  console.log(`Server up on Port ${port}`);
});
