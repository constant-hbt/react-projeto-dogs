import React from 'react';

const PhotoGet = () => {
  const [photo, setPhoto] = React.useState(null);
  const [search, setSearch] = React.useState('');

  function handleSubmit(event) {
    event.preventDefault();
    fetch(`https://dogsapi.origamid.dev/json/api/photo/${search}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((json) => {
        console.log(json);
        setPhoto(json);
      })
      .catch((erro) => console.log(erro));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      <button>Enviar</button>
    </form>
  );
};

export default PhotoGet;
