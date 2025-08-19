import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataCard from '../components/DataCard/DataCard';
import { FaThermometerHalf, FaTint, FaWater } from 'react-icons/fa';
 
const CardsPage = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    airHumidity: 0,
    soilMoisture: 0,
  });
  const [warnings, setWarnings] = useState({
    temperature: false,
    airHumidity: false,
    soilMoisture: false,
  });
 
  // Função para buscar dados dos sensores
  const fetchAllData = async () => {
    try {
      const temperatureResponse = await axios.get('http://localhost:5271/api/Temperatura');
      const lastTemperature = temperatureResponse.data?.at(-1);
      const airHumidityResponse = await axios.get('http://localhost:5271/api/Umidade');
      const lastAirHumidity = airHumidityResponse.data?.at(-1);
      const soilMoistureResponse = await axios.get('http://localhost:5271/api/UmidadeTerra');
      const lastSoilMoisture = soilMoistureResponse.data?.at(-1);
 
      const temperature = lastTemperature?.temperaturaAtual || 0;
      const airHumidity = lastAirHumidity?.umidadeAtual || 0;
      const soilMoisture = lastSoilMoisture?.umidadeTerraAtual || 0;
 
      setSensorData({ temperature, airHumidity, soilMoisture });
 
      const newWarnings = {
        temperature: temperature > 25.0, // Temperatura acima de 25°C
        airHumidity: airHumidity > 50.0, // Umidade do ar acima de 50%
        soilMoisture: soilMoisture > 40.0, // Umidade do solo acima de 40%
      };
 
      setWarnings(newWarnings);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    }
  };
 
  useEffect(() => {
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 3600000); // Atualiza os dados a cada 1 hora
    return () => clearInterval(intervalId); // Limpa o intervalo quando o componente for desmontado
  }, []);
 
  return (
    <div
      style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <DataCard
        title="Temperatura"
        value={sensorData.temperature}
        unit="°C"
        icon={<FaThermometerHalf />}
        warning={warnings.temperature}
      />
      <DataCard
        title="Umidade do Ar"
        value={sensorData.airHumidity}
        unit="%"
        icon={<FaTint />}
        warning={warnings.airHumidity}
      />
      <DataCard
        title="Umidade do Solo"
        value={sensorData.soilMoisture}
        unit="%"
        icon={<FaWater />}
        warning={warnings.soilMoisture}
      />
    </div>
  );
};
 
export default CardsPage;