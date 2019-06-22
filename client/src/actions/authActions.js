import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_FAIL,
  REGISTER_SUCESS,
  LOAD_USER,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOG_OUT,
  CLEAR_PROFILE
} from './types';
import setAuthToken from '../utils/setAuthToken';

/** Load user */
export const loadUser = () => {
  return async dispatch => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: LOAD_USER,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  };
};

/** Register user */
export const signUp = ({ name, email, password }) => {
  return async dispatch => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post('/api/users', body, config);

      dispatch({
        type: REGISTER_SUCESS,
        payload: res.data
      });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: REGISTER_FAIL
      });
    }
  };
};

/** Login user */
export const signIn = ({ email, password }) => {
  return async dispatch => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = { email, password };

    try {
      const res = await axios.post('/api/auth', body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: LOGIN_FAIL
      });
    }
  };
};

/** Logout */
export const Logout = () => {
  return dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOG_OUT });
  };
};
