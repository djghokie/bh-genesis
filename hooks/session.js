import React from 'react';

export function useSession() {
	let [session, setSession] = React.useState({});
	const [error, setError] = React.useState();

	React.useEffect(z => {
		fetch('/api/session')
			.then(r => {
				if (r.status === 200) return r.json()

				throw new Error('could not get session');
			})
			.then(setSession)
			.catch(setError)
			;
	}, [])

	return [session, error];
}