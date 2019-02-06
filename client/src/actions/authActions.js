import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  CLEAR_ERRORS,
  SET_CURRENT_USER_AVATAR,
  GET_NOTICE
} from "./types";

// Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res =>
      dispatch({
        type: GET_NOTICE,
        payload: "Success! Please check your email for account activation link."
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
export const activateUser = (userData, history) => dispatch => {
  axios.post("/api/users/activation", userData).catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};

// Reset password
export const resetPass = (userData, history) => dispatch => {
  // console.log(userData);
  dispatch(clearErrors());
  axios
    .post("/api/users/reset-password", userData)
    .then(res => {
      window.alert("Success! Please check your email for password reset link.");
      history.push("/");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Change password
export const changePass = (userData, history) => dispatch => {
  // console.log("here");
  axios
    .post("/api/users/change-password", userData)
    .then(res => {
      window.alert("Success! Your password has been changed.");
      history.push("/login");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login -get user token
export const loginUser = userData => dispatch => {
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
