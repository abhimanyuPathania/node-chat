
var socket = io();
socket.on('connect', function () {
	console.log('connected to server');
});

socket.on('newMessage', function (message) {
	console.log('New Message', message);

	var li = $(`<li>${message.from}: ${message.text}</li>`);
	$('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function () {
		// acknowledge callback
	});
})
