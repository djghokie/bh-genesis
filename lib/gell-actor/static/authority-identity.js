const assert = require('assert');
const _ = require('lodash');

const { State } = require("gell")

/**
 * Yields identities by checking against a static password
 * 
 * NOTES
 * 	- supports any id
 * 
 * @param {*} roles 
 */
module.exports = function* identityAuthority(pass) {
	assert(_.isString(pass) && pass.length > 0, 'password is required');

	let config = new State();

	let credentials = yield config;
	
	while (true) {
		// TODO: does this end the generator?
		assert(credentials, 'credentials are required');
		
		let { id, password } = credentials;

		assert(id, 'id is required');
		assert(password, 'password is required');

		let identity;
		if (pass === password) {
			identity = new State();
			identity.set('id', id);
		}

		credentials = yield identity;
	}
}