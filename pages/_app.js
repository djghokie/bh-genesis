import React from 'react'

import {
	Button
} from 'react-bootstrap';

import Head from 'next/head'
import Link from 'next/link';
import Script from 'next/script';

import { Websocket } from '/components/ws';
import { SignIn as GoogleSignIn } from '/components/google';
import { Feedback, AppToasts } from '/components/feedback';

import { Session } from '/context/session';

import { useGet } from '/hooks/api'
import { useWebsocket, useListener } from '/hooks/ws';

import '/styles/globals.css'
import styles from '/styles/Home.module.css'

function PageHeader({ Component }) {
	const { getLayout, Header, fullScreen } = Component;

	if (fullScreen) return <></>;

	if (Header) return <Header />

	// if (getLayout) return <DefaultHeader />

	return (
		<>
		  <header className='px-3 py-1 d-flex justify-content-start'>
		    <div className='pt-0' style={{ width: '12vw' }}>
			  {/* <Link href="/route" passHref>
				<a>
				  <Image src={logo} layout="responsive" width={30} alt="Blue Hour" />
				</a>
			  </Link> */}
			</div>
		  </header>
		</>
	)
}

function Footer({ session, connected, toggleConnection }) {
	return (
		<>
		  <footer className='px-3 py-2 d-flex justify-content-between align-items-center'>
			<h5 className='mt-2'>
			  <Link href={'/'} passHref>Blue Hour Genesis</Link>
			</h5>

			<div className='mx-5 d-flex align-items-center'>
			  <GoogleSignIn clientId="foo" />
			</div>

			<div className='d-flex align-items-end'>
			  <span className='px-1'>{ session.roles && session.roles.join('; ') }</span>
			  <span className='px-1'>| <Link href={'/session'} passHref>Session</Link></span>
			  <span className='px-1'>| <Link href={'/claims'} passHref>Claims</Link></span>
			  <span className='px-1'>| <Link href={'/logout'} passHref>Logout</Link></span>
			  <Button className="mx-1" variant={connected ? 'success' : 'outline-danger'} onClick={toggleConnection}>
				<i className="fas fa-wifi"></i>
			  </Button>
			</div>
		  </footer>
		</>
	)
}

function PageContent({ Component, ...props }) {
	const { getLayout } = Component;

	if (getLayout) return getLayout(<main className={styles.main}><Component {...pageProps} /></main>)

	return <main className={styles.main}><Component {...props} /></main>
}

export default function GenesisPage({ Component, pageProps }) {
	const [wsSession, setWsSession] = React.useState();
	const [toasts, setToasts] = React.useState([]);

	const [reloadSession, session] = useGet('/api/session', true);

	const [ws, connected, toggleConnection] = useWebsocket(session ? session.userId : undefined);

	useListener(ws, 'message', message => {
		if (!message) return;

		let { runtime } = message;

		if (runtime === 'ws') setWsSession(message.state);
		else if (runtime === 'community' && message.state.type === 'COMMUNITY')
			setCommunity(message.state);
	});

	const { token } = pageProps;
	React.useEffect(z => {
		if (!connected || !token) return;

		ws.send(JSON.stringify({ route: 'authorize', token: pageProps.token }));
	}, [connected, token]);

	function removeToast(id) {
		let newToasts = [];
		toasts.forEach(t => {
			if (t.id !== id) newToasts.push(t);
		})

		setToasts(newToasts);
	}

	// WIP: will eventually be sounds, etc
	const feedback = {
		toast: content => {
			content.id = Date.now();
			setToasts([...toasts, content])
		}
	}

	const componentProps = {
		ws,
		connected,
		wsSession,
		reloadSession
	}

	return (
		<>
      		<Head>
			  <title>Blue Hour - Genesis</title>
        	  <meta name="description" content="for new Blue Hour projects" />
              <link rel="icon" href="/favicon.ico" />
      		</Head>

			<Script src="https://accounts.google.com/gsi/client" />

			<Session.Provider value={{ active: pageProps.session }}>
			  <Websocket.Provider value={ws}>
			    <Feedback.Provider value={feedback}>
  			      <PageHeader Component={Component} />

      		      <PageContent Component={Component} {...pageProps} {...componentProps} />
		        </Feedback.Provider>
			  </Websocket.Provider>
			</Session.Provider>

            <AppToasts toasts={toasts} onClosed={removeToast} />

		    <Footer session={session} connected={connected} toggleConnection={toggleConnection} />
		</>
	)
}
