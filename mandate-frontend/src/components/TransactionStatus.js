import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import '../styles/styles.css'; // your custom styles
import { BACKEND_URL } from '../config';

function TransactionStatus({ authToken }) {
  const [transactions, setTransactions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authToken) return;

    // 1) Fetch all transactions
    fetch(`${BACKEND_URL}/api/transactions`, {
      headers: {
        Authorization: `Basic ${authToken}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch transactions');
        }
        return res.json();
      })
      .then(data => setTransactions(data))
      .catch(err => setError(err.message));

    // 2) Fetch all active tasks
    fetch(`${BACKEND_URL}/api/workflow/tasks`, {
      headers: { Authorization: `Basic ${authToken}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }
        return res.json();
      })
      .then(data => setTasks(data))
      .catch(err => setError(err.message));
  }, [authToken]);

  // Helper: figure out "pending with" from the tasks for a given transaction
  const findPendingApprovers = (txnId) => {
    // Filter tasks matching this transaction if taskDto has 'transactionId'
    const relevantTasks = tasks.filter(t => t.transactionId === txnId);

    if (relevantTasks.length === 0) {
      return "No Pending Approvals"; 
    }

    // Build a string listing each task's assignee or 'Unassigned'
    return relevantTasks
      .map(t => {
        if (t.assignee) {
          return `Assigned to: ${t.assignee}`;
        }
        // If you have candidateUsers/candidateGroups, you'd display that here
        return 'Unassigned';
      })
      .join(', ');
  };

  if (!authToken) {
    return <div>Please log in to view transaction statuses.</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Transaction Status</h2>

      {error && <p className="text-danger">{error}</p>}

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Pending With</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.amount}</td>
                <td>{tx.status}</td>
                <td>{findPendingApprovers(tx.id)}</td>
                <td>{tx.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default TransactionStatus;
