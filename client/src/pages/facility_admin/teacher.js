import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Sidebar from "../../components/FacilityAdminSideBar";

function Teacher() {
  // const navigate = useNavigate();
  const location = useLocation();

  const { facilityId } = useParams();
  // console.log(facilityId);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [teacherDetails, setTeacherDetails] = useState({
    teacher_id: "",
    first_name: "",
    last_name: "",
    DOB: "",
    address: "",
    phone_number: "",
    hourly_salary: "",
    email: "",
    password: "",
    facility_id: facilityId,
  });

  // console.log(teacherDetails);

  // Fetch classrooms when the component mounts
  useEffect(() => {
    fetch(`/api/teachers/count`)
      .then((response) => response.json())
      .then((totalCount) => {
        setTotalTeachers(totalCount);
      });
    async function fetchTeachers() {
      const response = await fetch(`/api/teachers/${facilityId}`);
      const data = await response.json();
      // console.log("teachers:", data);
      setTeachers(data);
    }
    async function fetchClassrooms() {
      const response = await fetch(`/api/classrooms/${facilityId}`);
      const classroomsData = await response.json();

      const classroomsWithTeacherInfo = await Promise.all(
        classroomsData.map(async (classroom) => {
          const teacherInfoResponse = await fetch(
            `/api/classrooms/teacher-info/${classroom.classroom_id}`
          );
          const teacherInfo = await teacherInfoResponse.json();
          return { ...classroom, ...teacherInfo };
        })
      );

      setClassrooms(classroomsWithTeacherInfo);
    }

    fetchTeachers();
    fetchClassrooms();
  }, [facilityId]);

  // console.log(classrooms);
  // console.log("teachers from front: ", teachers);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const createTeacher = (e) => {
    e.preventDefault();
    fetch("/api/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacherDetails),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Teacher created successfully!");
        window.location.reload();

        // Optionally navigate somewhere or reset the form
        // navigate('/some-path');
        // setTeacherDetails({ ...teacherDetails, teacher_id: data.teacherId });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      });
  };

  const assignTeacherToClassroom = (teacherId, classroomId) => {
    // Check if teacherId and classroomId are valid
    // console.log("teacher_id: ", teacherId);
    // console.log("classroom_id: ", classroomId);

    if (!teacherId || !classroomId) {
      alert("Please select a teacher and a classroom.");
      return;
    }

    // Proceed with the assignment using fetch
    fetch(`/api/teachers/assign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Include any other headers your API requires, such as authentication tokens
      },
      body: JSON.stringify({
        classroom_id: classroomId,
        teacher_id: teacherId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        window.location.reload();

        alert("Teacher assigned to classroom successfully!");
        // Perform any additional actions after successful assignment,
        // like updating the state to reflect the change in the UI
      })
      .catch((error) => {
        console.error("Error during teacher assignment:", error);
        alert(`Error during teacher assignment: ${error.message}`);
      });
  };

  const markAttendance = async (teacherId) => {
    console.log(teacherId);
    const { startTime, endTime } = attendanceData[teacherId] || {};
    if (!startTime || !endTime) {
      alert("Please enter both start and end times.");
      return;
    }

    const hoursWorked = calculateHoursWorked(startTime, endTime);
    if (hoursWorked <= 0) {
      alert("End time must be after start time.");
      return;
    }

    try {
      const date = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
      await fetch(`/api/facility/admin/teacher/attendance/${teacherId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, startTime, endTime, hoursWorked }),
      });
      alert("Attendance marked successfully");
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance");
    }
  };

  const handleAttendanceChange = (e, teacherId, field) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [teacherId]: { ...prevData[teacherId], [field]: e.target.value },
    }));
  };

  const calculateHoursWorked = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startDate = new Date(0, 0, 0, startHours, startMinutes, 0);
    const endDate = new Date(0, 0, 0, endHours, endMinutes, 0);
    const diff = endDate.getTime() - startDate.getTime();

    return diff / (1000 * 60 * 60); // Convert milliseconds to hours
  };

  // const handleLogout = () => {
  //   sessionStorage.removeItem("token");
  //   navigate("/");
  // };

  const deleteTeacher = (teacherId) => {
    console.log(teacherId);
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      fetch(`/api/teacher/${teacherId}/delete`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Update UI or navigate
            console.log("test");
            window.location.reload();
          } else {
            console.error("Error deleting teacher");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="flex-1 p-4 ml-64">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center my-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
              Teachers
            </h1>
          </div>
          <div className="flex justify-end mx-10">
            <button
              onClick={() => document.getElementById("myModal").showModal()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-2xl absolute right-16"
            >
              +
            </button>
          </div>
          <dialog id="myModal">
            <form
              onSubmit={createTeacher}
              className="h-auto bg-gray-900 p-6 flex items-center justify-center text-white"
            >
              <div className="container max-w-screen-lg mx-auto">
                <div className="bg-gray-900 rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                    <div>
                      <p className="font-medium text-lg">Teacher Details</p>
                      <p>Please fill out all the fields.</p>
                    </div>
                    <div className="md:col-span-5">
                      <h2 className="text-lg mb-2">
                        Total Number of Teachers accros all facilities:{" "}
                        {totalTeachers}
                      </h2>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-1">
                          <label htmlFor="teacher_id">Teacher ID</label>
                          <input
                            type="text"
                            name="teacher_id"
                            id="teacher_id"
                            className="h-10 border mt-1 rounded px-4 w-full text-black"
                            value={teacherDetails.teacher_id}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="first_name">First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            className="h-10 border mt-1 rounded px-4 w-full text-black"
                            value={teacherDetails.first_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="last_name">Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="h-10 border mt-1 rounded px-4 w-full text-black"
                            value={teacherDetails.last_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="DOB">DOB</label>
                          <input
                            type="date"
                            name="DOB"
                            id="DOB"
                            className="h-10 border mt-1 rounded px-4 w-full text-black"
                            value={teacherDetails.DOB}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label htmlFor="phone_number">Phone Number</label>
                          <input
                            type="text"
                            name="phone_number"
                            id="phone_number"
                            className="h-10 border mt-1 rounded px-4 w-full text-black"
                            value={teacherDetails.phone_number}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="md:col-span-5">
                          <label htmlFor="address">Address</label>
                          <textarea
                            name="address"
                            id="address"
                            rows="3"
                            className="h-24 border mt-1 rounded px-4 w-full text-black"
                            value={teacherDetails.address}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        <div className="md:col-span-3">
                          <label htmlFor="email">Email</label>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            className="h-10 border mt-1 rounded px-4 w-full text-black"
                            value={teacherDetails.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="password">Password</label>
                          <input
                            type="text"
                            name="password"
                            id="password"
                            className="h-10 border mt-1 rounded px-4 w-full text-black"
                            value={teacherDetails.password}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="md:col-span-5 text-right">
                          <div className="inline-flex items-end">
                            <button
                              type="submit"
                              className="mt-8"
                              onClick={() =>
                                document.getElementById("myModal").close()
                              }
                            >
                              Submit
                            </button>
                            <div
                              onClick={() =>
                                document.getElementById("myModal").close()
                              }
                              className="flex w-1/12 h-auto justify-center cursor-pointer absolute top-5 right-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#9333ea"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-x"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </dialog>
          <div className="flex justify-center mx-16 my-16">
            <div className="w-full shadow-md rounded-lg h-[500px] overflow-auto">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Facility ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Teacher ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Teacher name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Classroom
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Start time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      End time
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3">
                      View Hours Worked
                    </th>
                    {/* <th scope="col" className="px-6 py-3">
                    DOB
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Child Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Parent
                  </th> */}
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => {
                    return (
                      <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        key={teacher.teacher_id}
                      >
                        <td className="px-6 py-4">{teacher.facility_id}</td>
                        <td className="px-6 py-4">{teacher.teacher_id}</td>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {teacher.first_name} {teacher.last_name}
                        </th>
                        <td className="px-6 py-4">
                          {teacher.classroom_id ? (
                            `${teacher.classroom_type}`
                          ) : (
                            // When the ASSIGN button is clicked, the current teacher's ID is passed along with the classroom ID
                            <button
                              onClick={() =>
                                document.getElementById("myModal1").showModal()
                              }
                              data-teacher-id={teacher.teacher_id} // You can use a data attribute to store the teacher ID
                            >
                              ASSIGN
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="time"
                            onChange={(e) =>
                              handleAttendanceChange(
                                e,
                                teacher.teacher_id,
                                "startTime"
                              )
                            }
                            value={
                              attendanceData[teacher.teacher_id]?.startTime ||
                              ""
                            }
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="time"
                            onChange={(e) =>
                              handleAttendanceChange(
                                e,
                                teacher.teacher_id,
                                "endTime"
                              )
                            }
                            value={
                              attendanceData[teacher.teacher_id]?.endTime || ""
                            }
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => markAttendance(teacher.teacher_id)}
                          >
                            Submit
                          </button>
                        </td>
                        <td>
                          <Link
                            to={`${location.pathname}/view-hours-worked/${teacher.teacher_id}`}
                            className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded"
                          >
                            VIEW
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => deleteTeacher(teacher.teacher_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <dialog id="myModal1">
            <div className="h-auto bg-gray-900 p-6 flex flex-col items-center justify-center text-white">
              <div className="overflow-auto max-h-80 w-full">
                <table className="min-w-full">
                  <tbody>
                    {classrooms.map((classroom) => (
                      <tr key={classroom.classroom_id} className="border-b">
                        <td className="px-6 py-4">
                          {classroom.classroom_type}
                        </td>
                        <td className="px-6 py-4">
                          {classroom.currentTeachers}/
                          {classroom.requiredTeachers}
                        </td>
                        <td className="px-6 py-4">
                          {classroom.currentTeachers <
                          classroom.requiredTeachers ? (
                            <button
                              onClick={(e) => {
                                const assignButton = document.querySelector(
                                  "button[data-teacher-id]"
                                );
                                const teacherId =
                                  assignButton.getAttribute("data-teacher-id");
                                assignTeacherToClassroom(
                                  teacherId,
                                  classroom.classroom_id
                                );
                              }}
                            >
                              Assign
                            </button>
                          ) : (
                            <button
                              disabled
                              className="bg-gray-400 w-full text-white font-bold py-2 px-4 rounded cursor-not-allowed opacity-75"
                            >
                              Full
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                onClick={() => document.getElementById("myModal1").close()}
                className="flex w-full justify-center cursor-pointer mt-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-x"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}

export default Teacher;
