import { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Button, Alert, ButtonGroup } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  getProducts,
  getProductsByCategory,
  TAXONOMY,
  subtypesFor,
} from '../api.js'
import { useCart } from '../context/CartContext.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import ProductImage from '../components/ProductImage.jsx'
import Shards from '../components/Shards.jsx'

function ProductListing() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [category, setCategory] = useState('all')
  const [subtype, setSubtype] = useState(null)
  const [justAdded, setJustAdded] = useState(null)
  const addedTimer = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { addItem } = useCart()

  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const load = (cat = category, sub = subtype) => {
    setLoading(true)
    setError(null)
    const request = cat === 'all' ? getProducts() : getProductsByCategory(cat, sub)
    request
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load('all', null)
    return () => clearTimeout(addedTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectCategory = (cat) => {
    setCategory(cat)
    setSubtype(null)
    load(cat, null)
  }

  const selectSubtype = (sub) => {
    const next = subtype === sub ? null : sub
    setSubtype(next)
    load(category, next)
  }

  const handleAdd = (product) => {
    addItem(product, 1)
    setJustAdded(product.id)
    clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setJustAdded(null), 1300)
  }

  const categoryFilters = [{ slug: 'all', label: 'All' }, ...TAXONOMY]
  const subtypeFilters = category === 'all' ? [] : subtypesFor(category)

  return (
    <>
      <div className="text-center mb-4">
        <p className="hfw-eyebrow mb-1">The Catalog</p>
        <h1 className="text-gold">Available Wares</h1>
        <div className="hfw-divider" />
      </div>

      {notice && (
        <Alert variant="warning" dismissible onClose={() => setNotice(null)}>
          {notice}
        </Alert>
      )}

      <div className="d-flex justify-content-center mb-3">
        <ButtonGroup className="flex-wrap">
          {categoryFilters.map((f) => (
            <Button
              key={f.slug}
              className={category === f.slug ? 'btn-hfw' : 'btn-hfw-outline'}
              onClick={() => selectCategory(f.slug)}
            >
              {f.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {subtypeFilters.length > 0 && (
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
          {subtypeFilters.map((s) => (
            <button
              key={s.slug}
              type="button"
              className={`hfw-chip ${subtype === s.slug ? 'active' : ''}`}
              onClick={() => selectSubtype(s.slug)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loader message="Loading the catalog…" />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => load()} />
      ) : products.length === 0 ? (
        <p className="text-center hfw-eyebrow py-5">No wares in this category.</p>
      ) : (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {products.map((product) => (
            <Col key={product.id}>
              <Card className="hfw-card">
                <div className="hfw-img-wrap">
                  <ProductImage src={product.image} alt={product.title} />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="card-title">{product.title}</Card.Title>
                  <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                    <span className="hfw-price"><Shards amount={product.price} /></span>
                    <span className="hfw-category-badge">{product.category}</span>
                  </div>
                  <div className="d-flex gap-2 mt-auto">
                    <Button
                      className="btn-hfw-outline flex-grow-1"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      Details
                    </Button>
                    <Button
                      className="btn-hfw"
                      onClick={() => handleAdd(product)}
                    >
                      {justAdded === product.id ? '✓' : '+ Cart'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default ProductListing
