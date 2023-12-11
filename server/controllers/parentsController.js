const Parents = require("../models/parentmodel");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  try {
    // console.log("body:",req.body);
    await Parents.create(req.body);
    res.status(201).send({ message: "Parent created successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const parent = await Parents.getById(req.params.parent_id);
    if (parent) {
      res.json(parent);
    } else {
      res.status(404).send({ message: "Parent not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getParentDetails = async (req, res) => {
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

    const parentDetails = await Parents.getParentDetailsByEmail(email);
    res.status(200).json(parentDetails);
  } catch (error) {
    console.error("Error fetching facility details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getChildAttendance = async (req, res) => {
  //   console.log("test");
  try {
    const { parentId } = req.params;
    // console.log(req.params);
    // console.log(parentId);
    const attendanceData = await Parents.getChildAttendance(parentId);
    let weeklyAttendance = new Array(52)
      .fill(0)
      .map((_, i) => ({ week: i + 1, presentCount: 0 }));

    attendanceData.forEach((data) => {
      const weekIndex = data.week_number - 1;
      weeklyAttendance[weekIndex].presentCount = data.present_count;
    });

    res.json(weeklyAttendance);
  } catch (error) {
    console.error("Error in getChildAttendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMonthlyChildAttendance = async (req, res) => {
  //   console.log("test");
  try {
    const { parentId } = req.params;
    // console.log(req.params);
    // console.log(parentId);
    const attendanceData = await Parents.getMonthlyChildAttendance(parentId);

    res.json(attendanceData);
  } catch (error) {
    console.error("Error in getChildAttendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
