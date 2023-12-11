const express = require("express");
const facilityController = require("../controllers/facilityController");

const router = express.Router();

router.get("/", facilityController.getAllFacilities);
router.post("/", facilityController.createFacility);
router.post("/admins", facilityController.createAdmin);
router.delete("/:facilityId/delete", facilityController.deleteFacility);
router.put("/:facilityId/admin", facilityController.assignAdminToFacility);
router.get("/:facilityId", facilityController.getFacilityById);
router.delete("/:facilityId/delete", facilityController.deleteFacility);

module.exports = router;
