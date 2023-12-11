const express = require("express");
const router = express.Router();

const facilityAdminController = require("../controllers/facilityAdminController");
const ledgerController = require("../controllers/ledgerController")

router.get("/details", facilityAdminController.getFacilityDetails);
router.post('/teacher/attendance/:teacherId', facilityAdminController.markAttendance);
router.put('/ledger/update-status/:ledgerId', ledgerController.updateLedgerEntry);
router.get('/weekly-finances', facilityAdminController.calculateWeeklyFinances);
router.get('/classrooms/:facilityId', facilityAdminController.getClassrooms)
router.get('/teacher/attendance/:teacherId', facilityAdminController.getTeacherHours);



module.exports = router;
