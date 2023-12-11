const pool = require("../config/database");

module.exports = {
  async create(teacherData) {
    // console.log("teacherData: ", teacherData);
    const {
      teacher_id,
      first_name,
      last_name,
      DOB,
      address,
      phone_number,
      email,
      password,
      facility_id,
    } = teacherData;
    await pool.query(
      "INSERT INTO Teachers (teacher_id, first_name, last_name, DOB, address, phone_number, email, password, facility_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        teacher_id,
        first_name,
        last_name,
        DOB,
        address,
        phone_number,
        email,
        password,
        facility_id,
      ]
    );
  },
  async getAll(facility_id) {
    const query = `
    SELECT Teachers.*, Classrooms.classroom_type
    FROM Teachers
    LEFT JOIN Classrooms ON Teachers.classroom_id = Classrooms.classroom_id
    WHERE Teachers.facility_id = ?
    `;
    return await pool.query(query, [facility_id]);
  },

  async assignTeacherToClassroom(teacher_id, classroom_id) {
    const query = `UPDATE Teachers SET classroom_id = ? WHERE teacher_id = ?`;
    return await pool.query(query, [classroom_id, teacher_id]);
  },

  async getCount() {
    const query = `SELECT COUNT(*) AS total FROM Teachers`;
    return await pool.query(query);
  },

  async getRequiredTeacherCount(classroomId) {
    // console.log("classroom_id_model:", classroomId);
    const [classroom] = await pool.query(
      `
    SELECT Classrooms.classroom_type, COUNT(Children.child_id) AS childCount
    FROM Classrooms
    LEFT JOIN Children ON Classrooms.classroom_id = Children.classroom_id
    WHERE Classrooms.classroom_id = ?
    GROUP BY Classrooms.classroom_type
    `,
      [classroomId]
    );

    // console.log("[classroom] :", [classroom]);
    if (!classroom) return null;

    let ratio;
    switch (classroom.classroom_type) {
      case "Infant":
        ratio = 4;
        break;
      case "Toddler":
        ratio = 6;
        break;
      case "Twadller":
        ratio = 8;
        break;
      case "3 years":
        ratio = 9;
        break;
      case "4 years":
        ratio = 10;
        break;
      default:
        ratio = 10; // Default ratio for other types not specified
    }

    const requiredTeachers = Math.ceil(Number(classroom.childCount) / ratio);
    return {
      requiredTeachers,
      childCount: classroom.childCount,
      classroomType: classroom.classroom_type,
    };
  },

  async countTeachersInClassroom(classroomId) {
    const query = `SELECT COUNT(*) AS teacherCount FROM Teachers WHERE classroom_id = ?`;
    const [results] = await pool.query(query, [classroomId]);
    return Number(results.teacherCount);
  },

  async getTeachersInClassroom(classroomId) {
    const query = `
    SELECT teacher_id, first_name, last_name
    FROM Teachers
    WHERE classroom_id = ?
  `;
    const teachers = await pool.query(query, [classroomId]);
    return teachers; // This will be an array of teacher objects
  },

  async getByEmail(email) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM Teachers WHERE email = ?", [
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

  async getTeacherDetailsByEmail(email) {
    // console.log("test");
    const query = `SELECT Teachers.*, 
    Classrooms.classroom_type
    FROM Teachers
    LEFT JOIN Classrooms ON Teachers.classroom_id = Classrooms.classroom_id
    WHERE Teachers.email = ?`;
    try {
      const [rows] = await pool.query(query, [email]);
      return rows;
    } catch (error) {
      console.error("Error in getTeacherByEmail:", error);
      throw error;
    }
  },

  async getTeacherDetailsById(teacherId) {
    const query = `SELECT * FROM Teachers WHERE teacher_id = ?`;
    try {
      const [rows] = await pool.query(query, [teacherId]);
      return rows;
    } catch (error) {
      console.error("Error in getTeacherDetailsById:", error);
      throw error;
    }
  },

  async bulkInsertAttendance(attendanceArray) {
    // console.log("entered into model");
    const query = `
      INSERT INTO ChildAttendance (child_id, date, present)
      VALUES (?, CURDATE(), ?)
    `;
    try {
      await Promise.all(
        attendanceArray.map((attendance) =>
          pool.query(query, [attendance.child_id, attendance.present])
        )
      );
    } catch (error) {
      console.error("Error in bulkInsertAttendance:", error);
      throw error;
    }
  },
  async deleteTeacher(teacherId) {
    console.log("eneterd into delete teacher model");
    try {
      await pool.query("DELETE FROM TeacherAttendance WHERE teacher_id = ?", [
        teacherId,
      ]);
      await pool.query("DELETE FROM Teachers WHERE teacher_id = ?", [
        teacherId,
      ]);
    } catch (error) {
      throw error;
    }
  },
};
