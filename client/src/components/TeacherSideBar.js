import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TeacherSidebar() {
  const navigate = useNavigate();
  const [teacherDetails, setTeacherDetails] = useState(null);
  // console.log(teacherDetails);
  const [showTeacherDetails, setShowTeacherDetails] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      axios
        .get("/api/teacher/details", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setTeacherDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching teacher details:", error);
        });
    }
  }, []);

  if (!teacherDetails) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleLogout} className="absolute right-4 top-4">
        Logout
      </button>

      <aside
        id="default-sidebar"
        className="w-auto fixed top-0 left-0 z-40 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="mb-4 p-4 border-b dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {teacherDetails.first_name} {teacherDetails.last_name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {teacherDetails.childrenCount} {teacherDetails.classroom_type}s
          </p>
        </div>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <span className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span
                  className="flex-1  whitespace-nowrap"
                  onClick={() =>
                    navigate(
                      `/teacher-dashboard/${teacherDetails.teacher_id}/children`
                    )
                  }
                >
                  Children
                </span>
              </span>
            </li>
            <li>
              <span className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span
                  className="flex-1  whitespace-nowrap"
                  onClick={() =>
                    navigate(
                      `/teacher-dashboard/${teacherDetails.facility_id}/view-salary`
                    )
                  }
                >
                  Salary
                </span>
              </span>
            </li>

            <li>
              <span
                className="flex items-center p-2  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setShowTeacherDetails(!showTeacherDetails)} // Toggle details on click
              >
                <span className="flex-1  whitespace-nowrap">Profile</span>
              </span>
              {showTeacherDetails && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                  <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    {`${teacherDetails.first_name} ${teacherDetails.last_name}`}
                  </p>
                  <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    {teacherDetails.email}
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {teacherDetails.contact_number}
                  </p>
                </div>
              )}
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default TeacherSidebar;
