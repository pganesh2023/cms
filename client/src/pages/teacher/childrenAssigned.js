import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TeacherSidebar from "../../components/TeacherSideBar";

function ChildrenAssigned() {
  const { teacherId } = useParams();
  const [children, setChildren] = useState([]);
  console.log("children: ", children);

  useEffect(() => {
    // Fetch children in the teacher's classroom
    const fetchChildren = async () => {
      try {
        const response = await fetch(`/api/teacher/${teacherId}/children`);
        if (!response.ok) {
          throw new Error("Failed to fetch children");
        }
        const data = await response.json();
        // Add an 'attendanceMarked' property to each child
        const updatedChildren = data.map((child) => ({
          ...child,
          attendance: false,
        }));
        setChildren(updatedChildren);
      } catch (error) {
        console.error("Error:", error);
        // Handle error appropriately
      }
    };

    fetchChildren();
  }, [teacherId]);

  const toggleAttendance = (childId) => {
    setChildren((prevChildren) =>
      prevChildren.map((child) =>
        child.child_id === childId
          ? { ...child, attendance: !child.attendance }
          : child
      )
    );
  };

  const saveAttendance = async () => {
    try {
      const attendanceData = children.map(({ child_id, attendance }) => ({
        child_id,
        present: attendance,
      }));
      const response = await fetch("/api/teacher/child/attendance/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attendanceData }),
      });
      if (!response.ok) {
        throw new Error("Failed to save attendance");
      }
      alert("Attendance saved successfully");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance");
    }
  };

  return (
    <div>
      <button onClick={saveAttendance} className="absolute right-4 bottom-12">Save Attendance</button>
      <TeacherSidebar></TeacherSidebar>
      <div className="flex justify-center my-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
          Children
        </h1>
      </div>
      <div className="flex justify-center mx-64 my-16 ">
        <div className="w-full shadow-md rounded-lg h-[500px] overflow-auto">
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Child ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Child name
                </th>
                <th scope="col" className="px-6 py-3">
                  DOB
                </th>
                <th scope="col" className="px-6 py-3">
                  Parent
                </th>
                <th scope="col" className="px-6 py-3">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody>
              {children.map((child, index) => {
                const date = new Date(child.DOB);
                const formattedDate = date.toLocaleDateString();
                // console.log("child:", child);
                return (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={child.child_id}
                  >
                    {/* <td className="px-6 py-4">{child.facility_id}</td> */}
                    <td className="px-6 py-4">{child.child_id}</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {child.first_name} {child.last_name}
                    </th>
                    <td className="px-6 py-4">{formattedDate}</td>
                    {/* <td className="px-6 py-4">{child.child_type}</td> */}
                    <td className="px-6 py-4">{child.parentName}</td>
                    {/* <Link
                      to={`${location.pathname}/ledger/${child.child_id}`}
                      className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded"
                    >
                      VIEW LEDGER
                    </Link> */}
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={child.attendance}
                        onChange={() => toggleAttendance(child.child_id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ChildrenAssigned;
