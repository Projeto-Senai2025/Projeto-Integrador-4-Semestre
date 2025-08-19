import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaDatabase, FaChartLine, FaFileAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/logo.webp';
import styles from './NavigationMenu.module.css';
 
const NavigationMenu = ({ onLogout }) => {
  const navigate = useNavigate();
 
  const handleLogoutClick = () => {
    onLogout(); // Executa a função de logout recebida como prop
    navigate('/'); // Redireciona para a página de login (ou outra rota desejada)
  };
 
  return (
<nav className={styles.menu}>
<div className={styles.logoContainer}>
<img src={logo} alt="Logo" className={styles.logo} />
</div>
<ul className={styles.menuList}>
<li><Link to="/"><FaHome className={styles.icon} /></Link></li>
<li><Link to="/cards"><FaDatabase className={styles.icon} /></Link></li>
<li><Link to="/charts"><FaChartLine className={styles.icon} /></Link></li>
<li><Link to="/reports"><FaFileAlt className={styles.icon} /></Link></li>
<li><Link to="/user"><FaUser className={styles.icon} /></Link></li>
<li>
<button onClick={handleLogoutClick} className={styles.logoutButton}>
            <div className={styles.iconCenter}>
              <FaSignOutAlt className={styles.icon} />
            </div>
          </button>
</li>
</ul>
</nav>
  );
};
 
export default NavigationMenu;