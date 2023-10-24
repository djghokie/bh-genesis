/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		ENDPOINT_WS: process.env.ENDPOINT_WS,

		GOOGLE_CLIENT_ID: '733720012880-i20vdt5fco8oo4g4cqgrdf63cr3tqo47.apps.googleusercontent.com',
		GOOGLE_CLIENT_SECRET: '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',
	}
}

module.exports = nextConfig
