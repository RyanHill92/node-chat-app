var socket = io();
socket.on('connect', () => {
  console.log('Connected to server.');
  //Notice that we must wrap this emitter in our 'connect' listener for it ever to register.
  socket.emit('createMessage', {
    from: 'Client',
    text: 'Server, please tell my friend to be here at 7:00pm.'
  });
});
//The listener can hang out here.
socket.on('newMessage', (data) => {
  console.log('Incoming message from the server.', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
