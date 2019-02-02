module.exports = function validatePhotoFile(data) {
  let errors = {};

  if (
    path.extname(file.originalname) !== ".jpeg" &&
    path.extname(file.originalname) !== ".jpg" &&
    path.extname(file.originalname) !== ".png" &&
    path.extname(file.originalname) !== ".bmp"
  ) {
    errors.format = "Please use .jpg, .png or .bmp format";
    return res.status(404).json(errors);
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
