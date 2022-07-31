const jwt = require("jsonwebtoken");
const dbconnection = require("../dbLayer/db.js");
//to generate auth token
const generateAuthToken = async (id) => {
  try {
    var data = {};
    data["token"] = jwt.sign({ userId: id }, process.env.SECRETEKEY, {
      algorithm: "HS256",
      expiresIn: "365d",
    });
    return await data;
  } catch (error) {
    throw new Error(error);
  }
};

//verify token
const verifyMe = async (req, res, next) => {
  try {
    let token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "No token provided" });
    }
    jwt.verify(
      token,
      process.env.SECRETEKEY,
      { algorithm: "HS256", expiresIn: "365d" },
      (err, user) => {
        if (err)
          res.status(401).json({ status: false, message: "Unauthorized" });
        req.userId = user.userId;
        next();
      }
    );
  } catch (e) {
    res.status(501).send("verifyMe catch block", e);
  }
};

//verify user name
const checkUserName = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const mySqlQuery = "select user_name from users where user_name=?";
    await dbconnection.query(mySqlQuery, [userName], function (err, rows) {
      if (err || rows.length == 0) next();
      else
        res.status(400).json({ status: false, message: "Duplicate user name" });
    });
  } catch (e) {
    res.status(501).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = { checkUserName, generateAuthToken, verifyMe };
