const Children = require("../models/childrenmodel");
const Teachers = require("../models/teachermodel");

exports.create = async (req, res) => {
  try {
    const childData = req.body;
    // console.log("childData: ", childData);
    const classroom = await Children.getClassroomByType(
      childData.child_type,
      childData.facility_id
    );
    // console.log("classroom:", classroom);
    if (!classroom) {
      return res.status(400).send({ message: "Classroom type not found." });
    }

    const childrenCount = await Children.countChildrenInClassroom(
      classroom.classroom_id
    );

    // console.log("count: ",childrenCount);

    if (childrenCount >= classroom.capacity) {
      return res.status(400).send({ message: "Classroom is full." });
    }

    // Add classroom ID to childData
    childData.classroom_id = classroom.classroom_id;
    // console.log("childData after: ", childData);

    await Children.create(childData);
    res.status(201).send({ message: "Child created successfully" });
  } catch (error) {
    // console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const children = await Children.getAll(req.params.facility_id);
    res.status(200).send(children);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCount = async (req, res) => {
  try {
    // console.log("test");
    const result = await Children.getCount();
    // console.log("count server:", result[0].total.toString());
    res.status(200).send(result[0].total.toString());
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getClassroomStatus = async (req, res) => {
  try {
    // console.log("body:", req.body);
    const ChildDate = req.body;

    // Get the classroom information based on type and facility ID
    const classroom = await Children.getClassroomByType(
      ChildDate.child_type,
      ChildDate.facility_id
    );

    if (!classroom) {
      return res.status(404).send({
        message: "Classroom type not found for the provided facility.",
      });
    }

    // Check the number of children already in the classroom
    const childrenCount = await Children.countChildrenInClassroom(
      classroom.classroom_id
    );

    // Check if the classroom has reached its capacity
    if (childrenCount >= classroom.capacity) {
      return res.status(400).send({ message: "Classroom is full." });
    }

    // If there is space available in the classroom
    return res.status(200).send({ message: "Classroom has space available." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getClassroomsWithStudentCount = async (req, res) => {
  const { facility_id } = req.params;
  try {
    const classrooms = await Children.getAllClassrooms(facility_id);

    if (!classrooms.length) {
      return res
        .status(404)
        .send({ message: "No classrooms found for the provided facility." });
    }

    // Get student counts and teacher details for each classroom
    const classroomsWithCountsAndTeachers = await Promise.all(
      classrooms.map(async (classroom) => {
        const studentCount = await Children.countChildrenInClassroom(
          classroom.classroom_id
        );
        const teacherDetails = await Teachers.getTeachersInClassroom(
          classroom.classroom_id
        );

        const assignedTeachers = teacherDetails.length; // Number of assigned teachers
        // console.log(assignedTeachers);
        return {
          ...classroom,
          studentCount,
          teacherDetails: teacherDetails || [],
          assignedTeachers,
        };
      })
    );

    res.status(200).send(classroomsWithCountsAndTeachers);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getClassroomsWithTeacherInfo = async (req, res) => {
  try {
    const facilityId = req.params.facility_id;
    const classrooms = await Children.getAllWithTeacherInfo(facilityId);
    res.status(200).json(classrooms);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getChildName = async (req, res) => {
  try {
    const childId = req.params.childId;
    // console.log("childId controller: ", childId);
    const childName = await Children.getChildNameById(childId);
    // console.log("childName backend", childName);

    if (childName) {
      res.json(childName);
    } else {
      res.status(404).send({ message: "Child not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching child name" });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const childAttendanceData = req.body; // Expecting an array of { childId, present }
    await Children.markChildAttendance(childAttendanceData);
    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteChild = async (req, res) => {
  // console.log("eneterd into delete children controller")
  try {
    const { childId } = req.params;
    // console.log(facilityId);
    await Children.deleteChild(childId);
    res.json({ message: "Child deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
