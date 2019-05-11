const isEmpty = require("./is-empty");
const isEmail = require("./is-email");
const isComplex = require("./is-complex");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (data.name.length < 2 || data.name.length > 30) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (data.name === "") {
    errors.name = "Name field is required";
  }

  if (data.username.length < 4 || data.username.length > 20) {
    errors.username = "Username must be between 4 and 20 characters";
  }

  if (data.username === "") {
    errors.username = "Username field is required";
  }

  if (data.email === "") {
    errors.email = "Email field is required";
  }

  if (!isEmail(data.email)) {
    errors.email = "Email is not valid";
  }

  if (data.password === "") {
    errors.password = "Password field is required";
  }

  if (!isComplex.ifAnyDigits(data.password)) {
    errors.password = "Password must contain at least one digit";
  }

  if (!isComplex.ifAnyLetters(data.password)) {
    errors.password = "Password must contain at least one letter";
  }

  if (data.password.length < 6 || data.password.length > 30) {
    errors.password = "Password must be at least 6 characters";
  }

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
