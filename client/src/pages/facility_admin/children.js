import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Sidebar from "../../components/FacilityAdminSideBar";

function Children() {
  const location = useLocation();
  const { facilityId } = useParams();
  const [children, setChildren] = useState([]);

  const [totalChildren, setTotalChildren] = useState(0);

  const [childDetails, setChildDetails] = useState({
    child_id: "",
    facility_id: facilityId,
    first_name: "",
    last_name: "",
    DOB: "",
    child_type: "",
    allergies: "",
  });

  const [parentDetails, setParentDetails] = useState({
    parent_id: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address: "",
    password: "",
  });

  const handleInputChange = (e, setStateFunc) => {
    const { name, value } = e.target;
    setStateFunc((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const classroomResponse = await fetch(`/api/classroom/capacity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childDetails),
      });

      if (!classroomResponse.ok) {
        const errorResult = await classroomResponse.json();
        throw new Error(
          errorResult.message || "Error checking classroom capacity"
        );
      }

      let response = await fetch("/api/parents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parentDetails),
      });

      if (!response.ok) {
        throw new Error("Error creating parent");
      }

      const parent_id = parentDetails.parent_id;

      const childDataWithParentId = {
        ...childDetails,
        parent_id: parent_id,
      };

      let childResponse = await fetch("/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childDataWithParentId),
      });

      if (!childResponse.ok) {
        throw new Error("Error creating child");
      }

      alert("Child and Parent details saved successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        alert(`Error creating child: ${error.response.data.message}`);
      } else {
        alert(error.message);
      }
    }
  };

  const fetchParentName = async (parentId) => {
    try {
      const response = await fetch(`/api/parents/${parentId}`);
      const data = await response.json();
      return `${data.first_name} ${data.last_name}`;
    } catch (error) {
      console.error("Error fetching parent name:", error);
      return "Unknown";
    }
  };

  useEffect(() => {
    fetch(`/api/children/${childDetails.facility_id}`)
      .then((response) => response.json())
      .then(async (childrenArray) => {
        const updatedChildrenArray = [];
        for (const child of childrenArray) {
          const parentName = await fetchParentName(child.parent_id);
          updatedChildrenArray.push({ ...child, parentName });
        }
        setChildren(updatedChildrenArray);
      })
      .catch((error) => console.error("Error fetching children:", error));

    fetch(`/api/children/count`)
      .then((response) => response.json())
      .then((totalCount) => {
        setTotalChildren(totalCount);
      })
      .catch((error) =>
        console.error("Error fetching total children count:", error)
      );
  }, [childDetails.facility_id]);

  const deleteChild = (childId) => {
    if (window.confirm("Are you sure you want to delete this child?")) {
      fetch(`/api/${childId}/delete`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Update UI or navigate
            window.location.reload();
          } else {
            console.error("Error deleting child");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="flex-1 p-4 ml-64">
        <div className="flex justify-center my-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
            Children
          </h1>
        </div>
        <div className="flex justify-end mx-10">
          <button
            onClick={() => document.getElementById("myModal").showModal()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-2xl right-16"
          >
            +
          </button>
        </div>
        <div className="flex justify-center mx-64 my-16 ">
          <div className="w-full shadow-md rounded-lg h-[500px] overflow-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Facility ID
                  </th>
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
                    Child Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Parent
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Ledger
                  </th>
                </tr>
              </thead>
              <tbody>
                {children.map((child) => {
                  const date = new Date(child.DOB);
                  const formattedDate = date.toLocaleDateString();
                  // console.log("child:", child);
                  return (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      key={child.child_id}
                    >
                      <td className="px-6 py-4">{child.facility_id}</td>
                      <td className="px-6 py-4">{child.child_id}</td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {child.first_name} {child.last_name}
                      </th>
                      <td className="px-6 py-4">{formattedDate}</td>
                      <td className="px-6 py-4">{child.child_type}</td>
                      <td className="px-6 py-4">{child.parentName}</td>
                      <td>
                        <Link
                          to={`${location.pathname}/ledger/${child.child_id}`}
                          className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded"
                        >
                          VIEW LEDGER
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteChild(child.child_id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <dialog id="myModal">
          <form
            onSubmit={handleSubmit}
            className="h-auto bg-gray-900 p-6 flex items-center justify-center text-white"
          >
            <div className="container max-w-screen-lg mx-auto">
              <div className="bg-gray-900 rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                  <div className="lg:col-span-5">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-5">
                        <h2 className="text-lg mb-2">
                          Total Number of Children accros all facilities:{" "}
                          {totalChildren}
                        </h2>
                      </div>
                      <div className="md:col-span-5">
                        <h2 className="text-lg font-bold mb-2">
                          Child Details
                        </h2>
                      </div>
                      <div className="md:col-span-1">
                        <label htmlFor="child_id">Child ID</label>
                        <input
                          type="text"
                          name="child_id"
                          id="child_id"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={childDetails.child_id}
                          onChange={(e) =>
                            handleInputChange(e, setChildDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="first_name">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={childDetails.first_name}
                          onChange={(e) =>
                            handleInputChange(e, setChildDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={childDetails.last_name}
                          onChange={(e) =>
                            handleInputChange(e, setChildDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="DOB">Date of Birth</label>
                        <input
                          type="date"
                          name="DOB"
                          id="DOB"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={childDetails.DOB}
                          onChange={(e) =>
                            handleInputChange(e, setChildDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="child_type">Child Type</label>
                        <select
                          name="child_type"
                          id="child_type"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={childDetails.child_type}
                          onChange={(e) =>
                            handleInputChange(e, setChildDetails)
                          }
                        >
                          <option value="">Select Type</option>
                          <option value="Infant">Infant</option>
                          <option value="Toddler">Toddler</option>
                          <option value="Twaddler">Twaddler</option>
                          <option value="3 Years Old">3 Years Old</option>
                          <option value="4 Years Old">4 Years Old</option>
                        </select>
                      </div>
                      <div className="md:col-span-5">
                        <label htmlFor="allergies">Allergies (if any)</label>
                        <textarea
                          name="allergies"
                          id="allergies"
                          rows="3"
                          className="h-24 border mt-1 rounded px-4 w-full text-black"
                          value={childDetails.allergies}
                          onChange={(e) =>
                            handleInputChange(e, setChildDetails)
                          }
                        ></textarea>
                      </div>
                      <hr className="my-4 border-t border-gray-200 dark:border-gray-600" />
                      <div className="md:col-span-5">
                        <h2 className="text-lg font-bold mb-2">
                          Parent Details
                        </h2>
                      </div>
                      <div className="md:col-span-1">
                        <label htmlFor="parent_id">Parent ID</label>
                        <input
                          type="text"
                          name="parent_id"
                          id="parent_id"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={parentDetails.parent_id}
                          onChange={(e) =>
                            handleInputChange(e, setParentDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="first_name">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={parentDetails.first_name}
                          onChange={(e) =>
                            handleInputChange(e, setParentDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={parentDetails.last_name}
                          onChange={(e) =>
                            handleInputChange(e, setParentDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label htmlFor="phno">Phone Number</label>
                        <input
                          type="tel"
                          name="phone_number"
                          id="phno"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={parentDetails.phone_number}
                          onChange={(e) =>
                            handleInputChange(e, setParentDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label htmlFor="email">Email</label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={parentDetails.email}
                          onChange={(e) =>
                            handleInputChange(e, setParentDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label htmlFor="password">Password</label>
                        <input
                          type="text"
                          name="password"
                          id="password"
                          className="h-10 border mt-1 rounded px-4 w-full text-black"
                          value={parentDetails.password}
                          onChange={(e) =>
                            handleInputChange(e, setParentDetails)
                          }
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label htmlFor="address">Address</label>
                        <textarea
                          name="address"
                          id="address"
                          rows="3"
                          className="h-24 border mt-1 rounded px-4 w-full text-black"
                          value={parentDetails.address}
                          onChange={(e) =>
                            handleInputChange(e, setParentDetails)
                          }
                        ></textarea>
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
      </div>
    </div>
  );
}

export default Children;
