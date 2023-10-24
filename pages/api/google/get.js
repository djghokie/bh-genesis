const assert = require('assert');

/**
 * WIP: temp
 * 	- generator that would handle get requests only
 * 	- would repeatedly handle requests
 * 	- could potentially conditionally handle requests
 * 	- authorization?
 * 	- for JSON based APIs?
 * 	- should always return a State
 * 	- generator can add its own State properties
 * 		- metadata about the request
 * 		- decorator pattern?
 */
async function* get(handler) {
	assert(handler);

	// TODO: doesn't this usually yield a State?
	let context = yield;

	while (true) {
		let { req, res } = context;

		assert(req);
		assert(res);

		let result;

		try {
			// TODO: create State
			// TODO: decorate response
	
			if (req.method === 'GET') {
				let result$ = await handler(req, res);

				result = res.status(200).json(result$.snapshot ? result$.snapshot() : result$);
			}
			else result = res.status(405).json({ message: `invalid method '${req.method}'` });
		} catch (e) {
			console.error(e);

			// allow for a full JSON body to be returned
			const { status, body={} } = e;
	
			result = res.status(status || 500).json(body.snapshot ? body.snapshot() : body);
		}
	
		context = yield result;
	}
}

/**
 * WIP
 * 	- idea here is that next requires you to export a function with this signature
 * 	- the lifecycle generator could be moved elsewhere
 * 	- or perhaps a new "handlers" module could be created
 * 
 * @param {*} handler 
 * @returns 
 */
module.exports = handler => {
	let $get =  get(handler);

	$get.next();

	return (req, res) => $get.next({ req, res });
}