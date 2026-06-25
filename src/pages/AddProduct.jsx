import { useState } from 'react'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { createProduct, CATEGORIES, subtypesFor } from '../api.js'

const EMPTY = { title: '', price: '', description: '', category: '', subtype: '' }

function AddProduct() {
  const [form, setForm] = useState(EMPTY)
  const [validated, setValidated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

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
    setError(null)
    setResult(null)

    createProduct({
      title: form.title,
      price: parseFloat(form.price),
      description: form.description,
      category: form.category,
      subtype: form.subtype || null,
    })
      .then((data) => {
        setResult(data)
        setForm(EMPTY)
        setValidated(false)
      })
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false))
  }

  return (
    <Row className="justify-content-center">
      <Col lg={8}>
        <div className="text-center mb-4">
          <p className="hfw-eyebrow mb-1">New Inventory</p>
          <h1 className="text-gold">Add a Product</h1>
          <div className="hfw-divider" />
        </div>

        {result && (
          <Alert variant="success" dismissible onClose={() => setResult(null)}>
            <Alert.Heading className="hfw-display">Product Created!</Alert.Heading>
            <p className="mb-1">
              "{result.title || form.title}" was added to the merchant's stock
              {result.id ? ` (assigned ID ${result.id})` : ''}.
            </p>
            <small className="text-muted">
              It will appear in the catalog until the server restarts (in-memory store).
            </small>
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
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
              placeholder="e.g. Nora Brave Tunic"
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
              placeholder="0"
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
              placeholder="Describe the item…"
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
              {submitting ? 'Creating…' : 'Create Product'}
            </Button>
            <Link to="/products" className="btn btn-hfw-outline">
              Cancel
            </Link>
          </div>
        </Form>
      </Col>
    </Row>
  )
}

export default AddProduct
