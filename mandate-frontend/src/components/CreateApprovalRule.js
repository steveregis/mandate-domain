import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import '../styles/styles.css'; // Your custom styles
import { BACKEND_URL } from '../config';

function CreateApprovalRule({ authToken }) {
  const navigate = useNavigate();

  // Local states
  const [ruleName, setRuleName] = useState('');
  const [thresholdAmount, setThresholdAmount] = useState('');
  const [requiredSignatories, setRequiredSignatories] = useState('');
  const [mandates, setMandates] = useState([]);
  const [selectedMandateId, setSelectedMandateId] = useState('');

  useEffect(() => {
    if (!authToken) return;

    fetch(`${BACKEND_URL}/api/mandates`, {
      headers: { Authorization: `Basic ${authToken}` }
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
        if (!res.ok) {
          throw new Error('Failed to create rule');
        }
        return res.json();
      })
      .then(() => {
        // Navigate back to the rules list
        navigate('/rules');
      })
      .catch(err => console.error(err));
  };

  if (!authToken) {
    return <div>Please log in to create an approval rule.</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Create Approval Rule</h2>

      <Form onSubmit={handleSubmit}>
        {/* Rule Name */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Rule Name</Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              value={ruleName}
              onChange={e => setRuleName(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Threshold Amount */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Threshold Amount</Form.Label>
          <Col sm="10">
            <Form.Control
              type="number"
              step="0.01"
              value={thresholdAmount}
              onChange={e => setThresholdAmount(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Required Signatories */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Required Signatories</Form.Label>
          <Col sm="10">
            <Form.Control
              type="number"
              value={requiredSignatories}
              onChange={e => setRequiredSignatories(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Attach to Mandate */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Attach to Mandate</Form.Label>
          <Col sm="10">
            <Form.Select
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
            </Form.Select>
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Rule
        </Button>
      </Form>
    </Container>
  );
}

export default CreateApprovalRule;
