import axios from 'axios';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST } from './types';

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

/** Delete Post */
export const deletePost = id => {
  return async dispatch => {
    try {
      await axios.delete(`api/posts/${id}`);

      dispatch({
        type: DELETE_POST,
        payload: id
      });

      dispatch(setAlert('Post Removed', 'success'));
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Add Post */
export const addPost = data => {
  return async dispatch => {
    try {
      const config = {
        'Content-Type': 'application/json'
      }

      const res = await axios.post(`api/posts`, data, config);

      dispatch({
        type: ADD_POST,
        payload: res.data
      });

      dispatch(setAlert('Post Created', 'success'));
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}