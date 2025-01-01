import React, { useState } from 'react';

// Optional: if you have a config.js that exports BACKEND_URL, import it:
import { BACKEND_URL } from '../config';

function CreateTransaction({ authToken }) {
  // Local component states
  const [mandateId, setMandateId] = useState('1'); // defaulting to 1
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('INITIATED');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // If you do not have a config, you can directly use "http://localhost:8080"
    const url = `${BACKEND_URL}/api/transactions/mandate/${mandateId}`;

    // Build the JSON body
    const newTxn = {
      amount: parseFloat(amount), // parse float if needed
      currency,
      status
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
        // data is the Transaction object returned by your backend
        setMessage(`Transaction created with ID: ${data.id}, amount: ${data.amount}`);
      })
      .catch(err => setError(err.message));
  };

  if (!authToken) {
    return <div>Please log in to create a transaction.</div>;
  }

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Create Transaction</h2>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Mandate ID: </label>
          <input
            type="number"
            value={mandateId}
            onChange={e => setMandateId(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Amount: </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Currency: </label>
          <input
            type="text"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Status: </label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="INITIATED">INITIATED</option>
            <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        <button type="submit">Create Transaction</button>
      </form>
    </div>
  );
}

export default CreateTransaction;
