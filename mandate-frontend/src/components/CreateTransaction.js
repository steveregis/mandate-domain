import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { BACKEND_URL } from '../config'; // or wherever your config is
import '../styles/styles.css'; // optional custom styles

function CreateTransaction({ authToken }) {
  // Local component states
  const [mandateId, setMandateId] = useState('1'); // defaulting to 1
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('INITIATED');
  const [description, setDescription] = useState(''); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const url = `${BACKEND_URL}/api/transactions/mandate/${mandateId}`;

    const newTxn = {
      amount: parseFloat(amount),
      currency,
      status,
      description
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`
      },
      body: JSON.stringify(newTxn)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to create transaction: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setMessage(`Transaction created with ID: ${data.id}, amount: ${data.amount}`);
      })
      .catch(err => setError(err.message));
  };

  if (!authToken) {
    return <div>Please log in to create a transaction.</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Create Transaction</h2>
      
      {error && <p className="text-danger">Error: {error}</p>}
      {message && <p className="text-success">{message}</p>}

      <Form onSubmit={handleSubmit}>
        {/* Mandate ID */}
        <Form.Group as={Row} className="mb-3" controlId="formMandateId">
          <Form.Label column sm="2">Mandate ID</Form.Label>
          <Col sm="10">
            <Form.Control
              type="number"
              value={mandateId}
              onChange={(e) => setMandateId(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Amount */}
        <Form.Group as={Row} className="mb-3" controlId="formAmount">
          <Form.Label column sm="2">Amount</Form.Label>
          <Col sm="10">
            <Form.Control
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Currency */}
        <Form.Group as={Row} className="mb-3" controlId="formCurrency">
          <Form.Label column sm="2">Currency</Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </Col>
        </Form.Group>

        {/* Status */}
        <Form.Group as={Row} className="mb-3" controlId="formStatus">
          <Form.Label column sm="2">Status</Form.Label>
          <Col sm="10">
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="INITIATED">INITIATED</option>
              <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Description */}
        <Form.Group as={Row} className="mb-3" controlId="formDescription">
          <Form.Label column sm="2">Description</Form.Label>
          <Col sm="10">
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Office Supplies, Consulting Invoice, etc."
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Transaction
        </Button>
      </Form>
    </Container>
  );
}

export default CreateTransaction;
