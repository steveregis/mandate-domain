import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';

function CreateSignatory({ authToken }) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [mandates, setMandates] = useState([]);
  const [selectedMandateId, setSelectedMandateId] = useState('');

  // 1) On component mount, fetch the mandates so the user can pick which Mandate to link
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/mandates`, {
      headers: {
        'Authorization': `Basic ${authToken}`
      }
    })
      .then(res => res.json())
      .then(data => setMandates(data))
      .catch(err => console.error('Failed to fetch mandates:', err));
  }, [authToken]);

  // 2) Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // We expect that `selectedMandateId` is a valid number/string
    if (!selectedMandateId) {
      alert('Please select a mandate.');
      return;
    }

    // Prepare the body
    const signatoryData = {
      userName: fullName,   // or userName if your backend expects userName
      displayName: fullName,
      roleName: role        // or 'role' if that matches your domain
    };

    // 3) POST to /api/signatories/mandate/{selectedMandateId}
    fetch(`${BACKEND_URL}/api/signatories/mandate/${selectedMandateId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`
      },
      body: JSON.stringify(signatoryData)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to create signatory, status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('Created signatory:', data);
      // Navigate back to signatories list (or wherever you like)
      navigate('/signatories');
    })
    .catch(err => {
      console.error(err);
      alert(`Error creating signatory: ${err.message}`);
    });
  };

  return (
    <div>
      <h2>Create Signatory</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label><br />
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label>Role:</label><br />
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
          />
        </div>

        <div>
          <label>Select Mandate:</label><br />
          <select
            value={selectedMandateId}
            onChange={e => setSelectedMandateId(e.target.value)}
          >
            <option value="">-- Choose a Mandate --</option>
            {mandates.map(m => (
              <option key={m.id} value={m.id}>
                {m.id} - {m.accountId} ({m.status})
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Create Signatory</button>
      </form>
    </div>
  );
}

export default CreateSignatory;
