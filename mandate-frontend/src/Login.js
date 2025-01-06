import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState(''); // optional, if you want an org field

  const handleSubmit = (e) => {
    e.preventDefault();
    // For Basic Auth: create token = btoa(username + ':' + password)
    const token = btoa(`${username}:${password}`);
    // If org is needed for multi-tenant/branding, pass it
    onLogin(token, username, org);
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Login</h2>

      <Form onSubmit={handleSubmit}>
        {/* Username Field */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4">User</Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Password Field */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4">Password</Form.Label>
          <Col sm="8">
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Optional Org Field */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4">Org (Optional)</Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="e.g. ACME Inc."
            />
          </Col>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">
            Log In
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Login;
