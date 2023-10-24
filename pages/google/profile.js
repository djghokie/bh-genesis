import React from 'react';

import {
	Button,
	Card,
	CardBody,
	CardTitle,
} from 'reactstrap'

import { DashboardNav } from '/components/google';

import { useGet } from '/hooks/api';

// server side imports
import deps from '/lib/dependencies';
import { protectedPage } from '/lib/google/handlers';
import { init } from 'gell/future'

let handler = protectedPage(deps);
let [$handler, config] = init(handler);

export async function getServerSideProps(context) {
	config.set('allowedRoles', ['operator']);

	return $handler.next(context).value;
}

function Dashboard() {
	const [getCalendars] = useGet('/api/google/calendars');

	/**
	 * WIP: this would be one approach
	 * 	- also could create the redirect url on the server
	 */
	function reloadCalendars() {
		/*
		let client = google.accounts.oauth2.initCodeClient({
			client_id: process.env.GOOGLE_CLIENT_ID,
			scope: 'https://www.googleapis.com/auth/calendar.readonly',
			ux_mode: 'redirect',
			redirect_uri: "http://localhost:12700/google/callback/authz",
			access_type: 'offline',
			// state: "YOUR_BINDING_VALUE",
			error_callback: z => {
				console.debug('$$$$$$', 'WTF')
			}
		})
		;

		client.requestCode();
		*/

		/**
		 * WIP: this call is designed to return redirect url if unauthorized
		 * 	- current api hooks make this difficult
		 * 	- they need to be refactored
		 */
		getCalendars(null, false)
			.then(res => {
				console.debug('######', 'success')
				// window.open(res.authorizationUrl)
			})
			.catch(res => {
				console.debug('######', 'fail', res)
				// window.open(res.authorizationUrl)
			})
			;
	}

	return (
		<>
		  <ul>
			<li>authorization flow triggered by page load</li>
			<li>implicit trigger of authorization flow</li>
			<li>at page level instead of api level</li>
		  </ul>

		  <Button onClick={reloadCalendars}>List</Button>
		</>
	)
}

export default function GooglePage() {
	const [getUser, user] = useGet('/api/user', true);

	return (
		<div className='container-fluid p-2'>
		  <div className='row p-3'>
		    <div className='col-lg-3'><DashboardNav user={user} /></div>
		    <div className='col-lg-9 px-2'>
			  <Dashboard />
			</div>
		  </div>
	    </div>
	)
}

GooglePage.getLayout = function(page) {
	return (
		<div>
		  {page}
		</div>
	)
}