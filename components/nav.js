import React from 'react';

import Link from 'next/link';

import {
	Breadcrumb,
	BreadcrumbItem,
} from 'reactstrap'

import {
	Card,
} from 'react-bootstrap';

import styles from '../styles/Home.module.css'

export function NavCard({ href, label, description }) {
	return (
		<Link href={href} passHref>
		  <div className={styles.card}>
		    <h2>{label} &rarr;</h2>
		    <p>{description}</p>
		  </div>
	    </Link>
	)
}

export function HomeCard() {
	return <NavCard href="/" label="Home" description="Return to home page" />
}

export function LoginCard() {
	return <NavCard href="/login" label="Login" description="User initiated login" />
}

export function LogoutCard() {
	return <NavCard href="/logout" label="Logout" description="End session" />
}

export function SessionCard() {
	return <NavCard href="/session" label="Session" description="Session related information" />
}

export function ProfileCard() {
	return <NavCard href="/profile" label="Profile" description="Authenticated users's profile" />
}

export function ClaimsCard() {
	return <NavCard href="/claims" label="Claims" description="Server issued claims about the user" />
}

export function SiteNav({ session, user, links }) {
	// const userLabel = user ? (user.userName || user.id) : '';
	const userLabel = user.userName || 'anonymous';

	return (
		<>
		  <Card>
			<Card.Body>
			  <div className='text-center'>
			    <img className="img img-raised" src="/img/user.png" />
				<div className='mt-3 small'>{userLabel}</div>
			  </div>

			  <hr />

			  {
				  links.map(l => {
					  if (!l.label) return <hr key={l.id} />
					  return <div key={l.label} className='my-1'><Link href={l.href}>{l.label}</Link></div>
				  })
			  }
			</Card.Body>
			<Card.Footer>
			  <div className='d-flex justify-content-end'>
			    { !session.isAuthenticated && <Link href="/login">Login</Link> }
			    { session.isAuthenticated && <Link href="/logout">Logout</Link> }
			  </div>
			</Card.Footer>
		  </Card>
		</>
	)
}

export function PageBreadcrumb({ title }) {
	return (
		<>
		  <div>
			<Breadcrumb>
			  <BreadcrumbItem>
			    <Link href="/route">Home</Link>
			  </BreadcrumbItem>
			  <BreadcrumbItem active>{title}</BreadcrumbItem>
			</Breadcrumb>
		  </div>
		</>
	)
}
