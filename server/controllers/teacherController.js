const Teachers = require("../models/teachermodel");
const jwt = require("jsonwebtoken");
const Children = require("../models/childrenmodel");

exports.create = async (req, res) => {
  try {
    console.log("body:", req.body);
    await Teachers.create(req.body);
    res.status(201).send({ message: "Teacher created successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teachers.getAll(req.params.facility_id);
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.assignTeacherToClassroom = async (req, res) => {
  try {
    const { teacher_id, classroom_id } = req.body;
    // console.log("teacher_id: ", teacher_id);
    // console.log("classroom_id: ", classroom_id);

    const classroomInfo = await Teachers.getRequiredTeacherCount(classroom_id);
    // console.log("classroom info: ", classroomInfo);
    const currentTeacherCount = await Teachers.countTeachersInClassroom(
      classroom_id
    );
    // console.log("teacher's count: ", currentTeacherCount);

    if (!classroomInfo) {
      return res.status(404).send({ message: "Classroom not found." });
    }

    // Check if the assignment would exceed the ratio
    if (currentTeacherCount + 1 > classroomInfo.requiredTeachers) {
      return res.status(400).send({
        message:
          "Cannot assign teacher. It would exceed the maximum teacher-to-child ratio.",
        requiredTeachers: classroomInfo.requiredTeachers,
        currentTeacherCount: currentTeacherCount,
        childCount: classroomInfo.childCount,
      });
    }

    // Proceed with the assignment
    await Teachers.assignTeacherToClassroom(teacher_id, classroom_id);
    res.status(201).send({ message: "Teacher assigned successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCount = async (req, res) => {
  try {
    // console.log("test");
    const result = await Teachers.getCount();
    // console.log("count server:", result[0].total.toString());
    res.status(200).send(result[0].total.toString());
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getClassroomTeacherInfo = async (req, res) => {
  // console.log("test");
  try {
    const classroomId = req.params.classroomId;
    // console.log("classroomId:", classroomId)
    const classroomInfo = await Teachers.getRequiredTeacherCount(classroomId);
    // console.log("classroomInfo:", classroomInfo);
    const currentTeacherCount = await Teachers.countTeachersInClassroom(
      classroomId
    );
    // console.log("current count:", currentTeacherCount);

    if (!classroomInfo) {
      return res.status(404).send({ message: "Classroom not found." });
    }

    res.status(200).json({
      requiredTeachers: classroomInfo.requiredTeachers,
      currentTeachers: currentTeacherCount,
      childCount: Number(classroomInfo.childCount),
      classroomType: classroomInfo.classroomType,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getTeacherDetails = async (req, res) => {
  // console.log("test000");
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const parts = req.headers.authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message:
          "Invalid Authorization header format. Expected 'Bearer [token]'.",
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, "YOUR_SECRET_KEY");

    const email = decoded.email;

    // console.log("email: ", email);

    const teacherDetails = await Teachers.getTeacherDetailsByEmail(email);
    if (!teacherDetails) {
      return res
        .status(404)
        .json({ message: "Facility details not found for this admin." });
    }

    if (teacherDetails.classroom_id) {
      const childrenCount = await Children.countChildrenInClassroom(
        teacherDetails.classroom_id
      );
      teacherDetails.childrenCount = childrenCount;
    }

    res.status(200).json(teacherDetails);
  } catch (error) {
    console.error("Error fetching facility details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getChildrenInClassroom = async (req, res) => {
  const teacherId = req.params.teacherId;
  // console.log("teacherId from backend params: ", teacherId);

  try {
    // First, get the classroom ID assigned to the teacher
    const teacherInfo = await Teachers.getTeacherDetailsById(teacherId);
    if (!teacherInfo || !teacherInfo.classroom_id) {
      return res
        .status(404)
        .json({ message: "Classroom not found for this teacher." });
    }

    // Fetch the children in the classroom
    const children = await Children.getChildrenInClassroom(
      teacherInfo.classroom_id
    );
    // console.log("children from backend: ", children);
    res.status(200).json(children);
  } catch (error) {
    console.error("Error in getChildrenInClassroom:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveBulkAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body;
    await Teachers.bulkInsertAttendance(attendanceData);
    res.status(200).json({ message: "Attendance saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving attendance" });
  }
};

exports.deleteTeacher = async (req, res) => {
  console.log("eneterd into delete teacher controller")
  try {
    const { teacherId } = req.params;
    // console.log(facilityId);
    await Teachers.deleteTeacher(teacherId);
    res.json({ message: "Child deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

