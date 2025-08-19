import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
 
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
 
const ChartsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
 
  const [chartData, setChartData] = useState({
    labels: [],
    temperature: [],
    humidity: [],
    soilMoisture: [],
  });
 
  const calculateStartDate = () => {
    const now = new Date();
    switch (timeRange) {
      case '1h':
        return new Date(now.getTime() - 1 * 60 * 60 * 1000); // Última hora
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000); // Últimas 24 horas
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Últimos 7 dias
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Últimos 30 dias
      default:
        return now;
    }
  };
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };
 
  const fetchChartData = async () => {
    try {
      const startDate = calculateStartDate();
      const now = new Date();
 
      const [temperatureData, humidityData, soilMoistureData] = await Promise.all([
        axios.get(`http://localhost:5271/api/Temperatura`),
        axios.get(`http://localhost:5271/api/Umidade`),
        axios.get(`http://localhost:5271/api/UmidadeTerra`),
      ]);
 
      const filterDataByTimeRange = (data, key) =>
        data.filter((item) => {
          const itemDate = new Date(item[key]);
          return itemDate >= startDate && itemDate <= now;
        });
 
      const filteredTemperatureData = filterDataByTimeRange(temperatureData.data, 'ultimaMedicao');
      const filteredHumidityData = filterDataByTimeRange(humidityData.data, 'ultimaMedicao');
      const filteredSoilMoistureData = filterDataByTimeRange(soilMoistureData.data, 'ultimaMedicao');
 
      const labels = filteredTemperatureData.map((entry) => formatDate(entry.ultimaMedicao));
 
      setChartData({
        labels,
        temperature: filteredTemperatureData.map((entry) => entry.temperaturaAtual),
        humidity: filteredHumidityData.map((entry) => entry.umidadeAtual),
        soilMoisture: filteredSoilMoistureData.map((entry) => entry.umidadeTerraAtual),
      });
    } catch (error) {
      console.error("Erro ao buscar ou filtrar os dados:", error);
    }
  };
 
  useEffect(() => {
    fetchChartData(); // Buscar dados ao montar o componente
    const intervalId = setInterval(fetchChartData, 3600000); // Atualiza os dados a cada 1 hora
    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar
  }, [timeRange]);
 
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: chartData.temperature,
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Umidade do Ar (%)',
        data: chartData.humidity,
        borderColor: '#337AFF',
        backgroundColor: 'rgba(51, 122, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Umidade do Solo (%)',
        data: chartData.soilMoisture,
        borderColor: '#33FF57',
        backgroundColor: 'rgba(51, 255, 87, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { title: { display: true, text: 'Data' } },
      y: { title: { display: true, text: 'Valores' }, min: 0 },
    },
  };
 
  return (
    <div style={{ padding: '1rem', textAlign: 'center', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '1rem' }}>Gráficos de Dados</h2>
 
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Intervalo de Tempo: </label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '5px', marginLeft: '0.5rem' }}
        >
          <option value="1h">Última Hora</option>
          <option value="24h">Últimas 24 Horas</option>
          <option value="7d">Últimos 7 Dias</option>
          <option value="30d">Últimos 30 Dias</option>
        </select>
      </div>
 
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#fff',
          height: '300px',
          margin: '0 auto',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
 
export default ChartsPage;