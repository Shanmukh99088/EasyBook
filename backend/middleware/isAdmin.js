const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.isAdmin= async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
   console.log(decoded)
    req.user = await User.findById(decoded.userId);
    console.log(req.user)
    if(req.user.role=="Admin"){
        next();
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
