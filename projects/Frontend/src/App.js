import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import NavigationMenu from './components/NavigationMenu/NavigationMenu';
import HomePage from './pages/HomePage';
import CardsPage from './pages/CardsPage';
import ChartsPage from './pages/ChartsPage';
import ReportsPage from './pages/ReportsPage';
import UserPage from './pages/UserPage';
 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  // Verifica se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
 
  // Função para autenticar o usuário usando a API
  const handleLogin = async ({ username, password }) => {
    try {
      const response = await axios.get('http://localhost:5271/api/Login');
      const data = response.data;
 
      // Verifica se existe um usuário com as credenciais fornecidas
      const user = data.find((user) => user.nome === username && user.senha === password);
 
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true'); // Salva o estado de autenticação
      } else {
        alert('Credenciais incorretas');
      }
    } catch (error) {
      console.error("Erro de autenticação:", error);
      alert('Erro ao tentar autenticar');
    }
  };
 
  // Função para fazer logout e limpar o estado de autenticação
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Remove o estado de autenticação
  };
 
  return (
<Router>
<div style={{ display: 'flex' }}>
        {isAuthenticated && <NavigationMenu onLogout={handleLogout} />}
<div style={{ flex: 1, padding: '2rem' }}>
<Routes>
            {isAuthenticated ? (
<>
<Route path="/" element={<HomePage />} />
<Route path="/cards" element={<CardsPage />} />
<Route path="/charts" element={<ChartsPage />} />
<Route path="/reports" element={<ReportsPage />} />
<Route path="/user" element={<UserPage />} />
<Route path="*" element={<Navigate to="/" />} /> {/* Redireciona para HomePage se a rota não existir */}
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