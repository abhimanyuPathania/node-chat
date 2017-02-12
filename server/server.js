const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');

const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	// send the new user a message from Admin
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat!'));
	// notify everyone else except the user
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined chat'));

	socket.on('createMessage', (message) => {
		console.log('createMessage', message);

		// socket emits event to a single connection
		// io will emit them to every connection
		io.emit('newMessage', generateMessage(message.from, message.text));
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});