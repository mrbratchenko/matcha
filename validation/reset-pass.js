const isEmpty = require("./is-empty");
const isEmail = require("./is-email");

module.exports = function validateEmailInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";

  if (!isEmail(data.email)) {
    errors.email = "Email is not valid";
  }

  if (data.email === "") {
    errors.email = "Email field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
