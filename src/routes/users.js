const express = require("express");
const path = require("path");
const multer = require("multer");

const { validationBody } = require("../middlewares/validation");
const { schemaPassAndLogin, schemaUpdateSub } = require("../models/users");
const { container } = require("../middlewares/container-ctrl");
const { auth } = require("../middlewares/auth");
const {
  signup,
  login,
  logout,
  current,
  updateSub,
  updateAvatar,
} = require("../controllers/users");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./tmp"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/signup", validationBody(schemaPassAndLogin), container(signup));
router.post("/login", validationBody(schemaPassAndLogin), container(login));
router.get("/logout", auth, container(logout));
router.get("/current", auth, container(current));
router.patch(
  "/sub",
  auth,
  validationBody(schemaUpdateSub),
  container(updateSub)
);
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  container(updateAvatar)
);

module.exports = router;
