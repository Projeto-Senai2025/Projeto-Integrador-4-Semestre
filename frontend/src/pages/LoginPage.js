import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';

const LoginPage = ({ onLogin }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#95bb7f'
      }}
    >
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default LoginPage;
