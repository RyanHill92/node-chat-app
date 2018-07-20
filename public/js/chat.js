var socket = io();

function scrollToBottom () {
  //Selectors.
  var messages = document.querySelector('#messages');
  var newMessage = messages.lastElementChild;
  var lastMessage = newMessage.previousElementSibling;
  //Heights.
  var clientHeight = messages.clientHeight;
  var scrollTop = messages.scrollTop;
  var scrollHeight = messages.scrollHeight;
  //Returns an object with all this element's CSS styling key-value pairs.
  var newMessageStyle = window.getComputedStyle(newMessage, null);
  var newMessageHeight = parseInt(newMessageStyle.getPropertyValue('height'));

  if (lastMessage) {
    var lastMessageStyle = window.getComputedStyle(lastMessage, null);
    var lastMessageHeight = parseInt(lastMessageStyle.getPropertyValue('height'));
  } else {
    lastMessageHeight = 0;
  }

  if (clientHeight + scrollTop >= scrollHeight - lastMessageHeight - newMessageHeight) {
    messages.scrollTop = scrollHeight;
  }
};

socket.on('connect', () => {
  console.log('Connected to server.');
  // //The emitter sends along a function.
  // //If it fires, the emitter knows it event has been acknowledged.
  // socket.emit('createMessage', {from: 'Client', text: 'Say hi to my friends, please.'}, function (data) {
  //   console.log(data);
  // });
  var params = jQuery.deparam(window.location.search);
  //The event, the data to send, and the callback for the listener to fire as acknowledgement.
  socket.emit('join', params, function (err) {
    //If callback has an argument, the error case here will fire.
    if (err) {
      alert(err);
      //Cool! A way to redirect a user.
      window.location.href = '/';
    } else {
      console.log('No error.');
    }
  });
});

socket.on('newMessage', (message) => {
  //Select the template.
  var template = document.querySelector('#message-template').innerHTML;
  //Call render to create the element, passing any needed data.
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    time: moment(message.createdAt).format('h:mm a')
  });
  //Add that element in the desired location.
  //Append child didn't work here because I was trying to add a string instead of a node.
  document.querySelector('#messages').innerHTML += html;
  // let time = moment(message.createdAt).format('h:mm a');
  // let li = document.createElement('li');
  // li.innerHTML = message.from + ', ' + '<em>' + time + '</em>' + ': ' + message.text;
  // document.querySelector('#messages').appendChild(li);
  scrollToBottom();
});

socket.on('newLocationMessage', function(locationMessage) {
  //Grabs the whole block of HTML inside the script tags.
  var template = document.querySelector('#location-message-template').innerHTML;
  //Uses the sent data to populate the template.
  var html = Mustache.render(template, {
    from: locationMessage.from,
    time: moment(locationMessage.createdAt).format('h:mm a'),
    url: locationMessage.url
  });
  //Adds the populated template block to the messages element.
  document.querySelector('#messages').innerHTML += html;

  // let time = moment(locationMessage.createdAt).format('h:mm a');
  // let li = document.createElement('li');
  // let a = document.createElement('a');
  // a.setAttribute('target', '_blank');
  // a.setAttribute('href', locationMessage.url);
  // li.innerHTML = locationMessage.from + ', ' + '<em>' + time + '</em>' + ': Check out my current ';
  // a.innerHTML = 'location.';
  // li.appendChild(a);
  // document.querySelector('#messages').appendChild(li);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});

socket.on('updateUserList', (list) => {
  var userList = document.createElement('ol');
  list.forEach((name) => {
    var listItem = document.createElement('li');
    var user = document.createTextNode(name);
    listItem.appendChild(user);
    userList.appendChild(listItem);
  });
  document.querySelector('#users').innerHTML = '';
  document.querySelector('#users').appendChild(userList);
});

var messageForm = document.getElementById('message-form');
//The e (event) argument is crucial for overriding default behavior.
//It seems that 'submit' is a built-in event for forms. Nice.
//Notice here, because it's a form, we have 'submit,' not 'click.'

var messageTextBox = document.querySelector('input[name=message]');

messageForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var params = jQuery.deparam(window.location.search);
  socket.emit('createMessage', {
    from: params.name,
    room: params.room,
    //Name of element, with attribute and value inside brackets.
    //It seems '.value' is a property of the element. Cool!
    text: messageTextBox.value
    //After the data, the acknowledgement callback, which will be a cleared form.
  }, function () {
    messageTextBox.value = '';
  });
});

var locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', function () {
  var params = jQuery.deparam(window.location.search);
  if (!navigator.geolocation) {
    return alert('Geolocation unavailable on current browser.');
  }
  //Disable button while awaiting response from geolocation API.
  locationButton.setAttribute('disabled', 'disabled');
  locationButton.innerHTML = 'Sending location...'
  //Async, so two callbacks, one success and one error.
  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {from: params.name, room: params.room, latitude: position.coords.latitude, longitude: position.coords.longitude});
    //Reset button, as socket.emit will mean the response has come back.
    locationButton.innerHTML = 'Send location'
    locationButton.removeAttribute('disabled');
  }, function () {
    return alert('Unable to share location.');
    locationButton.removeAttribute('disabled');
  });
});
