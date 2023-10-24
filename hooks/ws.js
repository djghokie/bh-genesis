import React from 'react';

/**
 * WIP
 * 	- using client side environment variable here
 * 		- might make more sense to do this server side
 * 		- part of Configuration
 */
const ENDPOINT = process.env.ENDPOINT_WS;

export function useWebsocket(userId) {
	const [ws, setWs] = React.useState();
	const [connected, setConnected] = React.useState(false);
	const [reconnectTs, setReconnectTs] = React.useState();

	/*
	React.useEffect(z => {
		if (!session || !session.userId) return;

		console.debug(`connecting to ecosystem (url=${ENDPOINT}); user=${session.userId}`);

		let t;

		let ws = new ReconnectingWebSocket(ENDPOINT, [], { maxEnqueuedMessages: 0, debug: false });
		ws.onclose = z => {
			console.debug('ws connection closed');
		}
		ws.onopen = z => {
			console.debug('ws connection opened');

			t = setTimeout(z => {
				console.debug('sending authorize message');

				ws.send(JSON.stringify({ route: 'session-authorize', userId: session.userId }));

				console.debug('authorize message sent');
			}, 5000)
		}
		ws.onmessage = event => {
			let message = JSON.parse(event.data);

			console.debug('$$$$$', message);
		}

		setWs(ws);

		return z => {
			console.debug('^^^^^^^');

			clearTimeout(t);

			return ws.close();
		}
	}, [session])
	*/

	React.useEffect(z => {
		if (!ENDPOINT) {
			console.warn('ENDPOINT_WS environment variable not defined; websockets will not be used');

			return;
		}
	}, [ENDPOINT])

	React.useEffect(z => {
		if (!userId || !ENDPOINT) return;

		let ws;

		/**
		 * Effect will run twice (React 18); initialize websocket on second go round
		 */
		let t = setTimeout(z => {
			ws = new WebSocket(ENDPOINT);

			ws.addEventListener('open', z => {
				console.debug('authorizing websocket connection');

				setConnected(true);

				ws.send(JSON.stringify({ route: 'session-authorize', userId }));
			});
			ws.addEventListener('error', e => console.debug('websocket connection error', e));
			ws.addEventListener('close', z => {
				console.debug('websocket connection closed');

				setConnected(false);

				setWs();
			});

			setWs(ws);
		}, 1000);

		return z => {
			clearTimeout(t);

			if (ws) ws.close();

			setWs();
		}
	}, [ENDPOINT, userId, reconnectTs]);

	function toggle() {
		if (connected && ws) ws.close();
		else if (!connected) setReconnectTs(Date.now());
	}

	return [ws, connected, toggle];
}

/**
 * WIP: might be some problems with this hook
 * 	- listener isn't scoped right
 * 
 * @param {*} ws 
 * @param {*} eventName 
 * @param {*} listener 
 */
export function useListener(ws, eventName, listener) {
	React.useEffect(z => {
		if (!ws) return;

		let ml = event => {
			let message = event.data ? JSON.parse(event.data) : undefined;

			listener(message);
		}

		ws.addEventListener(eventName, ml);

		return z => ws.removeEventListener(eventName, ml);
	}, [ws]);
}

export function useMessageSender(ws) {
	return message => {
		if (ws) ws.send(JSON.stringify(message));
	}
}