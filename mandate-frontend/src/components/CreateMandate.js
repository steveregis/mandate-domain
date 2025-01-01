import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';



function CreateMandate({ authToken }) {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMandate = { accountId, status, validFrom, validTo };

    fetch(`${BACKEND_URL}/api/mandates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authToken}`
      },
      body: JSON.stringify(newMandate)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create mandate');
        return res.json();
      })
      .then(() => {
        navigate('/mandates'); // Go back to mandates list
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Create Mandate</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Account ID:</label>
          <input value={accountId} onChange={e => setAccountId(e.target.value)} required />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
        <div>
          <label>Valid From:</label>
          <input type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)} />
        </div>
        <div>
          <label>Valid To:</label>
          <input type="date" value={validTo} onChange={e => setValidTo(e.target.value)} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateMandate;
