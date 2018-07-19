var socket = io();
socket.on('connect', () => {
  console.log('Connected to server.');
  // //The emitter sends along a function.
  // //If it fires, the emitter knows it event has been acknowledged.
  // socket.emit('createMessage', {from: 'Client', text: 'Say hi to my friends, please.'}, function (data) {
  //   console.log(data);
  // });
});

socket.on('newMessage', (message) => {
  let time = moment(message.createdAt).format('h:mm a');
  let li = document.createElement('li');
  li.innerHTML = message.from + ', ' + '<em>' + time + '</em>' + ': ' + message.text;
  document.querySelector('#messages').appendChild(li);
});

socket.on('newLocationMessage', function(locationMessage) {
  let time = moment(locationMessage.createdAt).format('h:mm a');
  let li = document.createElement('li');
  let a = document.createElement('a');
  a.setAttribute('target', '_blank');
  a.setAttribute('href', locationMessage.url);
  li.innerHTML = locationMessage.from + ', ' + '<em>' + time + '</em>' + ': Check out my current ';
  a.innerHTML = 'location.';
  li.appendChild(a);
  document.querySelector('#messages').appendChild(li);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});

var messageForm = document.getElementById('message-form');
//The e (event) argument is crucial for overriding default behavior.
//It seems that 'submit' is a built-in event for forms. Nice.
//Notice here, because it's a form, we have 'submit,' not 'click.'

var messageTextBox = document.querySelector('input[name=message]');

messageForm.addEventListener('submit', function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    //Name of element, with attribute and value inside brackets.
    //It seems '.value' is a property of the element. Cool!
    text: messageTextBox.value
  }, function (data) {
    messageTextBox.value = '';
  });
});

var locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation unavailable on current browser.');
  }

  locationButton.setAttribute('disabled', 'disabled');
  locationButton.innerHTML = 'Sending location...'

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {latitude: position.coords.latitude, longitude: position.coords.longitude});
    locationButton.innerHTML = 'Send location'
    locationButton.removeAttribute('disabled');
  }, function () {
    return alert('Unable to share location.');
    locationButton.removeAttribute('disabled');
  });
});
