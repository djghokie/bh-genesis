import React from 'react';

import { SiteNav } from '/components/nav';

export function SignInHtml() {
	return (
		<>
        <div id="g_id_onload"
        	data-client_id={clientId}
        	data-login_uri="http://localhost:12700/google/auth"
        	data-auto_prompt="false">
      	</div>
        <div className="g_id_signin"
        	data-type="standard"
        	data-size="large"
        	data-theme="outline"
        	data-text="sign_in_with"
        	data-shape="rectangular"
        	data-logo_alignment="left">
        </div>
		</>
	)
}

/**
 * Renders the Google Sign In button via javascript
 * 
 * WIP: this is the only way i could get the button to consistently render on page navigation
 * 	- something to do with the script loading
 * 	- HTML component did not work consistently
 */
export function SignIn({ clientId }) {
	const signInButton = React.useRef(null);

	React.useEffect(z => {
		if (!window.google) return;

		window.google.accounts.id.initialize({
            client_id: clientId,
			ux_mode: 'redirect',
			login_uri: 'http://localhost:12700/google/callback/authn'
            // callback: handleCredentialResponse
          });

        window.google.accounts.id.renderButton(
            signInButton.current,
            { theme: "outline", size: "large" }  // customization attributes
        );
	}, [clientId]);

	return <div ref={signInButton}></div>
}

export function DashboardNav({ user }) {
	const LINKS = [{
		label: 'Profile',
		href: '/google/profile'
	}, {
		id: 'hr-1',
	}, {
		label: 'Calendar',
		href: '/google/calendar'
	}];

	return <SiteNav user={user} links={LINKS} />
}