import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import '../styles/styles.css'; // your custom styles
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
    // If you only want tasks relevant to currentUserId, you might do:
    // const url = `${BACKEND_URL}/api/workflow/tasks?assignee=${currentUserId}`;
    const url = `${BACKEND_URL}/api/workflow/tasks`;

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

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Workflow Tasks</h2>

      {error && <p className="text-danger">Error: {error}</p>}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <Table striped bordered hover>
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
              // Debug line or remove in production
              console.log(
                "Debug Task:", task.id,
                "Assignee:", task.assignee,
                "CurrentUser:", currentUserId
              );

              return (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>{task.assignee || 'Unassigned'}</td>
                  <td>{task.transactionId || '-'}</td>
                  <td>{task.processInstanceId || '-'}</td>
                  <td>
                    {(!task.assignee?.toLowerCase() || task.assignee?.toLowerCase() === '') && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleClaim(task.id)}
                      >
                        Claim
                      </Button>
                    )}

                    {task.assignee?.toLowerCase() === currentUserId?.toLowerCase() && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleComplete(task.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Button variant="info" onClick={fetchTasks} className="mt-3">
        Refresh
      </Button>
    </Container>
  );
}

export default TaskList;
