const isEmpty = require("./is-empty");
const isURL = require("./is-url");

module.exports = function validateProfileInput(data) {
  let errors = {};

  // data.username = !isEmpty(data.username) ? data.username : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  // if (data.username.length < 2 || data.username.length > 40) {
  //   errors.username = "Username needs to be between and 4 characters";
  // }

  // if (data.username === "") {
  //   errors.username = "Profile username is required";
  // }

  if (data.status === "") {
    errors.status = "Status field is required";
  }

  if (data.skills === "") {
    errors.skills = "Skills field is required";
  }

  if (!isEmpty(data.website)) {
    if (!isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!isURL(data.youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!isURL(data.twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!isURL(data.facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!isURL(data.instagram)) {
      errors.instagram = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
