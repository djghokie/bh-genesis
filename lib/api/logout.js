const assert = require('assert');

const { fromBrowser } = require('gell-cookie/factory')
const { invalidate } = require('gell-cookie/work')

module.exports = async context => {
	let { req, res, session } = context;

	let c = fromBrowser(req, 'bhsession');;
	c.set('path', '/');

	invalidate(c, res);

	return session;
}