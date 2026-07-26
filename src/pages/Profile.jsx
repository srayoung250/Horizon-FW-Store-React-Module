import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../firebase";
import { useAuth } from "../context/AuthContext.jsx";
import { Container, Row, Col } from "react-bootstrap";

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load the user's Firestore doc on mount
  useEffect(() => {
    async function loadProfile() {
      if (!currentUser) return;
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setName(snap.data().name || "");
        setAddress(snap.data().address || "");
      }
      setLoading(false);
    }
    loadProfile();
  }, [currentUser]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        name,
        address,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    setError(null);
    try {
      // Delete Firestore doc first, then the auth account
      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(auth.currentUser);
      navigate("/");
    } catch (err) {
      // If this fails with "requires-recent-login", the user needs to
      // log in again before deleting — Firebase requires a fresh session
      // for sensitive actions like account deletion.
      setError(err.message);
    }
  }

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <h2>Your Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Profile updated!</Alert>}

          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={currentUser?.email} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Form>

          <hr className="my-4" />
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
export default Profile;
