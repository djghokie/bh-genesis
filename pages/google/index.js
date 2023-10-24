import React from 'react';

import {
	Button,
	Card,
	CardBody,
	CardTitle,
} from 'reactstrap'

import { DashboardNav } from '/components/google';
import { MetricCard } from '/components/analytics';

import { useGet } from '/hooks/api';

// server side imports
/*
import deps from '/lib/dependencies';
import { protectedPage } from '/lib/handlers';
import { init } from 'gell/future'

let handler = protectedPage(deps);
let [$handler, config] = init(handler);

export async function getServerSideProps(context) {
	config.set('allowedRoles', ['operator']);

	return $handler.next(context).value;
}
*/

function SessionsCard() {
	const [getSessions, sessions] = useGet('/api/sessions', true);

	React.useEffect(z => {
	}, []);

	return (
		<>
		  <Card>
			<CardBody>
			  <CardTitle>Sessions</CardTitle>

			  <div className='d-flex justify-content-between'>
		        <div>
				<i>5 most recent sessions</i>
			      {/* <QueryDropdown query={query} onQueryChanged={setQuery} /> */}
			    </div> 
			    <div className='d-flex justify-content-end'>
		          {/* <Button className="mx-1" variant="success" onClick={z => router.push('/operations/tutor/new')}>Add</Button> */}
		          <Button className="mx-1" variant="secondary" onClick={z => getSessions()}>Refresh</Button>
		        </div>
		      </div>

		  	  {/* <SessionsTable sessions={sessions || []} /> */}
			</CardBody>
		  </Card>
		</>
	)
}

function SessionMetrics() {
	// const [getMetrics, metrics] = useGet('/api/session/metrics', true);
	const metrics = {}

	let { current, total } = metrics || {};

	return (
		<>
		  <div className='row my-2'>
			<div className='col-lg-4'>
			  <MetricCard title="CURRENT" variant="info" value={current || 0} />
			</div>
			<div className='col-lg-4'>
			  <MetricCard title="TOTAL" variant="success" value={total || 0} />
			</div>
		  </div>
		</>
	)
}

function Dashboard() {
	return (
		<>
		  <SessionMetrics />

		  <SessionsCard />
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
