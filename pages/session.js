import React from 'react';

import { DashboardLayout, DashboardPage } from '@components/layout';
import { MapTable } from '@components/debug';

// server side imports
import { $public } from '/lib/page';

export async function getServerSideProps(context) {
	return $public.next(context).value;
}

function Session({ session }) {
	return (
	  <>
		<h2>User Session</h2>

		<MapTable map={session} />

		<ul className='mt-5'>
		  <li><i>session</i> represents a browser session</li>
		  <li>created when site is first accessed</li>
		  <li>is anonymous if not authenticated</li>
		  <li>can be associated (assumed) with an identity if authenticated</li>
		</ul>
	  </>
    )
}

export default function SessionPage(props) {
	return (
		<DashboardPage>
		  <Session {...props} />
		</DashboardPage>
	)
}
// SessionPage.getLayout = DashboardLayout;
