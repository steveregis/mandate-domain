import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config';

function TransactionStatus({ authToken }) {
  const [transactions, setTransactions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authToken) return;

    // 1) Fetch all transactions
    fetch(`${BACKEND_URL}/api/transactions`, {
      headers: { Authorization: `Basic ${authToken}` }
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

  // A helper to figure out "pending with" from the tasks for a given transaction
  const findPendingApprovers = (txnId) => {
    // Filter tasks that match this transaction
    // -- This requires that your tasks or your engine store a variable "transactionId"
    // If your TaskDto has no direct reference to transactionId,
    // you might need to fetch "process variables" or find some other linking logic.
    const relevantTasks = tasks.filter(t => t.transactionId === txnId);

    if (relevantTasks.length === 0) {
      return "No Pending Approvals"; 
    }

    // Build a string listing each task's assignee/candidates
    // If your tasks have "assignee" or candidate info, you might store them in TaskDto
    // Example: if t.assignee is null but t.candidateUsers === "cfo"
    return relevantTasks
      .map(t => {
        if (t.assignee) {
          return `Assigned to: ${t.assignee}`;
        } 
        // If your Dto has candidateUsers or candidateGroups, do something like:
        // else if (t.candidateUsers) return `Candidate: ${t.candidateUsers}`;
        return 'Unassigned';
      })
      .join(', ');
  };

  if (!authToken) {
    return <div>Please log in to view transaction statuses.</div>;
  }

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Transaction Status</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Pending With</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.amount}</td>
                <td>{tx.status}</td>
                <td>{findPendingApprovers(tx.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionStatus;
