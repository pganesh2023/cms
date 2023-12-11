import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ParentSidebar from "../../components/ParentSidebar";

function ChildLedger() {
  const { parentId } = useParams();
  //   const navigate = useNavigate();

  //   console.log("parentId: ",parentId);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [childName, setChildName] = useState("");
  //   console.log("ledgerEntries: ", ledgerEntries);

  useEffect(() => {
    // Fetch ledger data from the backend
    fetch(`/api/ledger/${parentId}`)
      .then((response) => response.json())
      .then((data) => setLedgerEntries(data))
      .catch((error) => console.error("Error fetching ledger data:", error));

    fetch(`/api/children/name/${parentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const { first_name, last_name } = data;
        setChildName(`${first_name} ${last_name}`);
      })
      .catch((error) => {
        console.error("Error fetching child name:", error);
      });
  }, [parentId]);

  return (
    <div className="flex">
      <ParentSidebar></ParentSidebar>
      <div className="flex-1 ml-64 p-4">
        <div className="flex justify-center my-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
            Ledger for {childName}
          </h2>
        </div>
        {/* <h2>ChildLedger for Child ID: {parentId}</h2> */}
        <div className="flex justify-center mx-64 my-16">
          <div className="w-full shadow-md rounded-lg h-[500px] overflow-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Week Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount Charged
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.map((entry, index) => {
                  // console.log(entry);
                  const amount = parseFloat(entry.amount);
                  const formattedAmount = isNaN(amount)
                    ? "Invalid"
                    : amount.toFixed(2);
                  return (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      key={index}
                    >
                      <td className="px-6 py-4">{entry.week_number}</td>
                      <td className="px-6 py-4">${formattedAmount}</td>
                      <td className="px-6 py-4">{entry.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildLedger;
