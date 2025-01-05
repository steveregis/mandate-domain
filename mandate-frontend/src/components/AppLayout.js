import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import '../styles/styles.css'; // your custom styles
import { LinkContainer } from 'react-router-bootstrap'; // optional if you want NavLink integration

function AppLayout({ children, currentUser, onLogout }) {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md">
        <Navbar.Brand className="ms-3">Mandate System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Example links */}
            <LinkContainer to="/mandates">
              <Nav.Link>Mandates</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/workflow-tasks">
              <Nav.Link>Tasks</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/create-transaction">
              <Nav.Link>Transactions</Nav.Link>
            </LinkContainer>
          </Nav>

          <Nav className="ms-auto me-3">
            <Nav.Item className="text-light me-4">
              Logged in as: {currentUser || 'Unknown'}
            </Nav.Item>
            <Nav.Link onClick={onLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container className="app-container">
        {children}
      </Container>
    </>
  );
}

export default AppLayout;
