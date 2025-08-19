import React from 'react';
import styles from './TimeFilter.module.css';

const TimeFilter = ({ timeRange, setTimeRange }) => {
  return (
    <div className={styles.filterContainer}>
      <label>Intervalo de Tempo: </label>
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        className={styles.select}
      >
        <option value="1h">Última Hora</option>
        <option value="24h">Últimas 24 Horas</option>
        <option value="7d">Últimos 7 Dias</option>
        <option value="30d">Últimos 30 Dias</option>
      </select>
    </div>
  );
};

export default TimeFilter;
