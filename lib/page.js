const { init } = require('gell/future');

const deps = require('./dependencies');

const { protectedPage } = require('gell-http/next/handlers');

const publicPage = protectedPage(deps);
const privatePage = protectedPage(deps);

// NOTE: for public pages that still need access to BROWSER session
const [$public] = init(publicPage);

// NOTE: this is the "any role" page authorizer
const [$private, privatePageConf] = init(privatePage);
privatePageConf.set('allowedRoles', ['operations']);  // add more roles

module.exports = {
	$public,
	$private,
}