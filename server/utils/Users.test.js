const expect = require('expect');

const Users = require('./Users');

describe('Users', () => {
	var users;

	beforeEach(() => {
		users = new Users();
		users.users = [
			{
				id: '1',
				name: 'one',
				room: 'Node Course'
			},
			{
				id: '2',
				name: 'two',
				room: 'Node Course'
			},
			{
				id: '3',
				name: 'three',
				room: 'React Course'
			}
		];
	});

	it('should add new user', () => {
		var users = new Users();
		var testUser = {
			id: '123',
			name: 'name',
			room: 'room'
		}

		var responseUser = users.addUser(testUser.id, testUser.name, testUser.room);

		expect(users.users).toEqual([testUser]);
	});

	it('should return names for the Node Course', () => {
		var usersList = users.getUserList('Node Course');
		expect(usersList).toEqual(['one', 'two']);
	})

	it('should return names for the React Course', () => {
		var usersList = users.getUserList('React Course');
		expect(usersList).toEqual(['three']);
	});


	it('should remove a user', () => {
		var user = users.removeUser('1');
		expect(user.id).toBe('1');
		expect(users.users.length).toBe(2);
	});

	it('should not remove user', () => {
		// pass id the does not belong to any user
		var user = users.removeUser('asdf');
		expect(user).toNotExist();
		expect(users.users.length).toBe(3);
	});


	// get users
	it('should find user', () => {
		var user = users.getUser('2');
		expect(user).toExist();
		expect(user.id).toBe('2');
	});

	it('should not find user', () => {
		var user = users.getUser('asdf');
		expect(user).toNotExist();
	});
});