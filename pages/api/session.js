import api from 'gell-http/next/api';

import deps from '@dependencies';

import { sessionLoader } from '/lib/middleware';

async function handler(context) {
	const { session } = context;

	return session;
}

export default api(handler, deps, { allowedMethods: ['GET'], middleware: [sessionLoader] });