const express = require("express");
const controller = require("../controllers");
const transactions = require("../services/transactions");

const router = express.Router();

router.route("/").post((req, res) => controller(req, res, transactions.create));

module.exports = router;
