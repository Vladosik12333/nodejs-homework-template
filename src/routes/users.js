const express = require("express");

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
} = require("../controllers/users");

const router = express.Router();

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

module.exports = router;
