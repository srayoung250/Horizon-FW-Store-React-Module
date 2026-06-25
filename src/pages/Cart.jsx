import { useState } from "react";
import { Row, Col, Button, Alert, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import ProductImage from "../components/ProductImage.jsx";
import Shards from "../components/Shards.jsx";

function QtyStepper({ item, setQty }) {
  return (
    <div className="hfw-qty">
      <Button
        className="hfw-qty-btn"
        aria-label="Decrease quantity"
        onClick={() => setQty(item.id, item.qty - 1)}
      >
        −
      </Button>
      <Form.Control
        className="hfw-qty-input"
        type="number"
        min="0"
        value={item.qty}
        onChange={(e) => setQty(item.id, parseInt(e.target.value, 10) || 0)}
      />
      <Button
        className="hfw-qty-btn"
        aria-label="Increase quantity"
        onClick={() => setQty(item.id, item.qty + 1)}
      >
        +
      </Button>
    </div>
  );
}

function Cart() {
  const { items, setQty, removeItem, clear, totalCount, totalPrice } =
    useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  if (checkedOut) {
    return (
      <div className="text-center py-5">
        <p className="hfw-eyebrow mb-2">Transaction Complete</p>
        <h1 className="text-gold">Safe Travels, Traveler</h1>
        <div className="hfw-divider" />
        <p className="mt-3">
          Your shards have been counted and your pack is loaded. The trail
          awaits.
        </p>
        <Link to="/products" className="btn btn-hfw mt-2">
          Back to the Catalog
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="hfw-eyebrow mb-2">Your Pack</p>
        <h1 className="text-gold">The Pack Is Empty</h1>
        <div className="hfw-divider" />
        <p className="mt-3">
          No wares yet. Visit the merchant to stock up for the journey.
        </p>
        <Link to="/products" className="btn btn-hfw mt-2">
          Browse the Catalog
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    clear();
    setCheckedOut(true);
  };

  return (
    <>
      <div className="text-center mb-4">
        <p className="hfw-eyebrow mb-1">Your Pack</p>
        <h1 className="text-gold">Cart</h1>
        <div className="hfw-divider" />
      </div>

      <div className="hfw-cart-list">
        {items.map((item) => (
          <Row key={item.id} className="align-items-center hfw-cart-row g-3">
            <Col xs={3} sm={2}>
              <div className="hfw-cart-thumb">
                <ProductImage src={item.image} alt={item.title} />
              </div>
            </Col>
            <Col xs={9} sm={4}>
              <Link to={`/products/${item.id}`} className="hfw-link fw-bold">
                {item.title}
              </Link>
              <div className="hfw-price mt-1" style={{ fontSize: "1rem" }}>
                <Shards amount={item.price} /> each
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <QtyStepper item={item} setQty={setQty} />
            </Col>
            <Col xs={4} sm={2} className="text-sm-end">
              <span className="hfw-price">
                <Shards amount={item.price * item.qty} />
              </span>
            </Col>
            <Col xs={2} sm={1} className="text-end">
              <Button
                variant="link"
                className="hfw-remove"
                aria-label={`Remove ${item.title}`}
                onClick={() => removeItem(item.id)}
              >
                ✕
              </Button>
            </Col>
          </Row>
        ))}
      </div>

      <Row className="mt-4">
        <Col md={{ span: 5, offset: 7 }}>
          <div className="hfw-form-panel">
            <div className="d-flex justify-content-between mb-2">
              <span className="items">Items</span>
              <span className="items">{totalCount}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="hfw-display items">Total</span>
              <span className="hfw-price" style={{ fontSize: "1.6rem" }}>
                <Shards amount={totalPrice} />
              </span>
            </div>
            <Alert variant="info" className="py-2 small">
              Checkout is a demo — no real shards will be spent.
            </Alert>
            <div className="d-grid gap-2">
              <Button className="btn-hfw" onClick={handleCheckout}>
                Trade shards with shop keeper
              </Button>
              <Button className="btn-hfw-outline" onClick={clear}>
                Clear Satchel
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Cart;
