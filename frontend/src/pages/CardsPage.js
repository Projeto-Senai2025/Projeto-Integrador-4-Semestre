import React, { useState, useEffect } from 'react';
import DataCard from '../components/DataCard/DataCard';
import { FaThermometerHalf, FaTint, FaWater } from 'react-icons/fa';

const CardsPage = () => {
  // Estado para dados fictícios dos sensores
  const [sensorData, setSensorData] = useState({
    temperature: 25,
    airHumidity: 60,
    soilMoisture: 45,
  });

  /**
   * Função `fetchSensorData` simula a obtenção dos dados dos sensores.
   * FUTURAMENTE: Substituir por uma chamada real para a API.
   * 
   * Exemplo de integração com API:
   * - Substitua `URL_DA_API` pela URL correta da API.
   * - Chame os dados para temperatura, umidade do ar e umidade do solo.
   * 
   * useEffect(() => {
   *   const fetchSensorData = async () => {
   *     const response = await fetch('URL_DA_API/sensors');
   *     const data = await response.json();
   *     setSensorData(data); // Atualiza o estado com os dados reais
   *   };
   * 
   *   fetchSensorData();
   * }, []);
   */
  useEffect(() => {
    const fetchSensorData = () => {
      const mockData = {
        temperature: Math.floor(Math.random() * 10) + 20, // Temperatura entre 20 e 30
        airHumidity: Math.floor(Math.random() * 50) + 50, // Umidade do ar entre 50% e 100%
        soilMoisture: Math.floor(Math.random() * 40) + 30, // Umidade do solo entre 30% e 70%
      };
      setSensorData(mockData);
    };

    fetchSensorData();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', padding: '20px' }}>
      <DataCard title="Temperatura" value={sensorData.temperature} unit="°C" icon={<FaThermometerHalf />} />
      <DataCard title="Umidade do Ar" value={sensorData.airHumidity} unit="%" icon={<FaTint />} />
      <DataCard title="Umidade de Solo" value={sensorData.soilMoisture} unit="%" icon={<FaWater />} />
    </div>
  );
};

export default CardsPage;
