import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/landingPage.css";
function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 flex h-screen items-center">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              Enriching Childcare Experiences.
              <span className="sm:block"> Your Child's Home. </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              Where safety, learning, and fun come together. Join us for a
              nurturing childcare experience!
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                className=""
                onClick={() => document.getElementById("myModal").showModal()}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        <dialog
          id="myModal"
          className="h-auto w-11/12 md:w-1/2 p-5  bg-gray-900 rounded-lg "
        >
          <div className="flex flex-col w-full h-full justify-center">
            <div className="flex w-full h-auto justify-center items-center">
              <div className="absolute top-5 flex w-10/12 h-auto py-3 justify-center items-center text-2xl  bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text font-extrabold text-transparent sm:text-5xl">
                Choose Your Role
              </div>
            </div>
            <div
              onClick={() => document.getElementById("myModal").close()}
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
            <div className="flex justify-center">
              <div className="flex flex-col">
                <button className="m-8 " onClick={() => selectRole("Admin")}>
                  Admin
                </button>
                <button
                  className="m-8 "
                  onClick={() => selectRole("facility-admin")}
                >
                  Facility Admin
                </button>
                <button className="m-8 " onClick={() => selectRole("parent")}>
                  Parent
                </button>
                <button className="m-8 " onClick={() => selectRole("teacher")}>
                  Teacher
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </section>
    </div>
  );

  function selectRole(role) {
    navigate(`/login/${role}`);
    // console.log(`Selected role: ${role}`);
  }
}

export default LandingPage;
