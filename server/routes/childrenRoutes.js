const express = require("express");
const childrenController = require("../controllers/childrenController");
const parentsController = require("../controllers/parentsController");
const teacherController = require("../controllers/teacherController");
const ledgerController = require('../controllers/ledgerController');
const router = express.Router();

router.delete('/:childId/delete', childrenController.deleteChild)

router.get('/ledger/:child_id', ledgerController.getLedgerByChild);
router.put('/ledger/:ledger_id', ledgerController.updateLedgerEntry);

router.put("/teachers/assign", teacherController.assignTeacherToClassroom);

router.post("/classroom/capacity", childrenController.getClassroomStatus);

router.get(
  "/classrooms/teacher-info/:classroomId",
  teacherController.getClassroomTeacherInfo
);

router.get(
  "/classrooms/:facility_id",
  childrenController.getClassroomsWithStudentCount
);

// Route for creating a new child
router.post("/children", childrenController.create);

router.get("/children/count", childrenController.getCount);

router.get("/children/name/:childId", childrenController.getChildName);

// Route for getting all children
router.get("/children/:facility_id", childrenController.getAll);

// Route for creating a new parent
router.post("/parents", parentsController.create);

// Route for getting a parent by ID
router.get("/parents/:parent_id", parentsController.getById);

router.get("/teachers/count", teacherController.getCount);

router.get("/teachers/:facility_id", teacherController.getAllTeachers);

router.post("/teachers", teacherController.create);

router.post('/children/attendance', childrenController.markAttendance);


module.exports = router;
