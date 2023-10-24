const assert = require('assert');

const { State } = require("gell")

/**
 * Yields user's with a fixed set of roles
 * 
 * NOTES
 * 	- does not support unknown users
 * 
 * @param {*} roles 
 */
module.exports = function* userIndex(roles) {
	assert(roles, 'array of roles required');

	let config = new State();

	let key = yield config;
	
	while (true) {
		// TODO: does this end the generator?
		assert(key, 'key is required');

		let { id } = key;

		let user;

		if (id) {
			user = new State();
			user.set('id', id);
			user.set('roles', roles);
		}

		key = yield user;
	}
}