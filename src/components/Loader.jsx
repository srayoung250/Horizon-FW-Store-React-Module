import { Spinner } from 'react-bootstrap'

function Loader({ message = 'Scanning the frontier…' }) {
  return (
    <div className="text-center py-5">
      <Spinner animation="border" role="status" className="hfw-spinner" />
      <p className="mt-3 hfw-eyebrow">{message}</p>
    </div>
  )
}

export default Loader
