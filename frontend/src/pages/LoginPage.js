import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';

const LoginPage = ({ onLogin }) => {
  return (
    <div style={{ display: 'flex',marginTop: '80px', justifyContent: 'center', alignItems: 'center', height: '45vh',borderRadius:'20px', backgroundColor: '#333' }}>
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default LoginPage;
