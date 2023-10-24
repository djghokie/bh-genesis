const assert = require('assert');

const { State } = require('gell');
const { materialize, persist } = require('gell-cookie/work');

/**
 * WIP: this was adapted from next api handlers (gell-http)
 * 	- checks for grants (scopes) instead of roles
 * 
 * WIP: this should just use the regular handlers
 * 	- pass in "f" (additional authorization)
 * 
 * IMPROVEMENTS:
 * 	- scopes should be passed into the generator
 * 	- could be generalized into a general oauth authorizer
 */
function* protectedPage(deps, f) {
	assert(deps, 'deps is required');
	
	let config = new State();

	let context = yield config;

	async function authorize(context) {
		const { $sessionAuthority, $userIndex, $userAuthority, oauthClient } = await deps.resolve(
				'$sessionAuthority',
				'$userIndex',
				'$userAuthority',
				'oauthClient'
				);

		let [token, c] = materialize(context.req, 'bhsession');

		let session = $sessionAuthority.next({ token }).value;
		let sessionId = session.get('userId');

		let user;
		
		if (sessionId) user = await $userIndex.next({ id: sessionId }).value;
		
		if (!user) {
			user = $userAuthority.next().value;

			// NOTE: only associate new user, otherwise roles will be overwritten
			session.assume(user);
		}

		/**
		 * WIP: dont handle new sessions here
		if (session.isNew) {
			c.set('value', session.snapshot('jwtEncoded').token);
			c.set('path', '/');
			c.set('maxAge', 60 * 60 * 24 * 7);  // 1 week; TODO: sync this up with the session by deriving

			persist(c, context.res);
		}
		*/

		/**
		 * WIP
		 * 	- i think that youd only redirect if the user is not authenticated
		 * 	- start the login flow here
		 * 	- save the flow "target"
		 * 		- may be a better name for this
		 * 		- can probably get path from the request
		let allowedRoles = config.get('allowedRoles');
		if (allowedRoles) {
			let {roles, isAuthenticated} = session.snapshotPartial(['roles', 'isAuthenticated'], 'server');

			// TODO: probably use lodash intersection
			let firstMatching = allowedRoles.find(ar => roles.find(r => r === ar));

			if (!firstMatching) {
				let response = {
					redirect: {
						permanent: false
					}
				}

				if (isAuthenticated) response.redirect.destination = '/unauthorized';
				else {
					let flow = new State();
					flow.set('target', context.resolvedUrl);
			
					let c = sessionCookie('bh-flow-login', context.resolvedUrl);
					// c.set('value', flow);

					persist(c, context.res);
				
					response.redirect.destination = '/login';
				}

				return response;
			}
		}
		 */

		if (true) {
			const authorizationUrl = oauthClient.generateAuthUrl({
				access_type: 'offline',
				scope: 'https://www.googleapis.com/auth/calendar',
				prompt: 'consent'
				// include_granted_scopes: true
			});

			console.debug('######', 'trigger Google auth', authorizationUrl);
		
			let response = {
				redirect: {
					permanent: false,
					destination: authorizationUrl
				}
			}

			return response;
		}

		context.session = session;
		context.user = user;

		let response = f ? f(context) : { props: {} };

		if (response.props) {
			response.props.token = token;  // pass the session JWT to be used for ws authorization
			response.props.session = session.snapshot('server');
			response.props.user = user.snapshot();
		}

		return response;
	}

	while (true) {
		assert(context);

		context = yield authorize(context);
	}
}

/**
 * WIP: this was adapted from next api handlers (gell-http)
 * 	- ...
 * 
 * IMPROVEMENTS:
 * 	- scopes should be passed into the generator
 * 	- initialize authorization flow here?
 * 
 * @param {*} deps 
 * @param {*} f 
 */
function* protectedApi(deps, f) {
	assert(deps, 'deps is required');
	
	let config = new State();

	let context = yield config;

	async function authorize(context) {
		let isAuthorized = false;

		const { $sessionAuthority, $userIndex, oauthClient } = await deps.resolve(
			'$sessionAuthority',
			'$userIndex',
			'oauthClient'
			);

		let [token] = materialize(context.req, 'bhsession');

		let session = $sessionAuthority.next({ token }).value;

		let { roles, isAuthenticated } = session.snapshotPartial(['roles', 'isAuthenticated'], 'server');

		/*
		if (isAuthenticated) {
			let allowedRoles = config.get('allowedRoles');
			if (allowedRoles) {
				// TODO: probably use lodash intersection
				isAuthorized = allowedRoles.find(ar => roles.find(r => r === ar));
			}
			else isAuthorized = true;
		}

		if (isAuthorized) {
			context.session = session;
			context.user = await $userIndex.next({ id: session.get('userId') }).value;
	
			return f ? f(context) : {};
		}
		*/
		
		const authorizationUrl = oauthClient.generateAuthUrl({
			access_type: 'offline',
			scope: 'https://www.googleapis.com/auth/calendar.readonly',
			prompt: 'consent'
			// include_granted_scopes: true
		});
	
		let error = new Error('not authorized');
		error.status = 401;
		error.body = {
			redirect: authorizationUrl
		}

		throw error;
	}

	while (true) {
		assert(context);

		context = yield authorize(context);
	}
}

module.exports = {
	protectedPage,
	protectedApi
}