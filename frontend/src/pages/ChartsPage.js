import React, { useState, useEffect } from 'react';
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
  // Estado do intervalo de tempo do filtro
  const [timeRange, setTimeRange] = useState('7d');

  // Dados fictícios para o gráfico
  const [chartData, setChartData] = useState({
    temperature: [],
    humidity: [],
    soilMoisture: [],
    labels: [],
  });

  /**
   * Função `fetchChartData` simula a obtenção de dados de gráfico.
   * FUTURAMENTE: Substituir por uma chamada à API para buscar dados reais.
   * 
   * Exemplo de integração com API:
   * - Substitua `URL_DA_API` pela URL correta.
   * - Ajuste `type` e `range` para que a API retorne dados filtrados.
   * 
   * useEffect(() => {
   *   const fetchChartData = async () => {
   *     const response = await fetch(`URL_DA_API/data?type=all&range=${timeRange}`);
   *     const data = await response.json();
   *     setChartData(data); // Atualiza o estado com dados reais
   *   };
   * 
   *   fetchChartData();
   * }, [timeRange]);
   */
  useEffect(() => {
    const fetchChartData = () => {
      const mockData = {
        labels: timeRange === '7d' ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] : ['1h', '2h', '3h', '4h', '5h'],
        temperature: [22, 24, 21, 23, 25, 26, 24],
        humidity: [75, 70, 72, 73, 78, 76, 74],
        soilMoisture: [47, 50, 52, 48, 45, 46, 47],
      };
      setChartData(mockData);
    };

    fetchChartData();
  }, [timeRange]);

  // Configuração do gráfico com dados fictícios
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
      x: { title: { display: true, text: 'Tempo' } },
      y: { title: { display: true, text: 'Valores' }, min: 0 },
    },
  };

  return (
    <div style={{ padding: '1rem', textAlign: 'center', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '1rem' }}>Gráficos de Dados</h2>

      {/* Filtro de Intervalo de Tempo */}
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

      {/* Contêiner do Gráfico */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#fff', 
        height: '300px',
        margin: '0 auto',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartsPage;
