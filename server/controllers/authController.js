const jwt = require("jsonwebtoken");
const FacilityAdmin = require("../models/facilityAdminmodel");
const Teacher = require("../models/teachermodel");
const Parent = require("../models/parentmodel");

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "password",
};

exports.login = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check for system admin credentials
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const token = jwt.sign(
        { username: ADMIN_CREDENTIALS.username, role: "Admin" },
        "YOUR_SECRET_KEY",
        { expiresIn: "1h" }
      );
      return res.status(200).json({ token });
    }

    // Check for facility admin credentials
    if (email && (await FacilityAdmin.validateCredentials(email, password))) {
      const facilityAdminDetails = await FacilityAdmin.getByEmail(email);
      // console.log(facilityAdminDetails);
      const token = jwt.sign(
        {
          email: email,
          role: "facility-admin",
          facility_id: facilityAdminDetails.admin_id,
        },
        "YOUR_SECRET_KEY",
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ token, facility_id: facilityAdminDetails.admin_id });
    }

    if (email && (await Teacher.validateCredentials(email, password))) {
      const teacherDetails = await Teacher.getByEmail(email);
      const token = jwt.sign(
        {
          email: email,
          role: "teacher",
          teacher_id: teacherDetails.teacher_id,
        },
        "YOUR_SECRET_KEY",
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ token, teacher_id: teacherDetails.teacher_id });
    }

    if (email && (await Parent.validateCredentials(email, password))) {
      const parentDetails = await Parent.getByEmail(email);
      const token = jwt.sign(
        {
          email: email,
          role: "parent",
          parent_id: parentDetails.parent_id,
        },
        "YOUR_SECRET_KEY",
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ token, parent_id: parentDetails.parent_id });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
