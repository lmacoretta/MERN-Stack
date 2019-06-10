import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETE, CLEAR_PROFILE, GET_PROFILES, GET_REPOS } from './types';


export const getProfile = () => {
  return async dispatch => {
    try {
      const res = await axios.get('/api/profile/me');

      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Create or Update profile */
export const createProfile = (formData, history, edit = false) => {
  return async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post('api/profile', formData, config);

      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });

      dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'));

      if (!edit) {
        history.push('/dashboard');
      }
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Add experience */
export const addExperience = (formData, history) => {
  return async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.put('api/profile/experience', formData, config);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(setAlert('Experience Added', 'success'));


      history.push('/dashboard');

    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Add Education */
export const addEducation = (formData, history) => {
  return async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.put('api/profile/education', formData, config);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(setAlert('Education Added', 'success'));


      history.push('/dashboard');

    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Delete experience */
export const deleteExperience = id => {
  return async dispatch => {
    try {
      const res = await axios.post(`/api/profile/experience/${id}`);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(setAlert('Experience Removed', 'success'));

    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Delete education */
export const deleteEducation = id => {
  return async dispatch => {
    try {
      const res = await axios.post(`/api/profile/education/${id}`);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(setAlert('Education Removed', 'success'));

    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Delete account & profile */
export const deleteAccount = () => {
  return async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone')) {
      try {
        await axios.delete('/api/profile');

        dispatch({ type: CLEAR_PROFILE });
        dispatch({ type: ACCOUNT_DELETE });

        dispatch(setAlert('Your account has been permanantly deleted'));

      } catch (err) {
        dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        })
      }
    }
  }
}

/** Get All profiles */
export const getAllProfile = () => {
  return async dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    try {
      const res = await axios.get('/api/profile');

      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Get profile user id */
export const getProfileById = userId => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/profile/user/${userId}`);

      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

/** Get github repos */
export const getGithubRepos = username => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/profile/github/${username}`);

      dispatch({
        type: GET_REPOS,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}