import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Container } from 'react-bootstrap';
import { BACKEND_URL } from '../config';

function MandateList({ authToken }) {
  const [mandates, setMandates] = useState([]);

  useEffect(() => {
    if (!authToken) return;

    fetch(`${BACKEND_URL}/api/mandates`, {
      headers: {
        Authorization: `Basic ${authToken}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch mandates: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setMandates(data))
      .catch(err => console.error(err));
  }, [authToken]);

  if (!authToken) {
    return <div>Please log in to view mandates.</div>;
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Mandate List</h2>
        <Link to="/mandates/create">
          <Button variant="primary">Create New Mandate</Button>
        </Link>
      </div>

      {mandates.length === 0 ? (
        <p>No mandates found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Account Type</th>
              <th>Account ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mandates.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.accountType}</td>
                <td>{m.accountId}</td>
                <td>{m.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default MandateList;
