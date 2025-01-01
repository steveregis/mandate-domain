import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';

function StartProcess({ authToken }) {
  // If you want the user to specify who they are:
  const [initiator, setInitiator] = useState('');

  // We'll fetch all transactions so user can pick which transaction to start
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState('');

  // For display
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // On mount, fetch transactions for the dropdown
  useEffect(() => {
    if (!authToken) return;

    // e.g. GET /api/transactions to list them
    fetch(`${BACKEND_URL}/api/transactions`, {
      headers: { Authorization: `Basic ${authToken}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch transactions');
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

    // You decided to pass initiator, but your backend might or might not need it
    // If your /start-transaction-process doesn't care about initiator, you can omit
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
      .then(data => {
        // e.g. "Started process <xyz> for transaction 123"
        setResult(data);
      })
      .catch(err => setError(err.message));
  };

  if (!authToken) {
    return <div>Please log in to start a process.</div>;
  }

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Start New Approval Process for a Transaction</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <p style={{ color: 'green' }}>{result}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Initiator (Your Username): </label>
          <input
            type="text"
            value={initiator}
            onChange={e => setInitiator(e.target.value)}
            placeholder="e.g. admin, cfo, etc."
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Select a Transaction: </label>
          {transactions.length > 0 ? (
            <select
              value={selectedTransactionId}
              onChange={e => setSelectedTransactionId(e.target.value)}
              required
            >
              <option value="">-- Select Transaction --</option>
              {transactions.map(tx => (
                <option key={tx.id} value={tx.id}>
                  {/* Show transaction ID, plus maybe some Mandate info */}
                  {tx.id} - Mandate: {tx.mandate?.id} - Account: {tx.mandate?.accountId} - Amount: {tx.amount}
                </option>
              ))}
            </select>
          ) : (
            <p>No transactions found. Please create one first.</p>
          )}
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          Start Workflow
        </button>
      </form>
    </div>
  );
}

export default StartProcess;
