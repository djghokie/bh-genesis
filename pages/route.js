/**
 * trying to figure out some basic role based routing
 * 
 * WIP
 * 	- one way to do it would be with redirects
 * 		- i think i could make a parameterized route this way
 */

// server side imports
import deps from '/lib/dependencies';
import { protectedPage } from '/lib/handlers';
import { init } from 'gell/future'

let handler = protectedPage(deps, context => {
	let role = context.session.get('primaryRole');

	return {
		redirect: {
			destination: role ? `/home/${role}` : '/',
			permanent: false
		}
	}
});

let [$handler] = init(handler);

export async function getServerSideProps(context) {
	return $handler.next(context).value;
}

export default function RoutePage(params) {
	return (
		<div>routing...</div>
	)
}