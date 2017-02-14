const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const Users = require('./utils/Users');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.on('createMessage', (message, callback) => {
		console.log('createMessage', message);

		// socket emits event to a single connection
		// io will emit them to every connection
		io.emit('newMessage', generateMessage(message.from, message.text));

		// send the acknowledge event to client
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		// send everyone the location message
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)){
			// acknowledge with an error message
			// this will trigger the callback function with the same error message on the client side
			return callback('Name and room name are required.');
		}

		// rooms is an inbuilt feature in socket.io
		socket.join(params.room);

		// remove user from other rooms
		// this mean a user can chat only in one room at a time
		users.removeUser(socket.id);
		// add the user back with new room
		users.addUser(socket.id, params.name, params.room);
		// update the userlist UI for every user in rom
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		// send the new user a message from Admin
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat!'));
		// notify everyone in room except the current user
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

		// acknowledge without error
		callback()
	});

	socket.on('disconnect', () => {
		// remove user from the users list
		var user = users.removeUser(socket.id);

		// if removed
		if (user) {
			// update user list UI for everyone in the room
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			// tell other users in room that the user has left the room
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});