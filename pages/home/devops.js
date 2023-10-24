import React from 'react';

import {
	HomeCard,
	NavCard,
} from '/components/nav'

import styles from '/styles/Home.module.css'

// server side imports
import deps from '/lib/dependencies';
import { protectedPage } from '/lib/handlers';
import { init } from 'gell/future'

let handler = protectedPage(deps);
let [$handler, config] = init(handler);

export async function getServerSideProps(context) {
	config.set('allowedRoles', ['operator']);

	return $handler.next(context).value;
}

export default function Home({ session }) {
	let { isAuthenticated } =  session;

    return (
		<>
		  <h1 className={styles.title}>Blue Hour</h1>
		  <h2>DevOps</h2>

          <div className={styles.grid}>
			<HomeCard />
			<NavCard href="/ecosystem" label="Ecosystem" description="Snapshot of current Ecosystem" />
			<NavCard href="/devops/ws" label="Websockets" description="Websocket monitoring" />
          </div>
	    </>
    )
}