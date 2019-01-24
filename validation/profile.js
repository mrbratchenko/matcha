const isEmpty = require("./is-empty");
const isURL = require("./is-url");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (data.name.length < 2 || data.name.length > 30) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (data.name === "") {
    errors.name = "Name field is required";
  }

  if (data.email === "") {
    errors.email = "Email field is required";
  }

  if (!isEmail(data.email)) {
    errors.email = "Email is not valid";
  }

  if (data.username.length < 3 || data.username.length > 10) {
    errors.username = "Username needs to be between 3 and 10 characters";
  }

  if (data.username === "") {
    errors.username = "Profile username is required";
  }

  if (data.gender === "") {
    errors.gender = "Gender field is required";
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
