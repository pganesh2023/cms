const pool = require("../config/database");

module.exports = {
  async create(parentData) {
    // console.log(parentData);
    const {
      parent_id,
      first_name,
      last_name,
      phone_number,
      email,
      address,
      password,
    } = parentData;
    await pool.query(
      "INSERT INTO Parents (parent_id, first_name, last_name, phone_number, email, address, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [parent_id, first_name, last_name, phone_number, email, address, password]
    );
  },
  async getById(parentId) {
    try {
      const result = await pool.query(
        "SELECT * FROM Parents WHERE parent_id = ?",
        [parentId]
      );
      return result[0]; // Assuming the query returns an array with the parent object as the first element
    } catch (error) {
      throw error;
    }
  },
  async getByEmail(email) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM Parents WHERE email = ?", [
        email,
      ]);
      return rows[0];
    } finally {
      if (conn) conn.release();
    }
  },
  async validateCredentials(email, password) {
    const admin = await this.getByEmail(email);
    if (admin && admin.password === password) {
      return true;
    }
    return false;
  },
  async getParentDetailsByEmail(email) {
    // console.log("test");
    const query = `SELECT Parents.*, 
    Children.first_name AS child_first_name, Children.last_name AS child_last_name, Children.DOB, Children.child_type, Children.allergies, Children.date_created
    FROM Parents
    LEFT JOIN Children ON Parents.parent_id = Children.parent_id
    WHERE Parents.email = ?`;
    try {
      const [rows] = await pool.query(query, [email]);
      return rows;
    } catch (error) {
      console.error("Error in getParentByEmail:", error);
      throw error;
    }
  },
  async getChildAttendance(childId) {
    const query = `
    SELECT WEEK(date, 3) AS week_number, COUNT(*) AS present_count
    FROM ChildAttendance
    WHERE child_id = ? AND present = TRUE
    GROUP BY WEEK(date, 3)
    ORDER BY WEEK(date, 3);
  `;
    try {
      const rows = await pool.query(query, [childId]);
      return rows.map((row) => ({
        week_number: Number(row.week_number),
        present_count: Number(row.present_count),
      }));
    } catch (error) {
      console.error("Error in getChildAttendance:", error);
      throw error;
    }
  },
  async getMonthlyChildAttendance(childId) {
    const query = `
    SELECT MONTH(date) AS month, 
           SUM(present = TRUE) AS present_count, 
           SUM(present = FALSE) AS absent_count
    FROM ChildAttendance
    WHERE child_id = ?
    GROUP BY MONTH(date)
    ORDER BY MONTH(date);
  `;
    try {
      const rows = await pool.query(query, [childId]);
      return rows.map((row) => ({
        month: row.month,
        present_count: row.present_count,
        absent_count: row.absent_count,
      }));
    } catch (error) {
      console.error("Error in getMonthlyAttendance:", error);
      throw error;
    }
  },
};
