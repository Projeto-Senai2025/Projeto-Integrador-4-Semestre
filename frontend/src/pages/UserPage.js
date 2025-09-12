import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserInfoCard from '../components/UserInfoCard/UserInfoCard';
 
const UserPage = () => {
  const [userData, setUserData] = useState({
    id: 1, // ID do usuário para atualização; ajuste conforme necessário
    name: 'João da Silva',
    password: '********', // Senha fictícia oculta
  });
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(userData.name);
  const [newPassword, setNewPassword] = useState('');
 
  // Função para buscar os dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5271/api/Login/${userData.id}`);
        setUserData({
          id: response.data.id,
          name: response.data.nome,
          password: '********', // Oculta a senha real
        });
        setNewName(response.data.nome);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
 
    fetchUserData();
  }, [userData.id]);
 
  // Função para salvar as alterações
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5271/api/Login/${userData.id}`, {
        id: userData.id,
        nome: newName,
        senha: newPassword,
      });
 
      setUserData({ ...userData, name: newName });
      setEditMode(false);
      alert('Alterações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar as alterações:', error);
      alert('Erro ao salvar as alterações');
    }
  };
 
  return (
<div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'left',
    }}>
<h2 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '1rem',
        fontSize: '1.5rem',
      }}>
        Perfil do Usuário
</h2>
 
      {editMode ? (
<>
<div style={{ marginBottom: '1rem' }}>
<label>Nome:</label>
<input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.5rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
</div>
 
          <div style={{ marginBottom: '1rem' }}>
<label>Nova Senha:</label>
<input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.5rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
</div>
 
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '0.5rem',
            }}
>
            Salvar Alterações
</button>
<button
            onClick={() => setEditMode(false)}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#ccc',
              color: '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
>
            Cancelar
</button>
</>
      ) : (
<>
<UserInfoCard label="Nome" value={userData.name} />
<UserInfoCard label="Senha" value={userData.password} />
<button
            onClick={() => setEditMode(true)}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
>
            Editar Perfil
</button>
</>
      )}
</div>
  );
};
 
export default UserPage;