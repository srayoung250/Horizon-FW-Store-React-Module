import { useEffect, useState } from 'react'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProduct, updateProduct, CATEGORIES, subtypesFor } from '../api.js'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    subtype: '',
  })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [validated, setValidated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const load = () => {
    setLoading(true)
    setLoadError(null)
    getProduct(id)
      .then((data) => {
        if (!data) throw new Error('Product not found.')
        setForm({
          title: data.title || '',
          price: data.price != null ? String(data.price) : '',
          description: data.description || '',
          category: data.category || '',
          subtype: data.subtype || '',
        })
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Changing category invalidates the previously chosen subtype.
  const handleCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value, subtype: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formEl = e.currentTarget
    if (!formEl.checkValidity()) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    setSuccess(false)

    updateProduct(id, {
      title: form.title,
      price: parseFloat(form.price),
      description: form.description,
      category: form.category,
      subtype: form.subtype || null,
    })
      .then(() => setSuccess(true))
      .catch((err) => setSubmitError(err.message))
      .finally(() => setSubmitting(false))
  }

  if (loading) return <Loader message="Loading product data…" />
  if (loadError) return <ErrorMessage message={loadError} onRetry={load} />

  return (
    <Row className="justify-content-center">
      <Col lg={8}>
        <div className="text-center mb-4">
          <p className="hfw-eyebrow mb-1">Update Inventory</p>
          <h1 className="text-gold">Edit Product</h1>
          <div className="hfw-divider" />
        </div>

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
            <Alert.Heading className="hfw-display">Product Updated!</Alert.Heading>
            <p className="mb-2">Your changes were sent to the API successfully.</p>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                className="btn-hfw-outline"
                onClick={() => navigate(`/products/${id}`)}
              >
                View Product
              </Button>
              <Button
                size="sm"
                className="btn-hfw-outline"
                onClick={() => navigate('/products')}
              >
                Back to Catalog
              </Button>
            </div>
            <small className="text-muted d-block mt-2">
              Changes are saved to the merchant's ledger until the server restarts.
            </small>
          </Alert>
        )}

        {submitError && (
          <Alert variant="danger" dismissible onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="hfw-form-panel"
        >
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Product Title</Form.Label>
            <Form.Control
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a title.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price (metal shards)</Form.Label>
            <Form.Control
              name="price"
              type="number"
              step="1"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid price.
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Choose a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a category.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="subtype">
                <Form.Label>Subtype</Form.Label>
                <Form.Select
                  name="subtype"
                  value={form.subtype}
                  onChange={handleChange}
                  disabled={!form.category}
                  required
                >
                  <option value="">
                    {form.category ? 'Choose a subtype…' : 'Select a category first'}
                  </option>
                  {subtypesFor(form.category).map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a subtype.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a description.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex flex-wrap gap-2">
            <Button type="submit" className="btn-hfw" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </Button>
            <Link to={`/products/${id}`} className="btn btn-hfw-outline">
              Cancel
            </Link>
          </div>
        </Form>
      </Col>
    </Row>
  )
}

export default EditProduct
