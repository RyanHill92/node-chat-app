var socket = io();
socket.on('connect', () => {
  console.log('Connected to server.');
});
//The listener can hang out here.
socket.on('newMessage', (data) => {
  console.log('Incoming message.', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
