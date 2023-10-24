import React from 'react';

import { SiteNav } from './nav';

import { useGet } from '/hooks/api';
import { Session } from '/context/session';

export function Sidebar({ session={}, user }) {
	/*
	const LINKS = [{
		label: 'DevOps',
		href: '/home/devops'
	}, {
		id: 'hr-1',
	}, {
		label: 'Ecosystem',
		href: '/ecosystem'
	}];
	*/

	const LINKS = [{
		label: 'Session',
		href: '/session'
	}, {
		label: 'Claims',
		href: '/claims'
	}]

	return <SiteNav session={session} user={user} links={LINKS} />
}

export function DashboardPage({ children }) {
	const [getUser, user] = useGet('/api/user', true);

	const { active: session } = React.useContext(Session);

	return (
		<div className='container-fluid p-2'>
		  <div className='row p-3'>
		    <div className='col-lg-3'><Sidebar session={session} user={user} /></div>
		    <div className='col-lg-9 px-2'>
			  { children }
			</div>
		  </div>
	    </div>
	)
}

export function DashboardLayout(page) {
	return (
		<div>
		  {page}
		</div>
	)
}