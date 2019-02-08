import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  CLEAR_ERRORS,
  SET_CURRENT_USER_AVATAR,
  SET_NOTICE,
  CLEAR_NOTICE,
  NOTICE_LOADING
} from "./types";

// Register user
export const registerUser = userData => dispatch => {
  dispatch(clearNotice());
  dispatch(clearErrors());
  dispatch(setNoticeLoading());
  axios
    .post("/api/users/register", userData)
    .then(res =>
      dispatch({
        type: SET_NOTICE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Activate user
export const activateUser = userData => dispatch => {
  axios
    .post("/api/users/activation", userData)
    .then(res =>
      dispatch({
        type: SET_NOTICE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Reset password
export const resetPass = (userData, history) => dispatch => {
  // console.log(userData);
  dispatch(clearNotice());
  dispatch(clearErrors());
  dispatch(setNoticeLoading());
  axios
    .post("/api/users/reset-password", userData)
    .then(res =>
      dispatch({
        type: SET_NOTICE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Change password
export const changePass = userData => dispatch => {
  dispatch(clearErrors());
  dispatch(clearNotice());
  axios
    .post("/api/users/change-password", userData)
    .then(res =>
      dispatch({
        type: SET_NOTICE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login -get user token
export const loginUser = userData => dispatch => {
  dispatch(clearNotice());
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localstorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to auth header
      setAuthToken(token);
      //  Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user

      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token
  localStorage.removeItem("jwtToken");
  // Remove auth header for future request
  setAuthToken(false);
  // Set cur user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const clearNotice = () => {
  return {
    type: CLEAR_NOTICE
  };
};

// set avatar pic
export const setAvatar = (fileName, user) => dispatch => {
  axios
    .post(`/api/users/avatar/${fileName}`, user)
    .then(res =>
      dispatch({
        type: SET_CURRENT_USER_AVATAR,
        payload: res.data.avatar
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setNoticeLoading = () => {
  return {
    type: NOTICE_LOADING
  };
};
