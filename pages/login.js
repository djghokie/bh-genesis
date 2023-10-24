import React from 'react';

import {
	UncontrolledAlert
} from 'reactstrap'

import {
	Button,
	FloatingLabel,
	Form,
} from 'react-bootstrap'

import { SignIn } from '/components/google'

import Link from 'next/link';
import Script from 'next/script';

import { useRouter } from 'next/router'
import { usePost } from '/hooks/api';

// server side imports

export async function getServerSideProps(context) {
	// TODO: start login flow if one doesn't exist already...

	return {
		props: {
			googleClientId: process.env.GOOGLE_CLIENT_ID
		}
	}
}

export default function Login({ reloadSession, googleClientId }) {
	const [userName, setUserName] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [message, setMessage] = React.useState('');

	const userNameControl = React.useRef();

	const [auth] = usePost('/api/auth');
	const router = useRouter();

	React.useEffect(z => userNameControl.current.focus(), []);

	function handleLogin(e) {
		e.preventDefault();

		return auth({ userName, password }, false)
			.then(({ message, target }) => {
				return reloadSession()
					.then(z => {
						setMessage(message || '');
						
						router.push(target || '/route');
					})
			})
			.catch(e => {
				setMessage(e.message || 'unknown error')
			})
			.finally(z => setPassword(''))
			;
	}

	return (
		<>
			<Form>
			<Form.Group className="mb-3" controlId="userName">
			  <FloatingLabel className="mb-3" controlId="userName" label="User name">
				<Form.Control ref={userNameControl} type="text" htmlSize="40"
				  value={userName}
				  onChange={e => setUserName(e.target.value)}
				  />
			  </FloatingLabel>
			</Form.Group>

			<Form.Group className="mb-3" controlId="userName">
  			  <FloatingLabel controlId="password" label="Password">
    			<Form.Control type="password" htmlSize="40"
			      value={password}
			      onChange={e => setPassword(e.target.value)}
				  onFocus={e => setMessage('')}
			    />
  			  </FloatingLabel>
            </Form.Group>

			<div className='mt-3 d-flex justify-content-center'>
			  <Button type="submit" variant="primary" onClick={handleLogin}>Sign In</Button>
			</div>
			{
			  message.length > 0 && <UncontrolledAlert className="mt-3" color="danger">{message}</UncontrolledAlert>
		  }
  		  </Form>

		  <div className='mt-2 d-flex justify-content-center'>
		    <SignIn clientId={googleClientId} />
		  </div>

		  <div className='mt-5 d-flex justify-content-center text-muted'>
			<Link href="/">Return Home</Link>
		  </div>
		</>
	)
}