import React from 'react';
import styles from './DataCard.module.css';
import { FaTrash } from 'react-icons/fa'; // Ícone de lixeira

const DataCard = ({ title, value, unit, icon, warning, onDelete }) => {
  return (
    <div className={`${styles.card} ${warning ? styles.warning : ''}`}>
      {/* Botão de deletar — aparece apenas se a prop onDelete existir */}
      {onDelete && (
        <button
          className={styles.deleteButton}
          onClick={onDelete}
          title="Apagar sensor"
        >
          <FaTrash size={14} />
        </button>
      )}

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
