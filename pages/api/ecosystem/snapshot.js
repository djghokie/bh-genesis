import { get } from 'gell-http/next/api'

const ecosystem = require('gell-ecosystem');
const { doWith } = require('gell-ecosystem/command');

const { all, partial } = require('gell/state/snapshot-asap');

export default get(async req => {
	let { attributes } = req.query;

	await doWith(ecosystem);

	if (attributes) {
		let attrArr = attributes.split(',');

		return partial(ecosystem, attrArr);
	} else {
		return all(ecosystem);
	}
});