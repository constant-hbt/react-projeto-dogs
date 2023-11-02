import React from 'react';

const useFetch = () => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const request = React.useCallback(async (url, options, time) => {
    time = time || 10000;
    let controller = new AbortController();
    let timeoutId = setTimeout(() => controller.abort(), time);

    let response;
    let json;

    try {
      setError(null);
      setLoading(true);

      response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      json = await response.json();
      if (!response.ok)
        throw new Error(json?.message ?? 'Erro ao realizar cadastro');
    } catch (err) {
      json = null;
      setError(err.message);
    } finally {
      clearTimeout(timeoutId);
      setData(json);
      setLoading(false);
      return { response, json };
    }
  }, []);

  return {
    data,
    loading,
    error,
    request,
  };
};

export default useFetch;
