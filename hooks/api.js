import React from 'react';

export function useGet(endpoint, immediate=false) {
	const [response, setResponse] = React.useState({});
	const [error, setError] = React.useState();

	function call(query, redirectUnauthorized=true) {
		let withQuery = query ? `${endpoint}?${new URLSearchParams(query)}` : endpoint;

		return fetch(withQuery)
			.then(async r => {
				let res = await r.json();

				setResponse(res);

				if (r.status === 200) setError();
				else {
					if (r.status === 401 && redirectUnauthorized) window.location = '/login';
	
					setError(res.message);

					throw new Error(res.message);
				}

				return res;
		})
	}

	React.useEffect(z => {
		if (!immediate) return;

		call();
	}, [immediate])

	return [call, response, error];
}

/**
 * Hook to POST to a JSON based API
 * 
 * @param {*} endpoint 
 * @param {*} immediate - if POST should happen as part of hook creation
 * @param {*} body - if immediate, the body to POST
 * @returns 
 */
export function usePost(endpoint, immediate=false, body) {
	// NOTE: "response" is the parsed JSON response body
	const [response, setResponse] = React.useState({});
	const [error, setError] = React.useState();

	/**
	 * Execute the POST
	 * 
	 * NOTE: redirectUnauthorized parameter added for calls to auth endpoint
	 * 	- login page should handle these errors
	 * 
	 * @param {*} body 
	 * @param {*} redirectUnauthorized 
	 * @returns 
	 */
	function call(body, redirectUnauthorized=true) {
		let options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body || {})
		}

		return fetch(endpoint, options)
			.then(async r => {
				let res = await r.json();

				setResponse(res);

				if (r.status === 200) setError();
				else {
					if (r.status === 401 && redirectUnauthorized) window.location = '/login';
	
					setError(res.message);

					throw new Error(res.message);
				}

				return res;
			})
			// .catch(setError)
	}

	React.useEffect(z => {
		if (!immediate) return;

		call(body);
	}, [immediate])

	return [call, response, error];
}
