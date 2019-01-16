var ifAnyDigitsPattern = /[0-9]+/;
ifAnyDigits = str => {
  return ifAnyDigitsPattern.test(str);
};

var ifAnyLettersPattern = /[a-zA-Z]+/;
ifAnyLetters = str => {
  return ifAnyLettersPattern.test(str);
};

module.exports = {
  ifAnyDigits,
  ifAnyLetters
};
