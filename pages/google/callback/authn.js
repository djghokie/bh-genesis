import React from "react";

import Link from 'next/link';

import { State } from "gell";
import { materialize, persist, invalidate } from 'gell-cookie/work';
import deps from '/lib/dependencies';
import rawBody from 'raw-body';

/**
 * Process authentication callback
 * 
 * ###### LoginTicket {
  envelope: {
    alg: 'RS256',
    kid: '27b86dc6938dc327b204333a250ebb43b32e4b3c',
    typ: 'JWT'
  },
  payload: {
    iss: 'https://accounts.google.com',
    nbf: 1668984183,
    aud: '733720012880-i20vdt5fco8oo4g4cqgrdf63cr3tqo47.apps.googleusercontent.com',
    sub: '101150240483359031308',
    hd: 'quentinsystems.com',
    email: 'daniel.gay@quentinsystems.com',
    email_verified: true,
    azp: '733720012880-i20vdt5fco8oo4g4cqgrdf63cr3tqo47.apps.googleusercontent.com',
    name: 'Daniel Gay',
    given_name: 'Daniel',
    family_name: 'Gay',
    iat: 1668984483,
    exp: 1668988083,
    jti: '2c254fcf6d398f45bbda20807e2df8cf47d6dd7c'
  }
}
 * 
 * @param {*} context 
 * @returns 
 */
export async function getServerSideProps(context) {
	const body = await rawBody(context.req, { encoding: 'utf-8' });
	const params = new URLSearchParams(body);
	const credential = params.get('credential');

	if (credential) {
		let { oauthClient, $userIndex, $sessionAuthority } = await deps.resolve(
			'oauthClient',
			'$userIndex',
			'$sessionAuthority',
			);
	
		const ticket = await oauthClient.verifyIdToken({
			idToken: credential,
			audience: process.env.GOOGLE_CLIENT_ID,
			// audience: [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
		});

		const payload = ticket.getPayload();
		const { sub: id, name, email } = payload;

		const identity = new State();
		identity.set('id', id);
		identity.set('name', name);
		identity.set('email', email);

		let [token, c] = materialize(context.req, 'bhsession');
	
		let session = $sessionAuthority.next({ token }).value;
	
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

		persist(c, context.res);

		let [target, loginFlowCookie] = materialize(context.req, 'bh-flow-login');

		// TODO: this is "completing" the flow
		if (target) invalidate(loginFlowCookie, context.res);

		return {
			redirect: {
				permanent: false,
				destination: target || '/route'
			}
		}
	}

	return {
		props: {
			errorMessage: 'missing credential',
		}
	}
}

export default function AuthPage({ errorMessage }) {
	return (
		<>
			<div>{ errorMessage }</div>
			<div className='mt-5 d-flex justify-content-center text-muted'>
			<Link href="/">Return Home</Link>
			</div>
		</>
	)
}
