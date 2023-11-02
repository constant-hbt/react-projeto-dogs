import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_POST, TOKEN_VALIDATE_POST, USER_GET } from './api';

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
  const navigate = useNavigate();

  const [data, setData] = React.useState(null);
  const [login, setLogin] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [error, setError] = React.useState(null);

  async function fetchWithTimeout(url, options, time) {
    time = time || 5000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), time);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  }

  async function getUser(token) {
    const { url, options } = USER_GET(token);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      setData(json);
      setLogin(true);
    } catch (error) {
      setLogin(false);
    }
  }

  async function userLogin(username, password) {
    try {
      setError(null);
      setLoading(true);
      const { url, options } = TOKEN_POST({ username, password });
      const response = await fetchWithTimeout(url, options);
      if (!response.ok) {
        throw new Error(`Error: Usuário inválido`);
      }

      const { token } = await response.json();
      window.localStorage.setItem('token', token);
      await getUser(token);
      navigate('/conta');
    } catch (erro) {
      setError(erro.message);
      setLogin(false);
    } finally {
      setLoading(false);
    }
  }

  const userLogout = React.useCallback(
    async function () {
      setData(null);
      setError(null);
      setLoading(false);
      setLogin(false);
      window.localStorage.removeItem('token');
      navigate('/login');
    },
    [navigate],
  );

  React.useEffect(() => {
    async function autoLogin() {
      const token = window.localStorage.getItem('token');
      if (token) {
        const { url, options } = TOKEN_VALIDATE_POST(token);
        try {
          setError(null);
          setLoading(true);
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error('Token inválido');
          }
          await getUser(token);
        } catch (erro) {
          userLogout();
        } finally {
          setLoading(false);
        }
      }
    }

    autoLogin();
  }, [userLogout]);

  return (
    <UserContext.Provider
      value={{ userLogin, userLogout, data, error, loading, login }}
    >
      {children}
    </UserContext.Provider>
  );
};
