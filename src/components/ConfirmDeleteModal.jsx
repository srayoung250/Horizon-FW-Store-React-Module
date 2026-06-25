import { Modal, Button } from "react-bootstrap";

function ConfirmDeleteModal({
  show,
  onHide,
  onConfirm,
  productTitle,
  deleting,
}) {
  return (
    <Modal show={show} onHide={onHide} centered className="hfw-modal">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="hfw-display text-gold">
          Decommission Item
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete{" "}
        <strong className="text-glow">{productTitle || "this product"}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn-hfw-outline"
          onClick={onHide}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;
