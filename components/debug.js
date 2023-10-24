import Link from 'next/link';

import {
	Card,
	CardBody,
	CardTitle,
	Table
} from 'reactstrap'

export function MapCard({ map, title }) {
	if (!map) return <div>map undefined</div>

	function valueToString(val) {
		if (typeof val === 'object') JSON.stringify(val);

		return String(val);
	}

	return (
		<>
		  <Card>
			<CardBody>
			  <CardTitle>{ title || 'Map' }</CardTitle>
			  <dl>
			  {
				  Object.keys(map).map(k => {
					  return (
						  <div key={k} className="row">
						    <dt className="col-sm-4">{k}</dt>
							<dd className="col-sm-8">{valueToString(map[k])}</dd>
						  </div>
					  )
				  })
			  }
		      </dl>
			</CardBody>
		  </Card>
		</>
	)
}

export function MapTable({ map, onDrillDown }) {
	if (!map) return <div>map undefined</div>

	function valueToString(val) {
		if (typeof val === 'object') JSON.stringify(val);

		return String(val);
	}

	return (
		<>
		  <Table striped>
			<thead>
			  <tr>
				<th>Key</th>
				<th>Value</th>
				<th></th>
			  </tr>
			</thead>
			<tbody>
			  {
				  Object.keys(map).map(k => {
					  let val = valueToString(map[k]);
					  let isComplex = typeof map[k] === 'object';

					  return (
						  <tr key={k}>
						    <td>{ isComplex ? <Link href={`${k}`}>{k}</Link> : k }</td>
							<td>{valueToString(map[k])}</td>
						  </tr>
					  )
				  })
			  }
			</tbody>
		  </Table>
		</>
	)
}

export function ArrayTable({ items, attributes }) {
	if (!items) return <div>items undefined</div>
	if (!attributes || attributes.length === 0) return <div>attributes undefined</div>

	function valueToString(val) {
		if (typeof val === 'object') JSON.stringify(val);

		return String(val);
	}

	return (
		<>
		  <Table striped>
			<thead>
			  <tr>
			    {
				  attributes.map(a => <th key={a}>{a}</th>)
			    }
			  </tr>
			</thead>
			<tbody>
			  {
				  items.map(item => {
					  return (
						  <tr key={item.id}>
			    {
				  attributes.map(a => <td key={a}>{valueToString(item[a])}</td>)
			    }
						  </tr>
					  )
				  })
			  }
			</tbody>
		  </Table>
		</>
	)
}
