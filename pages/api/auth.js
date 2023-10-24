import { State } from 'gell';
import { post } from 'gell-http/next/api';

import { materialize, persist, invalidate } from 'gell-cookie/work';

// server side imports
import deps from '/lib/dependencies';

/**
 * Login flow notes
 * 
 * 	- flow spans multiple http requests
 * 		- initiated by request for a secured page
 * 		- user is presented login page
 * 		- user is routed to secured page
 * 	- requests may be page or api requests
 * 	- state must be persisted somehow
 * 		- cookies probably make the most sense
 * 		- could potentially store in JWT although that probably doesn't make as much sense
 * 		- should be a common gell capability to snapshot/materialize from cookie
 * 	- use ecosystem snapshot page to drive this implementation
 * 	- how is this related to the session lifecycle?
 * 
 * Generator/lifecycle notes
 * 	- login flow (the generator) would be created from another sequence/lifecycle
 * 		- is this the authority?
 * 	- as i'm writing this does this require the gell-replay functionality i was thinking of earlier?
 * 		- challenge is to accurately restore the generator to the correct state between requests
 * 	- perhaps this isn't named "login" but something that refers to "secure page access"
 * 	- as a general note, this allows the developer to define a long running, async process in a single method
 */

function* login() {
	let flow = {}; // this would actually be a State

	/**
	 * WIP
	 *  - initiation would have the url the user attempted to access
	 */
	let initiation = yield flow;

	// store the flow state

	let $authentication = auth();

	/**
	 * WIP
	 * 	- this would yield to an authentication flow
	 */
	let user = yield $authentication;

	// now perform the redirection
}

export default post(async (req, res) => {
	let { $idm, $userIndex, $sessionAuthority } = await deps.resolve(
		'$idm',
		'$userIndex',
		'$sessionAuthority',
		);

	let [token, c] = materialize(req, 'bhsession');

	let session = $sessionAuthority.next({ token }).value;

	try {
		let creds = {
			id: req.body.userName,
			password: req.body.password,
		}
		let identity = $idm.next(creds).value;

		if (!identity) throw new Error('invalid credentials');
		
		let user = $userIndex.next({ id: identity.get('id') }).value;
		
		if (!user) throw new Error('invalid credentials');

		user.set('identity', identity);

		session.assume(user);

		/**
		 * WIP
		 * 	- this commit behavior should come from the issuer/authority
		 */
		// commit();
		c.set('value', session.snapshot('jwtEncoded').token);
		c.set('path', '/');
		c.set('maxAge', 60 * 60 * 24 * 7);  // 1 week; TODO: sync this up with the session by deriving

		persist(c, res);

		let [target, loginFlowCookie] = materialize(req, 'bh-flow-login');

		// TODO: this is "completing" the flow
		if (target) invalidate(loginFlowCookie, res);

		/**
		 * WIP
		 * 	- login state should be the login flow state
		 */
		let loginState = new State();
		loginState.set('identity', identity);
		loginState.set('session', session);
		if (target) loginState.set('target', target);

		return loginState;
	} catch (e) {
		console.error('authentication error', e);

		e.status = 401;

		throw e;
	}
})
;