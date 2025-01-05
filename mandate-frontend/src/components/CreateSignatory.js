import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import '../styles/styles.css'; // same stylesheet as CreateMandate for consistent styling
import { BACKEND_URL } from '../config';

function CreateSignatory({ authToken }) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [mandates, setMandates] = useState([]);
  const [selectedMandateId, setSelectedMandateId] = useState('');

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
      .catch(err => console.error('Failed to fetch mandates:', err));
  }, [authToken]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMandateId) {
      alert('Please select a mandate.');
      return;
    }

    const signatoryData = {
      userName: fullName,  // adjust if your backend expects a different field name
      displayName: fullName,
      roleName: role
    };

    fetch(`${BACKEND_URL}/api/signatories/mandate/${selectedMandateId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authToken}`
      },
      body: JSON.stringify(signatoryData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to create signatory: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Created signatory:', data);
        navigate('/signatories'); // go back to signatory list or wherever
      })
      .catch(err => {
        console.error(err);
        alert(`Error creating signatory: ${err.message}`);
      });
  };

  if (!authToken) {
    return <div>Please log in to create a signatory.</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Create Signatory</h2>

      <Form onSubmit={handleSubmit}>
        {/* Full Name */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Full Name</Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Role */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Role</Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </Col>
        </Form.Group>

        {/* Select Mandate */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Mandate</Form.Label>
          <Col sm="10">
            <Form.Select
              value={selectedMandateId}
              onChange={(e) => setSelectedMandateId(e.target.value)}
              required
            >
              <option value="">-- Choose a Mandate --</option>
              {mandates.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id} - {m.accountId} ({m.status})
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Signatory
        </Button>
      </Form>
    </Container>
  );
}

export default CreateSignatory;
