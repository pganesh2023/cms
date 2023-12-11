const pool = require("../config/database");

module.exports = {
  async create(adminData) {
    const { admin_id, first_name, last_name, email, contact_number, password } =
      adminData;
    await pool.query(
      "INSERT INTO FacilityAdmins (admin_id, first_name, last_name, email, contact_number, password) VALUES (?, ?, ?, ?, ?, ?)",
      [admin_id, first_name, last_name, email, contact_number, password]
    );
  },

  async getByEmail(email) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT * FROM FacilityAdmins WHERE email = ?",
        [email]
      );
      return rows[0];
    } finally {
      if (conn) conn.release();
    }
  },

  async validateCredentials(email, password) {
    const admin = await this.getByEmail(email);
    if (admin && admin.password === password) {
      // In the future, use bcrypt to check hashed password
      return true;
    }
    return false;
  },
  async getFacilityDetailsByEmail(email) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = `
      SELECT 
      Facilities.facility_id, 
      Facilities.name, 
      Facilities.address, 
      Facilities.phone_number, 
      Facilities.license_number, 
      FacilityAdmins.admin_id, 
      FacilityAdmins.first_name, 
      FacilityAdmins.last_name,
      FacilityAdmins.email, 
      FacilityAdmins.contact_number 
  FROM 
      FacilityAdmins 
  JOIN 
      Facilities ON Facilities.admin_id = FacilityAdmins.admin_id 
  WHERE 
      FacilityAdmins.email = ?
  
        `;
      const rows = await conn.query(query, [email]);
      //   console.log("Query Result:", rows);

      return rows[0];
    } finally {
      if (conn) conn.release();
    }
  },
  async markTeacherAttendance(
    teacherId,
    date,
    startTime,
    endTime,
    hoursWorked
  ) {
    // console.log("entered into model")
    const query = `
      INSERT INTO TeacherAttendance (teacher_id, date, start_time, end_time, hours_worked)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      await pool.query(query, [
        teacherId,
        date,
        startTime,
        endTime,
        hoursWorked,
      ]);
    } catch (error) {
      console.error("Error in markTeacherAttendance:", error);
      throw error;
    }
  },
  async getWeeklyEarnings(year, weekNumber) {
    const query =
      'SELECT SUM(amount) AS totalEarnings FROM Ledgers WHERE YEAR(date) = ? AND week_number = ? AND status = "paid"';
    const results = await pool.query(query, [year, weekNumber]);
    // console.log("results:", results);
    return results[0].totalEarnings;
  },
  async getWeeklyBillings(year, weekNumber) {
    const query =
      "SELECT SUM(amount) AS totalBillings FROM Ledgers WHERE YEAR(date) = ? AND week_number = ?";
    const results = await pool.query(query, [year, weekNumber]);
    // console.log("results:", results);
    return results[0].totalBillings;
  },
  async getClassrooms(facilityId, selectedDate) {
    // console.log("test");
    const query = `
      SELECT 
        c.classroom_id, 
        c.classroom_type, 
        c.capacity, 
        COUNT(ch.child_id) AS student_count,
        COALESCE(SUM(at.present), 0) AS present_count,
        (COUNT(ch.child_id) - COALESCE(SUM(at.present), 0)) AS absent_count
      FROM Classrooms c
      LEFT JOIN Children ch ON c.classroom_id = ch.classroom_id
      LEFT JOIN ChildAttendance at ON ch.child_id = at.child_id AND at.date = ?
      WHERE c.facility_id = ?
      GROUP BY c.classroom_id
    `;
    try {
      const rows = await pool.query(query, [selectedDate, facilityId]);
      // console.log("rows: ", rows);

      return rows;
    } catch (error) {
      console.error("Error in getClassrooms:", error);
      throw error;
    }
  },

  async getTeacherAttendanceByWeek(teacherId) {
    const query = `
    SELECT 
      T.first_name, 
      T.last_name, 
      WEEK(TA.date, 3) AS week_number, 
      SUM(TA.hours_worked) AS total_hours
    FROM TeacherAttendance TA
    JOIN Teachers T ON TA.teacher_id = T.teacher_id
    WHERE TA.teacher_id = ?
    GROUP BY WEEK(TA.date, 3), T.first_name, T.last_name
  `;
    const rows = await pool.query(query, [teacherId]);
    return rows;
  },
};
