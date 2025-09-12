import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import logo from '../../assets/logo.webp';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password }); // Envia o objeto com nome de usuário e senha
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>
      
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Entrar</button>
    </form>
  );
};

export default LoginForm;
