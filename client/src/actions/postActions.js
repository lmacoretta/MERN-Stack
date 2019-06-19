import axios from 'axios';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from './types';

/** Obtengo los posts */
export const getPosts = () => {
  return async dispatch => {
    try {
      const res = await axios.get('api/posts/post');

      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Add Likes */
export const addLike = (id) => {
  return async dispatch => {
    try {
      const res = await axios.get(`api/posts/like/${id}`);

      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      })
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Remove Likes */
export const removeLike = (id) => {
  return async dispatch => {
    try {
      const res = await axios.get(`api/posts/unlike/${id}`);

      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      })
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}