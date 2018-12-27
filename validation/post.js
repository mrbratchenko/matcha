const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (data.text.length < 10 || data.text.length > 300) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (data.text === "") {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
