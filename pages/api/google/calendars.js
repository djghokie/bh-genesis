/**
 * WIP: should calls to Google API happen on client or server?
 * 	- client
 * 		- one less network hop
 * 	- server
 * 		- consolidate authorization logic
 * 		- similar approach to traditional protected page
 */

// const assert = require('assert');

/*
const { OAuth2Client } = require('google-auth-library');
const google = require('@googleapis/calendar');

const calendar = google.calendar('v3');

const CLIENT_ID = '176446318200-gv8d7kire33bpmbtjb0vff139cj0m3ku.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

export default async function handler(req, res) {
	const client = new OAuth2Client(CLIENT_ID, GOOGLE_CLIENT_SECRET, 'http://localhost:11300');

	const authorizationUrl = client.generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/calendar.readonly',
		prompt: 'consent'
		// include_granted_scopes: true
	});

	// await calendar.calendarList.get({ calendarId: 'foo' });

	const driver = {
		authorizationUrl,
		calendars: [{
			id: 1
		}, {
			id: 2
		}]
	}

	res.status(200).json(driver);
}
*/

import { init } from 'gell/future'
// import { get } from 'gell-http/next/api';
import get from './get';

import { protectedApi } from '/lib/google/handlers';
import deps from '/lib/dependencies';
// import handler from '/lib/api/reservations';

let api = protectedApi(deps);
let [$api, config] = init(api);

// config.set('allowedRoles', ['operations']);

async function handler(context) {
	return {
		gello: 'world!'
	}
}

export default get(async (req, res) => {
	let context = { req, res };

	let auth = await $api.next(context).value;

	// if (auth && auth.status === 401) throw auth;

	// context.deps = deps;
	
	return handler(context);
});
