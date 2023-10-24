import React from 'react';

import { DashboardPage } from '@components/layout';
import { MapTable } from '@components/debug';

// server side imports
import { $public } from '/lib/page';

export async function getServerSideProps(context) {
	const response = await $public.next(context).value;

	response.props.claims = context.session.snapshot('claims');

	return response;
}

function Claims({ claims }) {
	return (
		<>
		  <h1>Claims</h1>

		  <MapTable map={claims} />
		</>
	)
}

export default function ClaimsPage(props) {
	return (
		<DashboardPage>
		  <Claims {...props} />
		</DashboardPage>
	)
}

// ClaimsPage.getLayout = DashboardLayout;
