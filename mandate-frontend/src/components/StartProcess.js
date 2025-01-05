import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import '../styles/styles.css'; // Your custom CSS if needed
import { BACKEND_URL } from '../config';

function StartProcess({ authToken }) {
  // If your /start-transaction-process endpoint expects 'initiator', keep it:
  const [initiator, setInitiator] = useState('');

  // We'll fetch all transactions so user can pick which transaction to start
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState('');

  // For display
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Fetch transactions on mount (if logged in)
  useEffect(() => {
    if (!authToken) return;

    fetch(`${BACKEND_URL}/api/transactions`, {
      headers: { Authorization: `Basic ${authToken}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch transactions: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setTransactions(data))
      .catch(err => setError(err.message));
  }, [authToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult('');
    setError('');

    // Build the URL. If your backend doesn't need initiator, omit it
    const url = `${BACKEND_URL}/api/workflow/start-transaction-process?transactionId=${selectedTransactionId}&initiator=${initiator}`;

    fetch(url, {
      method: 'POST',
      headers: { Authorization: `Basic ${authToken}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to start process: ${res.status}`);
        }
        return res.text();
      })
      .then(msg => {
        // e.g. "Started process <xyz> for transaction 123"
        setResult(msg);
      })
      .catch(err => setError(err.message));
  };

  if (!authToken) {
    return <div>Please log in to start a process.</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Start New Approval Process</h2>

      {error && <p className="text-danger">{error}</p>}
      {result && <p className="text-success">{result}</p>}

      <Form onSubmit={handleSubmit}>
        {/* Initiator Field */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Initiator</Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={initiator}
              onChange={(e) => setInitiator(e.target.value)}
              placeholder="e.g. admin, cfo, etc."
            />
          </Col>
        </Form.Group>

        {/* Transaction Select */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Select Transaction</Form.Label>
          <Col sm="10">
            {transactions.length > 0 ? (
              <Form.Select
                value={selectedTransactionId}
                onChange={(e) => setSelectedTransactionId(e.target.value)}
                required
              >
                <option value="">-- Select Transaction --</option>
                {transactions.map(tx => (
                  <option key={tx.id} value={tx.id}>
                    {/* Show transaction ID, plus maybe some Mandate info */}
                    {tx.id} - Mandate: {tx.mandate?.id} - 
                    Account: {tx.mandate?.accountId} - 
                    Amount: {tx.amount}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <p>No transactions found. Please create one first.</p>
            )}
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Start Workflow
        </Button>
      </Form>
    </Container>
  );
}

export default StartProcess;
