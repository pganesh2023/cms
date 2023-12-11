import TeacherSidebar from "../../components/TeacherSideBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function TeacherSalary() {
  const { teacherId } = useParams();
  const [hoursWorked, setHoursWorked] = useState([]);

  useEffect(() => {
    const fetchTeacherHours = async () => {
      try {
        const response = await fetch(
          `/api/facility/admin/teacher/attendance/${teacherId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        setHoursWorked(data); // Assuming you have a state variable for this
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchTeacherHours();
  }, [teacherId]);

  return (
    <div className="flex">
      <TeacherSidebar></TeacherSidebar>
      <div className="flex-1 p-4 ml-64">
        <div className="flex justify-center my-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
            {hoursWorked.length > 0
              ? `Hours Worked for ${hoursWorked[0].first_name} ${hoursWorked[0].last_name}`
              : "Hours Worked"}
          </h1>
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
                    Hours Worked
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Salary Earned
                  </th>
                </tr>
              </thead>
              <tbody>
                {hoursWorked.map((record, index) => (
                  <tr key={index}>
                    {/* <td className="px-6 py-4">{record.first_name} {record.last_name}</td> */}
                    <td className="px-6 py-4">{record.week_number}</td>
                    <td className="px-6 py-4">{record.total_hours}</td>
                    <td className="px-6 py-4">${record.total_hours * 20}</td>
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

export default TeacherSalary;
