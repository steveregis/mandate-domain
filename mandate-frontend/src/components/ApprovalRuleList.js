import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button } from 'react-bootstrap';
import '../styles/styles.css'; // your custom styles
import { BACKEND_URL } from '../config';

function ApprovalRuleList({ authToken }) {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    if (!authToken) return;

    fetch(`${BACKEND_URL}/api/rules`, {
      headers: {
        Authorization: `Basic ${authToken}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch approval rules: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setRules(data))
      .catch(err => console.error(err));
  }, [authToken]);

  if (!authToken) {
    return <div>Please log in to view approval rules.</div>;
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Approval Rule List</h2>
        <Link to="/rules/create">
          <Button variant="primary">Create New Rule</Button>
        </Link>
      </div>

      {rules.length === 0 ? (
        <p>No approval rules found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Rule Name</th>
              <th>Threshold Amount</th>
              <th>Required Signatories</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule.id}>
                <td>{rule.id}</td>
                <td>{rule.ruleName}</td>
                <td>{rule.thresholdAmount}</td>
                <td>{rule.requiredSignatories}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default ApprovalRuleList;
