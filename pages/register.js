import React from 'react';

import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
	UncontrolledAlert
} from 'reactstrap'

import {
	HomeCard
} from '/components/nav'

import styles from '../styles/Home.module.css'

// server side imports

export async function getServerSideProps(context) {
	return {
		props: {
		}
	}
}

export default function RegistrationPage() {
	const [password, setPassword] = React.useState('');
	const [message, setMessage] = React.useState('');

	function handleLogin(e) {
		e.preventDefault();

		let options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				password
			})
		}

		return fetch('/api/auth-password', options)
			.then(res => {
				// console.debug('$$$$$$$', res.status);

				return res.json();
			})
			.then(res => setMessage(res.message))
			.finally(z => setPassword(''))
			;
	}

	return (
		<>
		  <h1>Register</h1>

		  <Form>
			<FormGroup>
			  <Label for="userName">User name</Label>
    		  <Input id="userName" name="userName" size="40"
			  	  placeholder="Enter your user name"
			  	  />
  			</FormGroup>
  			<FormGroup>
    		  <Label for="password">Password</Label>
    		  <Input id="password" type="password" name="password" size="40"
			      placeholder="Enter your password"
			      value={password}
			      onChange={e => setPassword(e.target.value)}
				  onFocus={e => setMessage('')}
				  />
  			</FormGroup>
			<Button onClick={handleLogin}>Sign In</Button>
  		  </Form>

		  {
			  message.length > 0 && <UncontrolledAlert className="mt-3" color="danger">{message}</UncontrolledAlert>
		  }

		  <div className={styles.grid}>
			<HomeCard />
		  </div>
		</>
	)
}
