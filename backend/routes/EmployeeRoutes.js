// routes/employeeroutes.js
const express = require("express");
const router = express.Router();
const { EmployeeDetailsController } = require("../controllers/EmployeeDetailsController");

router.post("/employee-details", EmployeeDetailsController);

module.exports = router;
