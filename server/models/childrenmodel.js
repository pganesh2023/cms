const pool = require("../config/database");

module.exports = {
  async create(childData) {
    const {
      child_id,
      facility_id,
      first_name,
      last_name,
      DOB,
      child_type,
      allergies,
      parent_id,
      classroom_id,
    } = childData;
    await pool.query(
      "INSERT INTO Children (child_id, facility_id, first_name, last_name, DOB, child_type, allergies, parent_id, classroom_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        child_id,
        facility_id,
        first_name,
        last_name,
        DOB,
        child_type,
        allergies,
        parent_id,
        classroom_id,
      ]
    );
  },

  async getChildNameById(childId) {
    const query = `SELECT first_name, last_name FROM Children WHERE child_id = ?`;
    try {
      const [rows] = await pool.query(query, [childId]);

      if ([rows].length > 0) {
        return rows; // Returns the first row (should only be one row)
      } else {
        return null; // No child found with the given id
      }
    } catch (error) {
      console.error("Error in getChildNameById:", error);
      throw error;
    }
  },

  async getAll(facilityId) {
    const query = `SELECT * FROM Children WHERE facility_id = ?`;
    return await pool.query(query, [facilityId]);
  },
  async getAllChildren() {
    const query = `SELECT child_id, child_type, date_created FROM Children`; // Adjust the selected columns as needed
    try {
      const rows = await pool.query(query);
      // console.log('getAllChildren result:', rows); // Add this line for debugging
      return rows;
    } catch (error) {
      console.error("Error in getAllChildren:", error);
      throw error;
    }
  },

  async getCount() {
    const query = `SELECT COUNT(*) AS total FROM Children`;
    return await pool.query(query);
  },

  async getClassroomByType(childType, facilityId) {
    const query = `SELECT classroom_id, capacity FROM Classrooms WHERE classroom_type = ? AND facility_id = ?`;
    const [results] = await pool.query(query, [childType, facilityId]);
    return results;
  },

  async countChildrenInClassroom(classroomId) {
    const query = `SELECT COUNT(*) AS count FROM Children WHERE classroom_id = ?`;
    const [results] = await pool.query(query, [classroomId]);
    // console.log("count results: ", results.count.toString());
    return results.count.toString();
  },

  async getAllClassrooms(facilityId) {
    // console.log("model id",facilityId);
    const query = `SELECT * FROM Classrooms WHERE facility_id = ?`;
    const rows = await pool.query(query, [facilityId]);
    // console.log("Rows returned from the database:", rows);
    return rows;
  },

  // In your Classroom model
  async getAllWithTeacherInfo(facility_id) {
    const query = `
    SELECT Classrooms.classroom_id, Classrooms.classroom_type, Classrooms.capacity,
           COUNT(Teachers.teacher_id) AS assignedTeachers,
           GROUP_CONCAT(CONCAT(Teachers.first_name, ' ', Teachers.last_name) SEPARATOR ', ') AS teacherNames
    FROM Classrooms
    LEFT JOIN Teachers ON Classrooms.classroom_id = Teachers.classroom_id
    WHERE Classrooms.facility_id = ?
    GROUP BY Classrooms.classroom_id;
  `;
    return await pool.query(query, [facility_id]);
  },
  async calculateTuitionFee(childType) {
    const fees = {
      Infant: 300,
      Toddler: 275,
      Twaddler: 250,
      "3 Years Old": 225,
      "4 Years Old": 200,
    };
    return fees[childType] || 0; // Default fee if type is not matched
  },
  async getChildrenInClassroom(classroomId) {
    const query = `SELECT Children.*, CONCAT(Parents.first_name, ' ', Parents.last_name) AS parentName
    FROM Children
    LEFT JOIN Parents ON Children.parent_id = Parents.parent_id
    WHERE Children.classroom_id = ?;`;
    try {
      const rows = await pool.query(query, [classroomId]);
      return rows;
    } catch (error) {
      console.error("Error in getChildrenInClassroom:", error);
      throw error;
    }
  },

  async markChildAttendance(childId, present) {
    const checkQuery = `SELECT * FROM ChildAttendance WHERE child_id = ? AND date = CURDATE()`;
    const [existingRecords] = await pool.query(checkQuery, [childId]);

    if (existingRecords.length > 0) {
      throw new Error("Attendance already marked for today");
    }

    const insertQuery = `
      INSERT INTO ChildAttendance (child_id, date, present)
      VALUES (?, CURDATE(), ?)
    `;
    await pool.query(insertQuery, [childId, present]);
  },
  async deleteChild(childId) {
    // console.log("eneterd into delete children model")
    try {
      await pool.query("DELETE FROM Ledgers WHERE child_id = ?", [childId]);
      await pool.query("DELETE FROM ChildAttendance WHERE child_id = ?", [
        childId,
      ]);
      await pool.query("DELETE FROM Children WHERE child_id = ?", [childId]);
    } catch (error) {
      throw error;
    }
  },
};
