import React, { useState, useEffect } from "react";
import Sidebar from "../../components/FacilityAdminSideBar";

function Finances() {
  const [financialData, setFinancialData] = useState([]);

  useEffect(() => {
    const fetchFinancialData = async () => {
      let allFinancialData = [];

      for (let week = 1; week <= 52; week++) {
        try {
          const response = await fetch(
            `/api/facility/admin/weekly-finances?year=2023&weekNumber=${week}`
          );
          if (!response.ok) {
            throw new Error(`Network response was not ok for week ${week}`);
          }
          const data = await response.json();
          allFinancialData.push({ ...data, week });
        } catch (error) {
          console.error(
            `Error fetching financial data for week ${week}:`,
            error
          );
        }
      }

      setFinancialData(allFinancialData);
    };

    fetchFinancialData();
  }, []);

  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="flex-1 p-4 ml-64">
        <div className="flex justify-center my-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
            Finances
          </h1>
        </div>
        <div className="flex justify-center mx-64 my-16 ">
          <div className="w-full shadow-md rounded-lg h-[500px] overflow-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Week Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Money Billed
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Money Earned
                  </th>
                </tr>
              </thead>
              <tbody>
                {financialData.map((weekData, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{weekData.week}</td>
                    <td className="px-6 py-4">
                      ${weekData.billings ? weekData.billings : 0}
                    </td>
                    <td className="px-6 py-4">
                      ${weekData.earnings ? weekData.billings : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finances;
