const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SECRET_KEY, SENDGRID_KEY } = process.env;

sgMail.setApiKey(SENDGRID_KEY);

const sendEmailVerify = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: "vvllaadd1233345@gmail.com",
    subject: "Confirm registration",
    text: `For completly registration click to link: localhost:3000/api/users/verify/${verificationToken}`,
  };

  await sgMail.send(msg);
};

const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(409).json({ message: "Email in use" });
    return;
  }

  const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const avatar = gravatar.url(email, { s: "100", r: "x", d: "retro" }, true);

  const verificationToken = uuidv4();

  const { subscription } = await User.create({
    email,
    password: hashPass,
    avatarURL: avatar,
    verificationToken,
  });

  await sendEmailVerify(email, verificationToken);

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

  const user = await User.findOne({ email, verify: true });

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

  const pathAvatar = path.join(__dirname, "../../public/avatars", imageName);

  const image = sharp(tempPath);
  image.resize({ height: 250, width: 250 });
  await image.toFile(pathAvatar);
  await fs.unlink(tempPath, () => {});

  const avatarURL = path.join("public", "avatars", imageName);

  await User.findByIdAndUpdate({ _id }, { avatarURL });

  res.json({ avatarURL });
};

const verification = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken, verify: false });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  await User.findByIdAndUpdate(
    { _id: user._id },
    { verificationToken: null, verify: true }
  );

  res.json({ message: "Verification successful" });
};

const verificationAgain = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email, verify: false });

  if (!user) {
    res.status(400).json({ message: "Verification has already been passed" });
    return;
  }

  const verificationToken = uuidv4();

  await User.findByIdAndUpdate({ _id: user._id }, { verificationToken });

  await sendEmailVerify(user.email, verificationToken);

  res.json({ message: "Verification email sent" });
};

module.exports = {
  signup,
  login,
  logout,
  current,
  updateSub,
  updateAvatar,
  verification,
  verificationAgain,
};
