/**
 * WIP
 * 	- new "index" pattern
 * 	- lookup users by id
 * 	- this would create the users since nothing is being persisted
 */

const assert = require('assert');

const { State } = require("gell")

/**
 * Lookup users from a predefined map of users
 * 
 * NOTES
 * 	- ...
 * 
 * @param {*} users 
 */
module.exports = function* userIndex(users) {
	assert(users, 'map of users required');

	let config = new State();

	let key = yield config;
	
	while (true) {
		// TODO: does this end the generator?
		assert(key, 'key is required');

		let { id } = key;

		let user;
		let existing = users[id];

		if (existing) {
			user = new State();
			user.set('id', id);
			user.set('roles', existing.roles);
		}

		key = yield user;
	}
}