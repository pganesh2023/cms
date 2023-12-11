import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function FacilityDashboard() {
  const { facilityId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [facilityData, setFacilityData] = useState(null);

  useEffect(() => {
    // Fetch facility details based on facilityId from the API
    fetch(`/api/facilities/${facilityId}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("Received data from API:", data); // Log the data received
        setFacilityData(data);
      })
      .catch((error) => {
        console.error("Error fetching facility data:", error);
      });
  }, [facilityId]);

  const handleAddAdmin = () => {
    navigate(`/facility-dashboard/${facilityId}/add-admin`); 
  };

  // Rendering facility data
  if (!facilityData) {
    // Loading state while fetching data
    return <div>Loading...</div>;
  }

  // Render the facility details here

  if (!facilityData) {
    // Loading state while fetching data
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Facility Dashboard</h2>
      <h3>Facility Details</h3>
      <p>Facility ID: {facilityData.facility_id}</p>
      <p>Name: {facilityData.name}</p>
      <p>Address: {facilityData.address}</p>
      <p>Phone Number: {facilityData.phone_number}</p>
      <p>License Number: {facilityData.license_number}</p>
      <button onClick={handleAddAdmin}>Add Admin</button> 

    </div>
  );
}

export default FacilityDashboard;
