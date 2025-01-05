import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';



import Login from './Login';
import NavBar from './NavBar';


import MandateList from './components/MandateList';
import CreateMandate from './components/CreateMandate';
import SignatoryList from './components/SignatoryList';
import CreateSignatory from './components/CreateSignatory';
import ApprovalRuleList from './components/ApprovalRuleList';
import CreateApprovalRule from './components/CreateApprovalRule';
import TaskList from './components/TaskList';
import StartProcess from './components/StartProcess';
import CreateTransaction from './components/CreateTransaction';
import TransactionStatus from './components/TransactionStatus';
import RuleAssistant from './components/RuleAssistant';
import AppLayout from './components/AppLayout'; import { ChatProvider } from './components/ChatContext';




function App() {
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentOrg, setCurrentOrg] = useState('');


  const handleLogin = (token, username, org) => {
    setAuthToken(token);
    setCurrentUser(username); // store the logged-in username
    setCurrentOrg(org);

  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentOrg('');

  };

  return (
    <ChatProvider>

      <Router>
        <div style={{ margin: '1rem' }}>
          <h1>Mandate Frontend</h1>
          <div>
            {/* Show login if there's no auth token */}
            {!authToken && <Login onLogin={handleLogin} />}


            {/* If logged in, show nav and routes */}
            {authToken && <><NavBar authToken={authToken} onLogout={handleLogout} /><p style={{ marginLeft: '1rem' }}>
              Logged in as: {currentUser || 'Unknown'}
              {currentOrg && `(Org: ${currentOrg})`}
            </p></>


            }

          </div>

          {authToken && (
            <Routes>
              {/* Mandates */}
              <Route path="/mandates" element={<MandateList authToken={authToken} />} />
              <Route path="/mandates/create" element={<CreateMandate authToken={authToken} />} />

              {/* Signatories */}
              <Route path="/signatories" element={<SignatoryList authToken={authToken} />} />
              <Route path="/signatories/create" element={<CreateSignatory authToken={authToken} />} />

              {/* Approval Rules */}
              <Route path="/rules" element={<ApprovalRuleList authToken={authToken} />} />
              <Route path="/rules/create" element={<CreateApprovalRule authToken={authToken} />} />

              {/* Transactions */}
              <Route
                path="/create-transaction"
                element={<CreateTransaction authToken={authToken} />}
              />

              {/* Tasks */}
              <Route path="/start-process" element={<StartProcess authToken={authToken} currentUserId={currentUser} />} />

              <Route path="/workflow-tasks" element={<TaskList authToken={authToken} currentUserId={currentUser} />} />

              {/* Transaction Status */}
              <Route path="/transaction-status" element={<TransactionStatus authToken={authToken} currentUserId={currentUser} />} />

              {/*  Chat Routes */}

              <Route path="/rule-assistant" element={<RuleAssistant />} />

            </Routes>
          )}
        </div>
      </Router></ChatProvider>

  );
}

export default App;
