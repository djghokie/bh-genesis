import React from 'react';

import { useRouter } from 'next/router';

import { PageBreadcrumb } from '/components/nav';
import { MapCard, MapTable } from '/components/debug';

import { useGet } from '/hooks/api'

// server side imports
import deps from '/lib/dependencies';
import { protectedPage } from '/lib/handlers';
import { init } from 'gell/future'

let handler = protectedPage(deps);

let [$handler, config] = init(handler);

export async function getServerSideProps(context) {
	config.set('allowedRoles', ['operator']);  // NOTE: have to do this here for some reason

	return $handler.next(context).value;
}

export default function EcosystemPage() {
	const router = useRouter();

	const { component } = router.query;

	const [snapshot, state] = useGet('/api/ecosystem/snapshot');

	React.useEffect(z => {
		snapshot(component ? { attributes: component } : undefined);
	}, [component]);

	if (!state) return <div>loading...</div>

	let name = component ? state[component].name : state.name;
	let conf = component ? state[component].conf : state.conf;

    return (
		<>
		  <PageBreadcrumb title={component || 'root'} />

		  <h4>{ name }</h4>

		  { conf && <MapCard map={ conf } title="Conf" /> }

		  <MapTable map={component ? state[component] : state } />
	    </>
    )
}

EcosystemPage.getLayout = function(page) {
	return (
		<div className="p-3">
		  {page}
		</div>
	)
}