import { init } from 'gell/future'
// import { get } from 'gell-http/next/api';
import get from './get';

import { protectedApi } from '/lib/google/handlers';
import deps from '/lib/dependencies';
import handler from '/lib/api/google/calendars';

let api = protectedApi(deps);
let [$api, config] = init(api);

// config.set('allowedRoles', ['operations']);

export default get(async (req, res) => {
	let context = { req, res };

	// let auth = await $api.next(context).value;

	// if (auth && auth.status === 401) throw auth;

	context.deps = deps;
	
	return handler(context);
});
