const sessionLoader = require('gell-web/middlware/session');
const apiAuthorizer = require('gell-web/middlware/authorizer');
const userLoader = require('gell-web/middlware/user');

const { lift } = require('gell/future');

const COOKIE_SESSION = 'bhsession';

exports.sessionLoader = lift(sessionLoader(COOKIE_SESSION))[0];
exports.userLoader = lift(userLoader())[0];

exports.authorizeAny = lift(apiAuthorizer())[0];
exports.authorizeOperator = lift(apiAuthorizer(['operations']))[0];
exports.authorizeDevOps = lift(apiAuthorizer(['devops']))[0];
