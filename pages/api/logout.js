import api from 'gell-http/next/api';

import deps from '@dependencies';

import { sessionLoader } from '/lib/middleware';

import handler from '/lib/api/logout';

export default api(handler, deps, { allowedMethods: ['POST'], middleware: [sessionLoader] });
