import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ authToken, onLogout }) {
  if (!authToken) return null; // Hide if not logged in

  return (
    <nav style={{ marginBottom: '1rem' }}>
      <Link to="/mandates" style={{ marginRight: '1rem' }}>
        Mandates
      </Link>
      <Link to="/signatories" style={{ marginRight: '1rem' }}>
        Signatories
      </Link>
      <Link to="/rules" style={{ marginRight: '1rem' }}>
        Approval Rules
      </Link>
      <Link to="/create-transaction" style={{ marginRight: '1rem' }}> Create Transaction </Link>

      <Link to="/start-process" style={{ marginRight: '1rem' }}> Start New Process</Link>

      <Link to="/workflow-tasks" style={{ marginRight: '1rem' }}>
        TaskList
      </Link>

      <Link to="/transaction-status" style={{ marginRight: '1rem' }}>Transaction Status</Link>

      <Link to="/rule-assistant"> Rule Assistant </Link>

      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}

export default NavBar;
