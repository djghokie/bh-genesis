import React from "react";

import Link from 'next/link';

import { OAuth2Client } from 'google-auth-library';

/**
 * Process authorization callback
 * 
 * @param {*} context 
 * @returns 
 */
export async function getServerSideProps(context) {
	// console.debug('######', context.query);

	const { code } = context.query;
	let errorMessage;

	if (code) {
		/**
		 * WIP: not sure why i have to specify the redirect uri
		 */
		const client = new OAuth2Client(
				process.env.GOOGLE_CLIENT_ID,
				process.env.GOOGLE_CLIENT_SECRET,
				'http://localhost:12700/google/callback/authz'
				);

		try {
			/**
			 * NOTE: this will return access tokens and refresh tokens
			 * 	- the access token can be used to make api calls
			 * 	- the refresh token can be stored long term for retrieving new access tokens
			 */
			const { tokens } = await client.getToken(code);

			console.debug('######', tokens);
	
			// client.setCredentials(tokens);

			return {
				props: {
					tokens
				}
			}
		} catch (e) {
			errorMessage = e.message;
		}
	}
	else {
		errorMessage = 'missing authentication code'
	}

	/*
	const calendar = google.calendar('v3');

	const calendarId = 'ZGFuaWVsLmdheUBxdWVudGluc3lzdGVtcy5jb20';

	const response = await calendar.calendarList.get({
		auth: client,
		calendarId
	});

	console.debug('$$$$$$', response);
	*/

	return {
		props: {
			errorMessage,
		}
	}
}

export default function AuthzPage({ errorMessage, tokens }) {
	if (errorMessage) {
		return (
			<>
			  <div>{ errorMessage }</div>
		      <div className='mt-5 d-flex justify-content-center text-muted'>
			    <Link href="/">Return Home</Link>
				<span className="px-2">|</span>
			    <Link href="/google">Google Dashboard</Link>
		      </div>
			</>
		)
	}

	return (
		<>
		  <div>successfully authorized</div>
		  <div>access token: { tokens.access_token }</div>
		  <div className='mt-5 d-flex justify-content-center text-muted'>
		    <Link href="/">Return Home</Link>
			<span className="px-2">|</span>
			<Link href="/google">Google Dashboard</Link>
		  </div>
		</>
	)
}
