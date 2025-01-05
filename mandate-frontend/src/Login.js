import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState(''); // optional, if you want an org

  const handleSubmit = (e) => {
    e.preventDefault();
    // For Basic Auth: create token = btoa(username + ':' + password)
    const token = btoa(`${username}:${password}`);
    // If you need org for multi-tenant or branding, pass it too
    onLogin(token, username, org);
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '1rem' }}>
      <h2>Login</h2>
      <div>
        <label>User:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {/* Optional Org field */}
      <div style={{ marginTop: '0.5rem' }}>
        <label>Org (Optional):</label>
        <input
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
        />
      </div>

      <button type="submit" style={{ marginTop: '1rem' }}>
        Log In
      </button>
    </form>
  );
}

export default Login;
