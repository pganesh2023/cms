import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const decodedToken = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    // Check if the current route is /admin-dashboard and the role is not system-admin
    if (
      location.pathname === "/admin-dashboard" &&
      decodedToken.role !== "Admin"
    ) {
      navigate("/access-denied"); // Navigate to an "access denied" or some other page
      return;
    }
  }, [token, navigate, location, decodedToken]);

  if (!token) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
