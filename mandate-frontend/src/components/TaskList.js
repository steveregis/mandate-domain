import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';

function TaskList({ authToken, currentUserId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authToken) return;
    fetchTasks();
  }, [authToken]);

  const fetchTasks = () => {
    setLoading(true);
    const url = `${BACKEND_URL}/api/workflow/tasks`; 
    // If you only want tasks for currentUserId, you might do ?assignee=${currencurrentUserIdtUser}

    fetch(url, {
      headers: { Authorization: `Basic ${authToken}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch tasks: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Claim an unassigned (candidate) task
  const handleClaim = (taskId) => {
    const url = `${BACKEND_URL}/api/workflow/tasks/${taskId}/claim?userId=${currentUserId}`;
    fetch(url, {
      method: 'POST',
      headers: { Authorization: `Basic ${authToken}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to claim task: ${res.status}`);
        }
        return res.text();
      })
      .then(() => fetchTasks())
      .catch(err => setError(err.message));
  };

  // Complete a task assigned to me
  const handleComplete = (taskId) => {
    const url = `${BACKEND_URL}/api/workflow/tasks/${taskId}/complete`;
    fetch(url, {
      method: 'POST',
      headers: { Authorization: `Basic ${authToken}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to complete task: ${res.status}`);
        }
        return res.text();
      })
      .then(() => fetchTasks())
      .catch(err => setError(err.message));
  };

  if (!authToken) {
    return <div>Please log in to view tasks.</div>;
  }

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Workflow Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Name</th>
              <th>Assignee</th>
              <th>Transaction ID</th>
              <th>Process Instance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              // Debug line: see exact values for each row
              console.log(
                "Debug Row -> Task ID:", task.id,
                "Assignee=", task.assignee,
                "currentUser=", currentUserId
              );

              return (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>{task.assignee || 'Unassigned'}</td>
                  <td>{task.transactionId || '-'}</td>
                  <td>{task.processInstanceId || '-'}</td>
                  <td>
                    {/* Show Claim button if assignee == null/empty */}
                    {(!task.assignee?.toLowerCase() || task.assignee?.toLowerCase() === '') && (
                      <button onClick={() => handleClaim(task.id)}>
                        Claim
                      </button>
                    )}

                    {/* Show Complete button if assignee == currentUserId */}
                    {(task.assignee?.toLowerCase() === currentUserId?.toLowerCase()) && (
                      <button onClick={() => handleComplete(task.id)}>
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button onClick={fetchTasks} style={{ marginTop: '1rem' }}>
        Refresh
      </button>
    </div>
  );
}

export default TaskList;
