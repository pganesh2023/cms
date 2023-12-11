const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");

router.delete('/:teacherId/delete', teacherController.deleteTeacher);
router.get("/details", teacherController.getTeacherDetails);
router.get("/:teacherId/children", teacherController.getChildrenInClassroom);
router.post('/child/attendance/bulk', teacherController.saveBulkAttendance);



module.exports = router;