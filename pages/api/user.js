import api from 'gell-http/next/api';

import deps from '@dependencies';

import { sessionLoader, userLoader } from '/lib/middleware';

async function handler(context) {
	const { user } = context;

	return user;
}

export default api(handler, deps, { allowedMethods: ['GET'], middleware: [sessionLoader, userLoader] });