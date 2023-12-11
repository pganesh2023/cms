import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ParentSidebar() {
  const navigate = useNavigate();
  const [parentDetails, setParentDetails] = useState(null);
  // console.log(parentDetails);
  const [showParentDetails, setShowparentDetails] = useState(false);
  const [showChildrenDetails, setShowChildrenDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetch("/api/parent/details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setParentDetails(data);
        })
        .catch((error) => {
          console.error("Error fetching parent details:", error);
        });
    }
  }, []);
  
  

  if (!parentDetails) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const date = new Date(parentDetails.DOB);
  const formattedDate = date.toLocaleDateString();

  const date_created = new Date(parentDetails.date_created);
  const formattedDateCreated = date_created.toLocaleDateString();

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
            {parentDetails.first_name} {parentDetails.last_name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {parentDetails.child_first_name} {parentDetails.child_last_name}
          </p>
        </div>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <li>
                <span
                  className="flex items-center p-2  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={() => setShowChildrenDetails(!showChildrenDetails)} // Toggle details on click
                >
                  <span className="flex-1  whitespace-nowrap">
                    Child Details
                  </span>
                </span>
                {showChildrenDetails && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                    <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                      {`${parentDetails.child_first_name} ${parentDetails.child_last_name}`}
                    </p>
                    <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                      DOB: {formattedDate}
                    </p>
                    <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                      {parentDetails.child_type}
                    </p>
                    <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                      Allergies: {parentDetails.allergies}
                    </p>
                    <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                      Joined on {formattedDateCreated}
                    </p>
                  </div>
                )}
              </li>
              <span className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span
                  className="flex-1  whitespace-nowrap"
                  onClick={() =>
                    navigate(
                      `/parent-dashboard/${parentDetails.parent_id}/view-ledger`
                    )
                  }
                >
                  Ledger
                </span>
              </span>
            </li>
            <li>
              <span
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="flex-1 whitespace-nowrap">Attendance</span>
              </span>
              {showDropdown && (
                <ul className="pl-4 mt-2 space-y-2">
                  <li
                    className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() =>
                      navigate(
                        `/parent-dashboard/${parentDetails.parent_id}/view-weekly-attendance`
                      )
                    }
                  >
                    Weekly
                  </li>
                  <li
                    className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() =>
                      navigate(
                        `/parent-dashboard/${parentDetails.parent_id}/view-monthly-attendance`
                      )
                    }
                  >
                    Monthly
                  </li>
                </ul>
              )}
            </li>
            <li>
              <span
                className="flex items-center p-2  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => setShowparentDetails(!showParentDetails)} // Toggle details on click
              >
                <span className="flex-1  whitespace-nowrap">Profile</span>
              </span>
              {showParentDetails && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                  <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    {`${parentDetails.first_name} ${parentDetails.last_name}`}
                  </p>
                  <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    {parentDetails.email}
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {parentDetails.phone_number}
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

export default ParentSidebar;
