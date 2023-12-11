import Sidebar from "../../components/FacilityAdminSideBar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Attendance() {
  const { facilityId } = useParams();
  const [classrooms, setClassrooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // console.log("classroom: ", classrooms);

  // console.log(facilityId);

  useEffect(() => {
    async function fetchClassrooms() {
      const response = await fetch(
        `/api/facility/admin/classrooms/${facilityId}?date=${selectedDate}`
      );
      console.log("response: ", response);
      const data = await response.json();
    //   console.log("classrooms:", data);
      setClassrooms(data);
    }

    fetchClassrooms();
  }, [facilityId, selectedDate]);

  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="flex-1 p-4 ml-64">
        <div className="flex justify-center my-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
            Attendance
          </h1>
        </div>
        <div className="flex justify-center mx-64 my-16 ">
          <input
          className="h-10 absolute top-10 left-80"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <div className="w-full shadow-md rounded-lg h-[500px] overflow-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Classroom
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Present
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Absent
                  </th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map((classroom, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{classroom.classroom_type}</td>
                    <td className="px-6 py-4">{classroom.student_count}</td>
                    <td className="px-6 py-4">{classroom.present_count}</td>
                    <td className="px-6 py-4">{classroom.absent_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
