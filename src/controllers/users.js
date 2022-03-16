const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
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

  const avatar = gravatar.url(email, { s: "100", r: "x", d: "retro" }, true);

  const { subscription } = await User.create({
    email,
    password: hashPass,
    avatarURL: avatar,
  });

  res.status(201);
  res.json({
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

const updateAvatar = async (req, res) => {
  const { path: tempPath, filename } = req.file;
  const { _id, email } = req.user;

  const imageName = `${email}_${filename}`;

  const pathAvatar = path.join(__dirname, "../public/avatars", imageName);

  const image = sharp(tempPath);
  image.resize({ height: 250, width: 250 });
  await image.toFile(pathAvatar);
  await fs.unlink(tempPath, () => {});

  const avatarURL = path.join("public", "avatars", imageName);

  await User.findByIdAndUpdate({ _id }, { avatarURL });

  res.json({ avatarURL });
};

module.exports = { signup, login, logout, current, updateSub, updateAvatar };
