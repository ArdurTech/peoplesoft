// AuthRoutes.js
const express = require("express");
const router = express.Router();

const { SignUpController, LoginController } = require("../controllers/AuthControllers");
 // Import TimesheetController correctly

router.post("/signup", SignUpController);

router.post("/login", LoginController);

router.post("/employee-details");



module.exports = router;
