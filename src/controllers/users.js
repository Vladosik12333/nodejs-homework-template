const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(409).json({ message: "Email in use" });
    return;
  }

  const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const { subscription } = await User.create({ email, password: hashPass });
  res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ message: "Email or password is wrong" });
    return;
  }

  const { email: userEmail, subscription, _id } = user;

  const payload = {
    id: _id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });

  await User.findOneAndUpdate({ _id }, { token });

  res.json({
    token,
    user: { email: userEmail, subscription },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate({ _id }, { token: null });

  res.status(204).json();
};

const current = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const updateSub = async (req, res) => {
  const { _id } = req.user;
  const { sub } = req.body;

  const user = await User.findByIdAndUpdate(
    { _id },
    { subscription: sub },
    {
      new: true,
    }
  );

  const { email, subscription } = user;

  res.json({
    user: {
      email,
      subscription,
    },
  });
};

module.exports = { signup, login, logout, current, updateSub };
