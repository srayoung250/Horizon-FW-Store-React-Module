import React, { useRef, useState } from "react"; // Added hooks
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import musicIcon from "../assets/music.png";
import backgroundMusic from "../assets/Chainscrape band.mp3";
import brandIcon from "../assets/Side_Quest_Icon.webp";
import backpack from "../assets/Backpack.png";

function NavigationBar() {
  const { totalCount } = useCart();

  // 1. Setup audio ref and play state
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 2. Click handler function
  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.log("Playback prevented by browser rules:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="hfw-navbar"
      sticky="top"
      collapseOnSelect
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="hfw-brand">
          <img src={brandIcon} alt="Chainscrape logo" />
          Chainscrape Outfitters
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="hfw-nav" />
        <Navbar.Collapse id="hfw-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products">
              Product Listing
            </Nav.Link>
            <Nav.Link as={NavLink} to="/add-product">
              Add Product
            </Nav.Link>

            {/* 3. Audio component connected to ref */}
            <audio ref={audioRef} src={backgroundMusic} loop></audio>

            <button
              id="music-btn"
              onClick={toggleMusic}
              className={isPlaying ? "bounce-animation" : ""}
            >
              <img
                src={musicIcon}
                alt="Music Note"
                style={{ opacity: isPlaying ? 1 : 0.5 }}
              />
            </button>

            <Nav.Link as={NavLink} to="/cart" className="hfw-cart-link">
              <span aria-hidden="true">
                <img src={backpack} alt=" Satchel" />
              </span>{" "}
              Satchel
              {totalCount > 0 && (
                <Badge pill bg="" className="hfw-cart-badge ms-1">
                  {totalCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
