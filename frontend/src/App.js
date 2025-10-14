import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NavigationMenu from './components/NavigationMenu/NavigationMenu';
import HomePage from './pages/HomePage';
import CardsPage from './pages/CardsPage';
import ChartsPage from './pages/ChartsPage';
import ReportsPage from './pages/ReportsPage';
import UserPage from './pages/UserPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Função para autenticar o usuário.
   * FUTURAMENTE: substituir a lógica fictícia por uma chamada à API.
   * 
   * Exemplo de integração com API:
   * - Substitua `URL_DA_API` pela URL correta de autenticação.
   * - Envie `username` e `password` para verificação.
   */
  const handleLogin = async ({ username, password }) => {
    // Simulação de autenticação com credenciais fictícias "admin"
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
    } else {
      // Código para chamada da API
      // try {
      //   const response = await fetch('URL_DA_API/login', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ username, password }),
      //   });
      //   
      //   if (!response.ok) throw new Error('Credenciais incorretas');
      //   const data = await response.json();
      //   setIsAuthenticated(true); // Autentica usuário com sucesso
      // } catch (error) {
      //   alert('Erro de autenticação'); // Exibe mensagem de erro
      // }
      alert('Credenciais incorretas');
    }
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {isAuthenticated && <NavigationMenu />}
        <div style={{ flex: 1, padding: '2rem' }}>
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/charts" element={<ChartsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/user" element={<UserPage />} />
              </>
            ) : (
              <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
