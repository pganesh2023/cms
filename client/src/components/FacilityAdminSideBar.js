import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const [facilityDetails, setFacilityDetails] = useState(null);
  const [showAdminDetails, setShowAdminDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      axios
        .get("/api/facility/admin/details", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setFacilityDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching facility details:", error);
        });
    }
  }, []);

  if (!facilityDetails) {
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
            {facilityDetails.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {facilityDetails.license_number}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {facilityDetails.address}
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
                      `/facility-admin-dashboard/${facilityDetails.facility_id}/children`
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
                      `/facility-admin-dashboard/${facilityDetails.facility_id}/teachers`
                    )
                  }
                >
                  Teachers
                </span>
              </span>
            </li>
            <li>
              <span className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span
                  className="flex-1  whitespace-nowrap"
                  onClick={() =>
                    navigate(
                      `/facility-admin-dashboard/${facilityDetails.facility_id}/classrooms`
                    )
                  }
                >
                  Classrooms
                </span>
              </span>
            </li>
            <li>
              <span
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="flex-1 whitespace-nowrap">Reports</span>
              </span>
              {showDropdown && (
                <ul className="pl-4 mt-2 space-y-2">
                  <li
                    className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() =>
                      navigate(
                        `/facility-admin-dashboard/${facilityDetails.facility_id}/reports/attendance`
                      )
                    }
                  >
                    Attendance
                  </li>
                  <li
                    className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() =>
                      navigate(
                        `/facility-admin-dashboard/${facilityDetails.facility_id}/reports/finances`
                      )
                    }
                  >
                    Finances
                  </li>
                </ul>
              )}
            </li>

            <li>
              <span
                className="flex items-center p-2  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setShowAdminDetails(!showAdminDetails)} // Toggle details on click
              >
                <span className="flex-1  whitespace-nowrap">Profile</span>
              </span>
              {showAdminDetails && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                  <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    {`${facilityDetails.first_name} ${facilityDetails.last_name}`}
                  </p>
                  <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    {facilityDetails.email}
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {facilityDetails.contact_number}
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

export default Sidebar;
