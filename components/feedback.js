import React from 'react';

import {
	ToastContainer,
	Toast
} from 'react-bootstrap';

const TOAST_DELAY = 3000;

export const Feedback = React.createContext();

export function AppToast({ content, onClosed }) {
	const [show, setShow] = React.useState(false);

	React.useEffect(z => setShow(true), []);

	function close() {
		setShow(false);

		onClosed(content.id);
	}
  
	return (
		<>
		  <Toast onClose={close} show={show} autohide delay={content.timeout || TOAST_DELAY}>
			<Toast.Header>
			  <strong className="me-auto">{ content.title }</strong>
			  <small>{ content.time }</small>
			</Toast.Header>
			<Toast.Body>{ content.message }</Toast.Body>
		  </Toast>
		</>
	)
}

export function AppToasts({ toasts, onClosed }) {
	return (
		<>
		  <ToastContainer className="p-3" position="bottom-end">
			{ toasts.map(t => <AppToast key={t.id} content={t} onClosed={onClosed} />) }
          </ToastContainer>
		</>
	)
}
