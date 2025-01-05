import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import '../styles/styles.css'; // Your custom CSS
import { BACKEND_URL } from '../config';

function CreateMandate({ authToken }) {
  const navigate = useNavigate();

  // Local states
  const [accountType, setAccountType] = useState('SME');
  const [accountId, setAccountId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMandate = {
      accountType,
      accountId,
      status,
      validFrom,
      validTo
    };

    fetch(`${BACKEND_URL}/api/mandates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authToken}`
      },
      body: JSON.stringify(newMandate)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to create mandate');
        }
        return res.json();
      })
      .then(() => {
        // Navigate back to mandates list
        navigate('/mandates');
      })
      .catch(err => console.error(err));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Create Mandate</h2>

      <Form onSubmit={handleSubmit}>
        {/* Account Type */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Account Type</Form.Label>
          <Col sm="10">
            <Form.Select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="SME">SME</option>
              <option value="CORPORATE">Corporate</option>
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Account ID */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Account ID</Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Status */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Status</Form.Label>
          <Col sm="10">
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Valid From */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Valid From</Form.Label>
          <Col sm="10">
            <Form.Control
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
          </Col>
        </Form.Group>

        {/* Valid To */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Valid To</Form.Label>
          <Col sm="10">
            <Form.Control
              type="date"
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </Container>
  );
}

export default CreateMandate;
