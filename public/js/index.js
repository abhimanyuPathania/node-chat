
var socket = io();
var locationButton = $('#send-location');
var messageForm = $('#message-form');
var messageInput = $('[name=message]', messageForm);
var messagesList = $('#messages');

socket.on('connect', function () {
	console.log('connected to server');
});

socket.on('newMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	messagesList.append(html);

});

socket.on('newLocationMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});
	messagesList.append(html);
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
