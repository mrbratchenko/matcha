const isEmpty = require("./is-empty");
const isComplex = require("./is-complex");

module.exports = function validatePassInput(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

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
    errors, // errors: errors
    isValid: isEmpty(errors) // true or false basing on what isEmpty returns
  };
};
