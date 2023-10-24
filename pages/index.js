import React from 'react';

import { DashboardPage } from '@components/layout';

// server side imports
import { $public } from '/lib/page';

export async function getServerSideProps(context) {
	return $public.next(context).value;
}

export default function HomePage(props) {
	return (
		<DashboardPage>
		  <div className='m-5'>home page</div>
		</DashboardPage>
	)
}
// HomePage.getLayout = DashboardLayout;
