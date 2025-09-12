import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLeaf, FaThermometerHalf, FaTint, FaWater, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const [temperature, setTemperature] = useState(0); // Estado para temperatura
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get('http://localhost:5271/api/Login');
        const data = response.data[0];
        setUserName(data.nome);
      } catch (error) {
        console.error('Erro ao buscar o nome do usuário:', error);
      }
    };

    fetchUserName();
  }, []);

  // Simulação de leitura de temperatura (pode vir da sua API depois)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTemp = Math.floor(Math.random() * 45); // Gera temperatura aleatória 0-45
      setTemperature(randomTemp);
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // Verifica limite da temperatura e dispara alerta
  useEffect(() => {
    if (temperature > 30) { // aqui você define o limite
      alert(`🚨 Atenção: Temperatura atingiu ${temperature}°C! Necessário cuidado imediato.`);
    }
  }, [temperature]);

  return (
    <div style={{ position: 'relative', padding: '1.5rem' }}>
      {/* Ícone de Notificação */}
      <FaBell
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          fontSize: '1.8rem',
          color: '#FF5733',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/notificacoes')}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'justify',
          backgroundColor: '#f4f4f9',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          maxHeight: '75vh',
          overflowY: 'auto',
          margin: '20px auto',
          padding: '1.5rem'
        }}
      >
        <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>
          Bem-vindo, {userName}!
        </h1>

        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          <FaLeaf style={{ marginRight: '0.5rem', color: '#4CAF50' }} />
          Bem-vindo à sua plataforma de monitoramento para estufas inteligentes! Aqui, você acompanha
          temperatura, umidade do ar e do solo para um cultivo ideal.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: '#333', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Estufa Inteligente
        </h2>

        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.5', marginBottom: '0.5rem' }}>
          <FaThermometerHalf style={{ marginRight: '0.5rem', color: '#FF5733' }} />
          Temperatura atual: <strong>{temperature}°C</strong>
        </p>

        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.5', marginBottom: '0.5rem' }}>
          <FaTint style={{ marginRight: '0.5rem', color: '#337AFF' }} />
          Monitora e ajusta a umidade do ar de acordo com as necessidades das plantas.
        </p>

        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.5', marginBottom: '1rem' }}>
          <FaWater style={{ marginRight: '0.5rem', color: '#33FF57' }} />
          Gerencia a irrigação e a umidade do solo para evitar desperdícios e otimizar o crescimento.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
