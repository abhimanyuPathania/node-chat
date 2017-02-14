
var socket = io();
var locationButton = $('#send-location');
var messageForm = $('#message-form');
var messageInput = $('[name=message]', messageForm);
var messagesList = $('#messages');


function scrollToBottom() {
	// selectors
	var newMessage = messagesList.children('li:last-child');

	// height
	var clientHeight = messagesList.prop('clientHeight');
	var scrollTop = messagesList.prop('scrollTop');
	var scrollHeight = messagesList.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messagesList.scrollTop(scrollHeight);
	}
}; 

// 'connect' is a default event emitted from server on connection
socket.on('connect', function () {
	var params = $.deparam(window.location.search);
	socket.emit('join', params, function (err) {
		if (err) {
			// display the error to user
			alert(err);
			// send them back to the Join page
			window.location.href = '/'
		} else {
			console.log('No error');
		}
	});
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
	scrollToBottom();

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
	scrollToBottom();
});

socket.on('updateUserList', function (users) {
	var ol = $('<ol></ol>');
	users.forEach(function (name) {
		var li = $(`<li>${name}</li>`)
		ol.append(li);
	});

	$('#users').html(ol);
});




messageForm.on('submit', function(e) {
	e.preventDefault();

	socket.emit('createMessage', {
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
