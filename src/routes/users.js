const express = require("express");
const controller = require("../controllers");
const users = require("../services/users");

const router = express.Router();

router.route("/").post((req, res) => controller(req, res, users.create));

router.route("/login").post((req, res) => controller(req, res, users.login));

router
  .route("/refresh")
  .post((req, res) => controller(req, res, users.refresh));

module.exports = router;
