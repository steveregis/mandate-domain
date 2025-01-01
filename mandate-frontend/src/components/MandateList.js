import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../config';


function MandateList({ authToken }) {
  const [mandates, setMandates] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/mandates`, {
      headers: {
        Authorization: `Basic ${authToken}`
      }
    })
      .then(res => res.json())
      .then(data => setMandates(data))
      .catch(err => console.error(err));
  }, [authToken]);

  return (
    <div>
      <h2>Mandate List</h2>
      <Link to="/mandates/create">Create New Mandate</Link>
      <ul>
        {mandates.map(m => (
          <li key={m.id}>
            ID: {m.id}, Account: {m.accountId}, Status: {m.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MandateList;
