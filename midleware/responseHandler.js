// middleware/responseHandler.js
const responseHandler = (req, res, next) => {
  res.success = (data = {}, message = "Success", code = 200) => {
    return res.status(code).json({
      code,
      status: true,
      message,
      data
    });
  };

  res.error = (message = "Something went wrong", code = 500, error = {}) => {
    return res.status(code).json({
      code,
      status: false,
      message,
      error
    });
  };

  next();
};

module.exports = responseHandler;
