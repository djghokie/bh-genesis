import React from 'react';

import {
	HomeCard,
	ClaimsCard,
} from '/components/nav'

import styles from '/styles/Home.module.css'

export default function HomePage() {
    return (
		<>
		  <h1 className={styles.title}>Blue Hour</h1>
		  <h2>Admin</h2>

          <div className={styles.grid}>
			<HomeCard />
			<ClaimsCard />
          </div>
	    </>
    )
}