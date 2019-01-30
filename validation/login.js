const isEmpty = require("./is-empty");
const isEmail = require("./is-email");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Email
  if (!isEmail(data.email)) {
    errors.email = "Email is not valid";
  }

  if (data.email === "") {
    errors.email = "Email field is required";
  }

  // Password
  if (data.password === "") {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
