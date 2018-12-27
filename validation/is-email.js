var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
module.exports = isEmail = str => {
  return emailPattern.test(str);
};
