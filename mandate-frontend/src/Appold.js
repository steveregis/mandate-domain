import React, { useState } from 'react';
import Login from './Login';

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [message, setMessage] = useState('');

  const handleLogin = (token) => {
    setAuthToken(token);
  };

  const callSecureEndpoint = () => {
    if (!authToken) {
      setMessage('You must login first.');
      return;
    }

    // Basic auth header
    //fetch('http://localhost:8080/api/secure/hello', {
    fetch('https://mandate-backend-web.azurewebsites.net/api/secure/hello', {
      headers: {
        'Authorization': `Basic ${authToken}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized or error');
        return res.text();
      })
      .then(text => setMessage(text))
      .catch(err => setMessage(err.message));
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Mandate Frontend - Increment 2</h1>

      {!authToken && <Login onLogin={handleLogin} />}

      <button onClick={callSecureEndpoint}>
        Call Secure Endpoint
      </button>
      
      <p>Result: {message}</p>
    </div>
  );
}

export default App;
