import axios from "axios";

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
  CLEAR_ERRORS,
  SET_NOTICE
} from "./types";

// Get username
export const getUsername = "passed username";

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  dispatch(clearErrors());
  axios
    .get("./api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Get profile by username
export const getProfileByUsername = username => dispatch => {
  // console.log(username);
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/username/${username}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};

// Create profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => history.push("./dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// upload photo
export const uploadPhoto = (formData, config) => dispatch => {
  dispatch(clearErrors());
  dispatch(getNotice());
  axios
    .post("/api/profile/photos", formData, config)

    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// delete photo
export const deletePhoto = fileName => dispatch => {
  if (window.confirm("Are you sure? This action cannot be undone")) {
    axios
      .delete(`/api/profile/photos/${fileName}`)
      .then(res =>
        dispatch(
          {
            type: GET_PROFILE,
            payload: res.data
          },
          {
            type: SET_NOTICE,
            payload: "photo has been deleted"
          }
        )
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// Delete account and profile
export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This action cannot be undone")) {
    axios
      .delete("api/profile")
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

// Get all profiles
export const getProfiles = filterData => dispatch => {
  dispatch(setProfileLoading());
  console.warn(filterData);

  let filter =
    typeof filterData !== "undefined" ? JSON.stringify(filterData) : null;

  axios
    .get(`/api/profile/all/?filter=${filter}`)
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

// Notice
export const getNotice = () => {
  return {
    type: SET_NOTICE,
    payload: "added"
  };
};
