import { Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Tribal Craft',
      text: 'Gear forged by the Nora, Carja, and Tenakth — built to survive the wilds.',
    },
    {
      title: 'Machine Salvage',
      text: 'Components reclaimed from the great machines that roam the Forbidden West.',
    },
    {
      title: 'Override Tech',
      text: 'Ancient Focus-grade devices recovered from the ruins of the Old Ones.',
    },
  ]

  return (
    <>
      <section className="hfw-hero">
        <p className="hfw-eyebrow mb-2">The Daunt · Frontier Settlement</p>
        <h1>Chainscrape Trading Post</h1>
        <div className="hfw-divider" />
        <p>
          Welcome to Chainscrape, traveler — the last dusty stop before the Forbidden West.
          Trade at our stalls for bows, tribal armor, and salvaged tech hauled in from the
          ruins. Every ware is catalogued and ready for the trail ahead.
        </p>
        <Button className="btn-hfw" size="lg" onClick={() => navigate('/products')}>
          Browse the Stalls
        </Button>
      </section>

      <Row className="mt-5 g-4">
        {features.map((f) => (
          <Col md={4} key={f.title}>
            <div className="hfw-card p-4 h-100">
              <h4 className="text-gold mb-2">{f.title}</h4>
              <div
                className="hfw-divider"
                style={{ margin: '0.5rem 0 1rem', marginLeft: 0 }}
              />
              <p className="mb-0">{f.text}</p>
            </div>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Home
