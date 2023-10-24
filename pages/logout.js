import React from 'react';

import {
	Spinner
} from 'react-bootstrap'

import { usePost } from '/hooks/api';

export default function Logout({ reloadSession }) {
	const [logoutApi] = usePost('/api/logout');

	React.useEffect(z => {
		let t = setTimeout(z => {
			return logoutApi()
				.then(reloadSession)
				.then(z => window.location = '/')
		}, 1500);

		return z => clearTimeout(t);
	}, []);

	return (
		<>
          <Spinner variant="primary" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>

		  <div className='mt-3'>logging you out...</div>
		</>
	)
}
