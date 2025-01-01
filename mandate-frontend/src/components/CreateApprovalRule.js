import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';


function CreateApprovalRule({ authToken }) {
  const navigate = useNavigate();
  const [ruleName, setRuleName] = useState('');
  const [thresholdAmount, setThresholdAmount] = useState('');
  const [requiredSignatories, setRequiredSignatories] = useState('');
  const [mandates, setMandates] = useState([]);
  const [selectedMandateId, setSelectedMandateId] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/mandates`, {
      headers: { Authorization: `Basic ${authToken}` }
    })
      .then(res => res.json())
      .then(data => setMandates(data))
      .catch(err => console.error(err));
  }, [authToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRule = {
      ruleName,
      thresholdAmount: parseFloat(thresholdAmount),
      requiredSignatories: parseInt(requiredSignatories, 10)
    };

    fetch(`${BACKEND_URL}/api/rules/mandate/${selectedMandateId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authToken}`
      },
      body: JSON.stringify(newRule)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create rule');
        return res.json();
      })
      .then(() => {
        navigate('/rules');
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Create Approval Rule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rule Name:</label>
          <input value={ruleName} onChange={e => setRuleName(e.target.value)} required />
        </div>
        <div>
          <label>Threshold Amount:</label>
          <input
            type="number"
            step="0.01"
            value={thresholdAmount}
            onChange={e => setThresholdAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Required Signatories:</label>
          <input
            type="number"
            value={requiredSignatories}
            onChange={e => setRequiredSignatories(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Attach to Mandate:</label>
          <select
            value={selectedMandateId}
            onChange={e => setSelectedMandateId(e.target.value)}
            required
          >
            <option value="">--Select Mandate--</option>
            {mandates.map(m => (
              <option key={m.id} value={m.id}>
                {m.id} - {m.accountId}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Rule</button>
      </form>
    </div>
  );
}

export default CreateApprovalRule;
