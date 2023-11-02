import React from 'react';
import UserHeaderNav from './UserHeaderNav';
import styles from './UserHeader.module.css';
import { useLocation } from 'react-router-dom';

const UserHeader = () => {
  const [title, setTitle] = React.useState('');
  const location = useLocation();

  React.useEffect(() => {
    let titulo = '';

    switch (location.pathname) {
      case '/conta/estatisticas':
        titulo = 'Estatísticas';
        break;
      case '/conta/postar':
        titulo = 'Poste sua foto';
        break;
      default:
        titulo = 'Minha Conta';
        break;
    }

    setTitle(titulo);
  }, [location]);

  return (
    <header className={styles.header}>
      <h1 className="title">{title}</h1>
      <UserHeaderNav />
    </header>
  );
};

export default UserHeader;
