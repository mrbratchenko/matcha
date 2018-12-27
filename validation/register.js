const isEmpty = require("./is-empty");
const isEmail = require("./is-email");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Name
  if (data.name.length < 2 || data.name.length > 30) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (data.name === "") {
    errors.name = "Name field is required";
  }

  // Userame
  if (data.username.length < 4 || data.username.length > 20) {
    errors.username = "Username must be between 4 and 20 characters";
  }

  if (data.username === "") {
    errors.username = "Username field is required";
  }

  // Email
  if (data.email === "") {
    errors.email = "Email field is required";
  }

  // console.log(isEmail(data.email));

  if (!isEmail(data.email)) {
    errors.email = "Email is not valid";
  }

  // Password
  if (data.password === "") {
    errors.password = "Password field is required";
  }

  if (data.name.length < 6 || data.name.length > 30) {
    errors.password = "Password must be at least 6 characters";
  }

  // Password2
  if (data.password2 === "") {
    errors.password2 = "Confirm password field is required";
  }

  if (data.password !== data.password2) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
