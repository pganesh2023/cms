import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/FacilityAdminSideBar";

function Classroom() {
  // const navigate = useNavigate();
  const { facilityId } = useParams();
  const [classrooms, setClassrooms] = useState([]);

  const calculateRequiredTeachers = (classroomType, studentCount) => {
    switch (classroomType) {
      case "Infant":
        return Math.ceil(studentCount / 4);
      case "Toddler":
        return Math.ceil(studentCount / 6);
      case "Twaddler":
        return Math.ceil(studentCount / 8);
      case "3 Years Old":
        return Math.ceil(studentCount / 9);
      case "4 Years Old":
        return Math.ceil(studentCount / 10);
      default:
        return 0;
    }
  };

  useEffect(() => {
    async function fetchClassrooms() {
      const response = await fetch(`/api/classrooms/${facilityId}`);
      const data = await response.json();
      // console.log("classrooms:", data);
      setClassrooms(data);
    }

    fetchClassrooms();
  }, [facilityId]);

  // const handleLogout = () => {
  //   sessionStorage.removeItem("token");
  //   navigate("/");
  // };

  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="flex-1 p-4 ml-64">
        <div className="flex justify-center my-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
            Classrooms
          </h1>
        </div>
        <div className="flex justify-center mx-64 my-16">
          <div className="w-full shadow-md rounded-lg h-[500px] overflow-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                <tr>
                  {/* <th scope="col" className="px-6 py-3">
                    Classroom ID
                  </th> */}
                  <th scope="col" className="px-6 py-3">
                    Classroom Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Capacity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    # Students
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Teachers
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Assignments
                  </th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map((classroom) => {
                  const requiredTeachers = calculateRequiredTeachers(
                    classroom.classroom_type,
                    classroom.studentCount
                  );
                  const assignedTeachers = classroom.assignedTeachers;
                  return (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      key={classroom.classroom_id}
                    >
                      {/* <td className="px-6 py-4">{classroom.classroom_id}</td> */}
                      <td className="px-6 py-4">{classroom.classroom_type}</td>
                      <td className="px-6 py-4">{classroom.capacity}</td>
                      <td className="px-6 py-4">{classroom.studentCount}</td>
                      <td className="px-6 py-4">
                        {/* Display teacher names */}
                        {classroom.teacherDetails.map((teacher) => (
                          <div
                            key={teacher.teacher_id}
                          >{`${teacher.first_name} ${teacher.last_name}`}</div>
                        ))}
                      </td>
                      <td className="px-6 py-4">{`${assignedTeachers}/${requiredTeachers}`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Classroom;
