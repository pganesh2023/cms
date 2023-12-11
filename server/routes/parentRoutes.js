const express = require("express");
const router = express.Router();

const parentController = require("../controllers/parentsController");

router.get("/details", parentController.getParentDetails);
router.get('/child-attendance/:parentId', parentController.getChildAttendance);
router.get('/monthly-child-attendance/:parentId', parentController.getMonthlyChildAttendance);




module.exports = router;