const assert = require('assert');
const _ = require('lodash');

const { State } = require("gell")

/**
 * Yields identities by checking against a map of predefined identities
 * 
 * NOTES
 * 	- ...
 * 
 * @param {*} roles 
 */
module.exports = function* identityAuthority(identities) {
	assert(identities, 'map of identities is required');

	let config = new State();

	let credentials = yield config;
	
	while (true) {
		// TODO: does this end the generator?
		assert(credentials, 'credentials are required');
		
		let { id, password } = credentials;

		assert(id, 'id is required');
		assert(_.isString(password), 'password is required');

		let existing = identities[id];

		let identity;
		if (existing) {
			assert(existing.password, `identity (id=${id}) must be defined with a password`);
	
			if (existing.password === password) {
				identity = new State();
				identity.set('id', id);
			}
		}

		credentials = yield identity;
	}
}