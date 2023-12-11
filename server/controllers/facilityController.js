const Facility = require("../models/facilitymodel");
const FacilityAdmin = require("../models/facilityAdminmodel");

exports.createFacility = async (req, res) => {
  // console.log("test2");
  try {
    await Facility.create(req.body);
    res.status(201).json({ message: "Facility created successfully!" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.getById(req.params.facilityId);
    if (facility) {
      res.status(200).json(facility);
    } else {
      res.status(404).json({ message: "Facility not found" });
    }
  } catch (error) {
    console.error("Error fetching facility details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllFacilities = async (req, res) => {
  // console.log("test");
  try {
    const facilities = await Facility.getAll();
    res.status(200).json(facilities);
  } catch (error) {
    console.error("Error fetching facilities:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    await FacilityAdmin.create(req.body);
    res.status(201).json({
      message: "Admin created successfully",
      adminId: req.body.admin_id,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.assignAdminToFacility = async (req, res) => {
  try {
    await Facility.assignAdmin(req.params.facilityId, req.body.admin_id);
    res
      .status(200)
      .json({ message: "Admin assigned to facility successfully" });
  } catch (error) {
    if (error.message === "Facility already has an admin assigned.") {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error assigning admin to facility:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

exports.deleteFacility = async (req, res) => {
  // console.log("eneterd into delete facility controller")
  try {
    const { facilityId } = req.params;
    // console.log(facilityId);
    await Facility.deleteFacility(facilityId);
    res.json({ message: "Facility deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
