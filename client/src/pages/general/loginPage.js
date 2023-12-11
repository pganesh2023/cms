import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ emailOrUsername: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let newErrors = { emailOrUsername: "", password: "" };

    if (!emailOrUsername) {
      newErrors.emailOrUsername = "Email/Username is required.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (newErrors.emailOrUsername || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    let loginData;
    if (role === "facility-admin" || role === "teacher" || role === "parent") {
      loginData = { email: emailOrUsername, password };
    } else {
      loginData = { username: emailOrUsername, password };
    }

    try {
      const response = await axios.post(
        "/api/auth/login",
        loginData
      );

      console.log("response data: ",response.data);

      if (response.data && response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        if (role === "Admin") {
          navigate("/admin-dashboard");
        } else if (role === "facility-admin") {
          navigate(`/facility-admin-dashboard/${response.data.facility_id}/children`);
        } else if (role === "teacher") {
          navigate(`/teacher-dashboard/${response.data.teacher_id}/children`);
        }
        else if (role === "parent") {
          navigate(`/parent-dashboard/${response.data.parent_id}/view-ledger`);
        }
      } else {
        setLoginError("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      setLoginError(
        error.response ? error.response.data.message : "Error logging in"
      );
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your {role} account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="emailOrUsername"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {role === "facility-admin" || role === "teacher"
                      ? "Email"
                      : "Username"}
                  </label>
                  <input
                    type="text"
                    name="emailOrUsername"
                    id="emailOrUsername"
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                  {errors.emailOrUsername && (
                    <p className="text-red-500 text-xs">
                      {errors.emailOrUsername}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                  {loginError && (
                    <p className="text-red-500 text-xs mt-2">{loginError}</p>
                  )}
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
