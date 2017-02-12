
var socket = io();
var locationButton = $('#send-location');
var messageForm = $('#message-form');
var messageInput = $('[name=message]', messageForm);


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
		text: messageInput.val()
	}, function () {
		// acknowledge callback is fired once server recives the emitted event

		// clear the input after server sends back acknowledge event
		messageInput.val('');
	});
});

locationButton.click(function () {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}
	// disable the location button
	locationButton.prop('disabled', true);
	locationButton.text('Sending location...');

	navigator.geolocation.getCurrentPosition(function (position) {
		var {latitude, longitude}  = position.coords;

		// send coordinates to server
		socket.emit('createLocationMessage', {latitude, longitude});
		// enable the location button
		locationButton.prop('disabled', false);
		locationButton.text('Send location');
	}, function () {
		alert('Unable to fetch location');
		locationButton.prop('disabled', false);
		locationButton.text('Send location');
	});
});
