const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = validateRegisterInput = data => {
  let errors = {};
  if ((!Validator.isLength(data.name), { min: 3, max: 30 })) {
    errors.name = "Name must be beween 3 and 30 character";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
