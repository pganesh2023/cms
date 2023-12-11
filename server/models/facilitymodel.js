const pool = require("../config/database");

module.exports = {
  async create(facilityData) {
    const { facility_id, name, address, phone_number, license_number } =
      facilityData;
    await pool.query(
      "INSERT INTO Facilities (facility_id, name, address, phone_number, license_number) VALUES (?, ?, ?, ?, ?)",
      [facility_id, name, address, phone_number, license_number]
    );

    await this.createDefaultClassrooms(facility_id);
  },

  async getById(facilityId) {
    const [result] = await pool.query(
      "SELECT * FROM Facilities WHERE facility_id = ?",
      [facilityId]
    );
    return result[0]; // Assuming there's only one facility with a given ID
  },

  async getAll() {
    const query = `
          SELECT Facilities.*, FacilityAdmins.first_name, FacilityAdmins.last_name
          FROM Facilities
          LEFT JOIN FacilityAdmins ON Facilities.admin_id = FacilityAdmins.admin_id
        `;
    return await pool.query(query);
  },

  async assignAdmin(facilityId, adminId) {
    const [existingAdmin] = await pool.query(
      "SELECT admin_id FROM Facilities WHERE facility_id = ?",
      [facilityId]
    );
    if (existingAdmin && existingAdmin.admin_id) {
      throw new Error("Facility already has an admin assigned.");
    }
    await pool.query(
      "UPDATE Facilities SET admin_id = ? WHERE facility_id = ?",
      [adminId, facilityId]
    );
  },
  async createDefaultClassrooms(facilityId) {
    const classroomTypes = [
      { type: "Infant", capacity: 8 },
      { type: "Toddler", capacity: 12 },
      { type: "Twaddler", capacity: 16 },
      { type: "3 Years Old", capacity: 18 },
      { type: "4 Years Old", capacity: 20 },
    ];

    // Let's assume the tuition_fee for all classrooms is the same for this example.
    // You might want to vary this based on the type of classroom in a real-world scenario.
    const tuitionFee = 1000.0; // Example tuition fee

    for (const classroom of classroomTypes) {
      await pool.query(
        "INSERT INTO Classrooms (classroom_type, capacity, tuition_fee, facility_id) VALUES (?, ?, ?, ?)",
        [classroom.type, classroom.capacity, tuitionFee, facilityId]
      );
    }
  },
  async deleteFacility(facilityId) {
    // console.log("enetered into delete facility model");
    try {
      const parents = await pool.query(
        "SELECT DISTINCT parent_id FROM Children WHERE facility_id = ?",
        [facilityId]
      );

      const parentIds = parents.map((p) => p.parent_id);
      console.log(parentIds);

      await pool.query(
        "DELETE FROM TeacherAttendance WHERE teacher_id IN (SELECT teacher_id FROM Teachers WHERE facility_id = ?)",
        [facilityId]
      );
      await pool.query("DELETE FROM Teachers WHERE facility_id = ?", [
        facilityId,
      ]);
      await pool.query(
        "DELETE FROM Ledgers WHERE child_id IN (SELECT child_id FROM Children WHERE facility_id = ?)",
        [facilityId]
      );
      await pool.query(
        "DELETE FROM ChildAttendance WHERE child_id IN (SELECT child_id FROM Children WHERE facility_id = ?)",
        [facilityId]
      );
      await pool.query("DELETE FROM Children WHERE facility_id = ?", [
        facilityId,
      ]);
      for (const parentId of parentIds) {
        await pool.query("DELETE FROM Parents WHERE parent_id = ?", [parentId]);
      }
      await pool.query("DELETE FROM Classrooms WHERE facility_id = ?", [
        facilityId,
      ]);
      await pool.query("DELETE FROM Facilities WHERE facility_id = ?", [
        facilityId,
      ]);
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  },
};
