// src/components/LoginScreen.jsx
import React, { useState } from 'react';
import { Server, Lock, User, ArrowRight } from 'lucide-react';

/*
  ============================================================================
  NOTE:
  ----------------------------------------------------------------------------
  This login screen is for DEMO / SIMULATION purposes only.
  - No backend authentication
  - No password validation
  - No database connection
  Any username/password combination is accepted to enter the simulation.
  ============================================================================
*/

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Password is UI-only
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated authentication delay (UI/UX purpose only)
    setTimeout(() => {
      if (username.trim().length > 0) {
        onLogin(username.trim());
      } else {
        setError('Username is required to enter the simulation.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #004d7a 0%, #002b45 100%)',
        fontFamily: 'sans-serif'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          width: '350px',
          textAlign: 'center'
        }}
      >
        {/* Logo / Icon */}
        <div
          style={{
            background: '#e6f0f5',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}
        >
          <Server size={32} color="#004d7a" />
        </div>

        <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>NetSim Web</h2>
        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
          Network Simulation & Configuration
        </p>

        {/* Demo Notice */}
        <p
          style={{
            margin: '0 0 25px 0',
            fontSize: '12px',
            color: '#999'
          }}
        >
          Demo mode · Client-side only · No real authentication
        </p>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={inputGroup}>
            <User size={18} color="#888" style={iconStyle} />
            <input
              type="text"
              placeholder="Username / Student ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              autoFocus
            />
          </div>

          {/* Password (Optional / UI only) */}
          <div style={inputGroup}>
            <Lock size={18} color="#888" style={iconStyle} />
            <input
              type="password"
              placeholder="Password (optional, not validated)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              style={{
                color: 'red',
                fontSize: '12px',
                marginBottom: '15px',
                textAlign: 'left'
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#004d7a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
              transition: '0.2s'
            }}
          >
            {loading ? 'Entering Simulation...' : (
              <>
                Start Simulation <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#aaa' }}>
          v1.0.0 · Frontend Demo Mode
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles */
/* -------------------------------------------------------------------------- */

const inputGroup = {
  position: 'relative',
  marginBottom: '15px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 12px 12px 40px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none'
};

const iconStyle = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)'
};
