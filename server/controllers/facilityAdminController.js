const jwt = require("jsonwebtoken");
const FacilityAdmin = require("../models/facilityAdminmodel");
const facilityAdminmodel = require("../models/facilityAdminmodel");

exports.getFacilityDetails = async (req, res) => {
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

    const facilityDetails = await FacilityAdmin.getFacilityDetailsByEmail(
      email
    );
    if (!facilityDetails) {
      return res
        .status(404)
        .json({ message: "Facility details not found for this admin." });
    }

    res.status(200).json(facilityDetails);
  } catch (error) {
    console.error("Error fetching facility details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { teacherId } = req.params;
    // console.log("teacherId from params: ", teacherId);
    const { date, startTime, endTime, hoursWorked } = req.body;
    await FacilityAdmin.markTeacherAttendance(
      teacherId,
      date,
      startTime,
      endTime,
      hoursWorked
    );
    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.calculateWeeklyFinances = async (req, res) => {
  // console.log("test")
  try {
    // console.log(req.query)
    const { year, weekNumber } = req.query;

    const earnings = await facilityAdminmodel.getWeeklyEarnings(
      year,
      weekNumber
    );
    const billings = await facilityAdminmodel.getWeeklyBillings(
      year,
      weekNumber
    );

    // console.log("errn: ", earnings)
    res.json({
      year,
      weekNumber,
      earnings,
      billings,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error calculating weekly finances", error });
  }
};

exports.getClassrooms = async (req, res) => {
  // console.log("test");
  try {
    const { facilityId } = req.params;
    // console.log(facilityId);
    // console.log(req.query);
    const selectedDate =
      req.query.date || new Date().toISOString().split("T")[0]; // Default to current date
    const classrooms = await facilityAdminmodel.getClassrooms(
      facilityId,
      selectedDate
    );
    console.log("classrooms: ", classrooms);
    res.json(
      classrooms.map((classroom) => ({
        ...classroom,
        student_count: classroom.student_count.toString(),
        present_count: classroom.present_count.toString(),
        absent_count: classroom.absent_count.toString(),
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeacherHours = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const attendanceData = await facilityAdminmodel.getTeacherAttendanceByWeek(teacherId);
    res.json(attendanceData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};