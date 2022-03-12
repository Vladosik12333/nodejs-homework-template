const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models/users");

const { SECRET_KEY } = process.env;

const auth = async (req, _, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") throw Error("Not authorized");

    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById({ _id: id });

    if (!user || user.token !== token) throw Error("Not authorized");

    req.user = user;
    next();
  } catch (error) {
    if (error.message === "invalid token") {
      error.message = "Not authorized";
      error.status = 401;
      next(error);
    }
    error.status = 401;
    next(error);
  }
};

module.exports = { auth };
