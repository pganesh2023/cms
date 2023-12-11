import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [facilityId, setFacilityId] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [adminDetails, setAdminDetails] = useState({
    admin_id: "",
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    password: "",
  });

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const openAdminModal = (id) => {
    setFacilityId(id);
    document.getElementById("myModal1").showModal();
  };

  const createAndAssignAdmin = (e) => {
    e.preventDefault();
    // First create the admin
    fetch("/api/facilities/admins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminDetails),
    })
      .then((response) => response.json())
      .then((data) => {
        // Now assign the newly created admin to the current facility
        return fetch(`/api/facilities/${facilityId}/admin`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ admin_id: data.adminId }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        // navigate(`/facility-dashboard/${facilityId}`);
        // Handle success, maybe show a success message or update UI
        // console.log(data.message);
        window.location.reload(); // Reload the window here
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    fetch("/api/facilities")
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch((error) => console.error("Error fetching facilities:", error));
  }, []);

  const goToFacilityDashboard = (facilityId) => {
    navigate(`/facility-dashboard/${facilityId}`);
  };

  // const goToFacilityAddAdmin = (facilityId) => {
  //   navigate(`/facility-dashboard/${facilityId}/add-admin`);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const facilityData = {
      facility_id: facilityId,
      name: facilityName,
      address: address,
      phone_number: phoneNumber,
      license_number: licenseNumber,
    };

    try {
      const response = await fetch("/api/facilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facilityData),
      });

      if (response.ok) {
        // navigate(`/facility-dashboard/${facilityId}`);

        // console.log("Facility created successfully");
        window.location.reload(); // Reload the window here
      } else {
        console.error("Error creating facility:", await response.text());
      }
    } catch (error) {
      console.error("Network or server error:", error);
    }
  };

  const deleteFacility = (facilityId) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      fetch(`/api/facilities/${facilityId}/delete`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Update UI or navigate
            window.location.reload();
          } else {
            console.error("Error deleting facility");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <button onClick={handleLogout} className="absolute right-4 top-4">
        Logout
      </button>

      <div className="flex justify-center my-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
          Admin Dashboard
        </h1>
      </div>
      <div className="flex justify-end my-2">
        <button onClick={() => document.getElementById("myModal").showModal()}>
          Create Facility
        </button>
      </div>
      <dialog id="myModal">
        <form
          onSubmit={handleSubmit}
          className="h-auto bg-gray-900 p-6 flex items-center justify-center text-white"
        >
          <div className="container max-w-screen-lg mx-auto">
            <div className="bg-gray-900 rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div>
                  <p className="font-medium text-lg">Facility Details</p>
                  <p>Please fill out all the fields.</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-1">
                      <label htmlFor="facility_ID">Facility ID</label>
                      <input
                        type="text"
                        name="facility_ID"
                        id="facility_ID"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={facilityId}
                        onChange={(e) => setFacilityId(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label htmlFor="facility_name">Facility Name</label>
                      <input
                        type="text"
                        name="facility_name"
                        id="facility_name"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={facilityName}
                        onChange={(e) => setFacilityName(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="license_number">License Number</label>
                      <input
                        type="text"
                        name="lic_number"
                        id="lic_number"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={address}
                        placeholder=""
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="phno">Phone Number</label>
                      <input
                        type="tel"
                        name="phno"
                        id="phno"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={phoneNumber}
                        placeholder=""
                        onChange={(e) => setPhoneNumber(e.target.value)}
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
      <div className="flex justify-center m-10">
        <div className="w-full shadow-md rounded-lg h-[500px] overflow-auto">
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Facility ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Facility name
                </th>
                <th scope="col" className="px-6 py-3">
                  Facility Admin
                </th>
                <th scope="col" className="px-6 py-3">
                  License Number
                </th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={facility.facility_id}
                >
                  <td className="px-6 py-4">{facility.facility_id}</td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {facility.name}
                  </th>
                  <td className="px-6 py-4">
                    {facility.admin_id ? (
                      `${facility.first_name} ${facility.last_name}`
                    ) : (
                      <button
                        onClick={() => openAdminModal(facility.facility_id)}
                      >
                        ADD ADMIN
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">{facility.license_number}</td>
                  <td>
                    <button
                      onClick={() => deleteFacility(facility.facility_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <dialog id="myModal1">
        <form
          onSubmit={createAndAssignAdmin}
          className="h-auto bg-gray-900 p-6 flex items-center justify-center text-white"
        >
          <div className="container max-w-screen-lg mx-auto">
            <div className="bg-gray-900 rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div>
                  <p className="font-medium text-lg">Admin Details</p>
                  <p>Please fill out all the fields.</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-1">
                      <label htmlFor="admin_id">Admin ID</label>
                      <input
                        type="text"
                        name="admin_id"
                        id="admin_id"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={adminDetails.admin_id}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="admin_first_name">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        id="admin_first_name"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={adminDetails.first_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="admin_last_name">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        id="admin_last_name"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={adminDetails.last_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="email">email</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={adminDetails.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="phno">Phone Number</label>
                      <input
                        type="tel"
                        name="contact_number"
                        id="phno"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={adminDetails.contact_number}
                        placeholder=""
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="password">Password</label>
                      <input
                        type="tel"
                        name="password"
                        id="pwd"
                        className="h-10 border mt-1 rounded px-4 w-full text-black"
                        value={adminDetails.password}
                        placeholder=""
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          type="submit"
                          className="mt-8"
                          onClick={() =>
                            document.getElementById("myModal1").close()
                          }
                        >
                          Submit
                        </button>
                        <div
                          onClick={() =>
                            document.getElementById("myModal1").close()
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
    </div>
  );
}

export default AdminDashboard;
