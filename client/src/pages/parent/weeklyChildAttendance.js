import React, { useState, useEffect } from "react";
import ParentSidebar from "../../components/ParentSidebar";
import { useParams } from "react-router-dom";

function WeeklyChildAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const { parentId } = useParams();
  // console.log(attendanceData);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(
          `/api/parent/child-attendance/${parentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error:", error);
        // Handle error appropriately
      }
    };

    fetchAttendance();
  }, [parentId]);

  return (
    <div>
      <ParentSidebar></ParentSidebar>
      <div className="flex-1 ml-64 p-4">
        <div className="flex justify-center my-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
            Weekly Attendance
          </h2>
        </div>
        <div className="flex justify-center mx-64 my-16 ">
          <div className="w-full shadow-md rounded-lg h-[500px] overflow-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Week Number
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
                {attendanceData.map((weekData) => (
                  <tr
                    key={weekData.week}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{weekData.week}</td>
                    {/* <td className="px-6 py-4">
                        {new Date(record.date).toLocaleDateString()}
                      </td> */}
                    <td className="px-6 py-4">{weekData.presentCount}</td>
                    <td className="px-6 py-4">{5 - weekData.presentCount}</td>
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

export default WeeklyChildAttendance;
