import { Alert, Button } from 'react-bootstrap'

function ErrorMessage({ message, onRetry }) {
  return (
    <Alert variant="danger" className="text-center my-4">
      <Alert.Heading className="hfw-display">Signal Lost</Alert.Heading>
      <p className="mb-3">{message || 'Something went wrong while contacting the network.'}</p>
      {onRetry && (
        <Button variant="outline-light" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Alert>
  )
}

export default ErrorMessage
