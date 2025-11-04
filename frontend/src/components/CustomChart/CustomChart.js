import React from 'react';
import { Line } from 'react-chartjs-2';
import styles from './CustomChart.module.css';

const CustomChart = ({ data, options }) => {
  return (
    <div className={styles.chartContainer}>
      <Line data={data} options={options} />
    </div>
  );
};

export default CustomChart;
