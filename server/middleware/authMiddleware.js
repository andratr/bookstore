const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    //token is in the request headers using the Bearer scheme
    //eg. Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ik
    //pXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lI
    //iwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk
    //6yJV_adQssw5c
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.jwt_secret);
    if (decoded.userId) {
      //attach decoded userID from token to the request body
      req.body.userIdFromToken = decoded.userId;
      next();
    } else {
      return res.send({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
