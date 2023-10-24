import styles from '/styles/Home.module.css'

import {
	HomeCard,
	LogoutCard
} from '/components/nav'

// server side imports
import { fromCookie } from '/lib/users';

export async function getServerSideProps(context) {
	let [user] = fromCookie(context.req, context.res);

	return {
		props: {
			profile: user.snapshot()
		}
	}
}

export default function Profile({ profile }) {
	return (
		<>
		  <h1>Profile</h1>

		  <table>
  		    <thead>
			  <tr>
	  		    <td><b>Key</b></td>
	  		    <td><b>Value</b></td>
			  </tr>
  		    </thead>
  		    <tbody>
		    {
			  Object.keys(profile).map(key => (
				  <tr key={key}>
				    <td>{key}</td>
				    <td>{String(profile[key])}</td>
				  </tr>
			  ))
		    }
  		  </tbody>
		</table>

		<div className={styles.grid}>
		  <HomeCard />
		  <LogoutCard />
		</div>
		</>
	)
}