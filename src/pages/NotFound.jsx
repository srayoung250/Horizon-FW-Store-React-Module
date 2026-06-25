import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="text-center py-5">
      <p className="hfw-eyebrow mb-2">Error 404</p>
      <h1 className="text-gold">Off the Map</h1>
      <div className="hfw-divider" />
      <p className="mt-3">This trail leads nowhere. The page you seek isn't here.</p>
      <Button className="btn-hfw mt-2" onClick={() => navigate('/')}>
        Return Home
      </Button>
    </div>
  )
}

export default NotFound
