import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button } from 'react-bootstrap';
import '../styles/styles.css'; // Your custom or shared CSS
import { BACKEND_URL } from '../config';

function SignatoryList({ authToken }) {
  const [signatories, setSignatories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authToken) return;

    fetch(`${BACKEND_URL}/api/signatories`, {
      headers: {
        Authorization: `Basic ${authToken}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch signatories: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setSignatories(data))
      .catch(err => setError(err.message));
  }, [authToken]);

  if (!authToken) {
    return <div>Please log in to view signatories.</div>;
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Signatory List</h2>
        <Link to="/signatories/create">
          <Button variant="primary">Create New Signatory</Button>
        </Link>
      </div>

      {error && <p className="text-danger">Error: {error}</p>}

      {signatories.length === 0 ? (
        <p>No signatories found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Display Name</th>
              <th>Role Name</th>
              <th>Mandate</th>
            </tr>
          </thead>
          <tbody>
            {signatories.map(sig => (
              <tr key={sig.id}>
                <td>{sig.id}</td>
                <td>{sig.userName}</td>
                <td>{sig.displayName}</td>
                <td>{sig.roleName}</td>
                <td>
                  {/* If signatory references Mandate, e.g. sig.mandate.id, sig.mandate.accountId */}
                  {sig.mandate
                    ? `Mandate #${sig.mandate.id} (${sig.mandate.accountId})`
                    : '-'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default SignatoryList;
