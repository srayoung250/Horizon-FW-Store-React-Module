import { useEffect, useState } from "react";
import { Row, Col, Button, Alert, Form } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct, deleteProduct, subtypeLabel } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import ProductImage from "../components/ProductImage.jsx";
import Shards from "../components/Shards.jsx";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [qty, setQty] = useState(1);
  const [addedQty, setAddedQty] = useState(0);

  const load = () => {
    setLoading(true);
    setError(null);
    getProduct(id)
      .then((data) => {
        if (!data) throw new Error("Product not found.");
        setProduct(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = () => {
    setDeleting(true);
    deleteProduct(id)
      .then(() => {
        setShowModal(false);
        navigate("/products", {
          state: { notice: `"${product.title}" was deleted.` },
        });
      })
      .catch((err) => {
        setError(err.message);
        setDeleting(false);
        setShowModal(false);
      });
  };

  const handleAddToCart = () => {
    addItem(product, qty);
    setAddedQty(qty);
  };

  if (loading) return <Loader message="Retrieving item data…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!product) return null;

  return (
    <>
      <Row className="g-4 g-lg-5 align-items-start product-item">
        <Link to="/products" className="hfw-link d-inline-block mb-4">
          ← Back to Catalog
        </Link>
        <Col lg={5}>
          <div className="hfw-detail-img">
            <ProductImage
              src={product.image}
              alt={product.title}
              loading="eager"
            />
          </div>
        </Col>

        <Col lg={7}>
          <div className="d-flex flex-wrap gap-2">
            <span className="hfw-category-badge">{product.category}</span>
            {product.subtype && (
              <span className="hfw-category-badge">
                {subtypeLabel(product.category, product.subtype)}
              </span>
            )}
          </div>
          <h1 className="text-gold mt-3">{product.title}</h1>

          {product.rating && (
            <p className="mb-2 hfw-eyebrow">
              Rating {product.rating.rate} / 5 · {product.rating.count} reviews
            </p>
          )}

          <p className="hfw-price" style={{ fontSize: "2rem" }}>
            <Shards amount={product.price} />{" "}
            <span style={{ fontSize: "1rem" }}>shards</span>
          </p>

          <p className="mt-3" style={{ lineHeight: 1.7 }}>
            {product.description}
          </p>

          {addedQty > 0 && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setAddedQty(0)}
              className="mt-3 d-flex justify-content-between align-items-center"
            >
              <span>
                Added {addedQty} × {product.title} to your pack.
              </span>
              <Link to="/cart" className="btn btn-sm btn-hfw-outline ms-3">
                View Cart
              </Link>
            </Alert>
          )}

          <div className="d-flex flex-wrap align-items-center gap-2 mt-4">
            <div className="hfw-qty">
              <Button
                className="hfw-qty-btn"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </Button>
              <Form.Control
                className="hfw-qty-input"
                type="number"
                min="1"
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
              />
              <Button
                className="hfw-qty-btn"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </Button>
            </div>
            <Button className="btn-hfw" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button
              className="btn-hfw-outline"
              onClick={() => navigate(`/edit-product/${product.id}`)}
            >
              Edit
            </Button>
            <Button variant="danger" onClick={() => setShowModal(true)}>
              Delete
            </Button>
          </div>
        </Col>
      </Row>

      {(() => {
        const s = product.stats || {};
        const specs = [
          {
            label: "Type",
            value:
              s.type ||
              (product.subtype &&
                subtypeLabel(product.category, product.subtype)) ||
              product.category,
          },
          { label: "Class", value: s.class },
          { label: "Effects", value: s.effects },
          { label: "Perks", value: s.perks },
          { label: "Mod Slots", value: s.modSlots },
          { label: "Source", value: s.source },
          { label: "Cost to Buy", value: <Shards amount={product.price} /> },
          {
            label: "Value When Sold",
            value:
              s.valueWhenSold != null ? (
                <Shards amount={s.valueWhenSold} />
              ) : null,
          },
          { label: "Fully Upgraded", value: s.fullyUpgraded },
        ].filter(
          (r) => r.value !== null && r.value !== undefined && r.value !== "",
        );

        return (
          <div className="hfw-stats mt-4 mt-lg-5">
            <h3 className="hfw-display">Specifications</h3>
            <div className="hfw-stats-grid">
              {specs.map((r) => (
                <div className="hfw-stat-row" key={r.label}>
                  <span className="hfw-stat-label">{r.label}</span>
                  <span className="hfw-stat-value">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <ConfirmDeleteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleDelete}
        productTitle={product.title}
        deleting={deleting}
      />
    </>
  );
}

export default ProductDetails;
