import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../config';


function ApprovalRuleList({ authToken }) {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/rules`, {
      headers: {
        Authorization: `Basic ${authToken}`
      }
    })
      .then(res => res.json())
      .then(data => setRules(data))
      .catch(err => console.error(err));
  }, [authToken]);

  return (
    <div>
      <h2>Approval Rule List</h2>
      <Link to="/rules/create">Create New Rule</Link>
      <ul>
        {rules.map(r => (
          <li key={r.id}>
            ID: {r.id}, Name: {r.ruleName}, Threshold: {r.thresholdAmount}, Required Signatories: {r.requiredSignatories}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApprovalRuleList;
