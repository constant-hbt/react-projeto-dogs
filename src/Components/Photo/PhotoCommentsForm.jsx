import React from 'react';
import styles from './PhotoCommentsForm.module.css';
import { ReactComponent as Enviar } from '../../assets/enviar.svg';
import useFetch from '../../Hooks/useFetch';
import { COMMENT_POST } from '../../api';
import Error from '../Helper/Error';

const PhotoCommentsForm = ({ id, setComments, single }) => {
  const [comment, setComment] = React.useState('');
  const { request, error } = useFetch();

  async function handleSubmit(event) {
    event.preventDefault();

    const token = window.localStorage.getItem('token');
    const { url, options } = COMMENT_POST(id, token, { comment });
    const { response, json } = await request(url, options);
    if (response.ok) {
      setComment('');
      setComments((comments) => [...comments, json]);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${single ? styles.single : ''}`}
    >
      <textarea
        value={comment}
        onChange={({ target }) => setComment(target.value)}
        name="comment"
        id="comment"
        placeholder="Comente..."
        cols="30"
        rows="10"
        className={styles.textarea}
      ></textarea>
      <button className={styles.button}>
        <Enviar />
      </button>
      <Error error={error} />
    </form>
  );
};

export default PhotoCommentsForm;
