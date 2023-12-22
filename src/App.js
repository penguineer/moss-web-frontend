import React, { useState } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import LoginAndRegistration from './LoginAndRegistration';
import UserMenu from './UserMenu';
import { Impressum, Datenschutz } from './legal';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleUserChange = (user) => {
    setCurrentUser(user);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <UserMenu updateUser={handleUserChange} />
        </header>
        <div id="content">
          <Routes>
            <Route path="/" element={
              <div>
                {currentUser && currentUser.id ? (
                  <h1>Welcome, {currentUser.display_name}!</h1>
                ) : (
                  <div>
                    <h1>Welcome!</h1>
                    <Link to="/login">Login</Link>
                  </div>
                )}
              </div>
            } />
            <Route path="/login" element={<LoginAndRegistration user={currentUser} />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
          </Routes>
        </div>
        <footer>
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </footer>
      </div>
    </Router>
  );
}

export default App;