/**
 * WIP
 * 	- part of registration flow?
 */

const { State } = require("gell")

const chance = require('chance')();

module.exports = function* userAuthority() {
	let config = new State();

	yield config;
	
	while (true) {
		let user = new State();
		user.set('id', chance.guid());
		user.set('roles', ['anonymous']);

		yield user;
	}
}