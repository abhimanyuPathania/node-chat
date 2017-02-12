
var socket = io();
var locationButton = $('#send-location');
var messageForm = $('#message-form');


socket.on('connect', function () {
	console.log('connected to server');
});

socket.on('newMessage', function (message) {
	console.log('New Message', message);

	var li = $(`<li>${message.from}: ${message.text}</li>`);
	$('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
	var li = $(`
		<li>${message.from}: 
			<a target="_blank" href=${message.url}>My current location</a>
		</li>
	`);
	$('#messages').append(li);
});

messageForm.on('submit', function(e) {
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]', messageForm).val()
	}, function () {
		// acknowledge callback
	});
});

locationButton.click(function () {
	if (!navigator.geolocation) {
		alert('Geolocation not supported by your browser');
	}

	navigator.geolocation.getCurrentPosition(function (position) {
		var {latitude, longitude}  = position.coords;

		socket.emit('createLocationMessage', {latitude, longitude});
	}, function () {
		alert('Unable to fetch location');
	});
});
