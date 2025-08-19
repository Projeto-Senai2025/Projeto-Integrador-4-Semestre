import React from 'react';
import styles from './UserInfoCard.module.css';

const UserInfoCard = ({ label, value }) => {
  return (
    <div className={styles.infoCard}>
      <label>{label}:</label>
      <p>{value}</p>
    </div>
  );
};

export default UserInfoCard;
