import {
	Card
} from 'react-bootstrap';

export function MetricCard({ title, variant, value }) {
	return (
		<>
		  <Card bg={variant} text="white" className="mb-2">
            <Card.Body>
              <Card.Title as="h6" className='text-uppercase'>{ title }</Card.Title>
              <Card.Text as="h3" className='p-3 fw-bold text-center'>
                { value }
              </Card.Text>
            </Card.Body>
    	  </Card>
		</>
	)
}
