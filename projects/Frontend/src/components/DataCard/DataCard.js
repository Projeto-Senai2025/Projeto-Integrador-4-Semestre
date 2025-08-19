import React from 'react';
import styles from './DataCard.module.css';
 
const DataCard = ({ title, value, unit, icon, warning }) => {
  return (
    <div className={`${styles.card} ${warning ? styles.warning : ''}`}>
      <div className={styles.iconContainer}>{icon}</div>
      <div className={styles.valueContainer}>
        <span className={`${styles.value} ${warning ? styles.warningValue : ''}`}>
          {value}
        </span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      <p className={styles.title}>{title}</p>
    </div>
  );
};
 
export default DataCard;