import React from 'react';

import {
	HomeCard,
} from '/components/nav'

import styles from '/styles/Home.module.css'

export default function UnauthorizedPage() {
    return (
		<>
		  <h1 className={styles.title}>Blue Hour</h1>
		  <h2>Unauthorized</h2>

          <div className={styles.grid}>
			<HomeCard />
          </div>
	    </>
    )
}
