const isEmpty = require("./is-empty");
const isURL = require("./is-url");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (data.handle.length < 2 || data.handle.length > 40) {
    errors.handle = "Handle needs to be between and 4 characters";
  }

  if (data.handle === "") {
    errors.handle = "Profile handle is required";
  }

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
