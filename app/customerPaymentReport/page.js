"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
const CustomerPaymentReport = () => {
  const [customers, setCustomers] = useState([]);
  const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in "YYYY-MM-DD" format
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);

  const fetchDatewiseRecords = async () => {
    try {
      const response = await axios.get(
        `https://backdeploy.vercel.app/api/customer/datewiseRecords?startDate=${startDate}&endDate=${endDate}`
      );
      console.log(response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching date-wise records:", error);
    }
  };
  const exportToExcel = () => {
    // Define the sheet data
    const sheetData = customers.map((customer, index) => [
      index + 1,
      customer.dateWiseRecords.length > 0
        ? new Date(customer.dateWiseRecords[0].date).toLocaleDateString("en-GB")
        : "",
      customer.customerName,
      customer.mobileNumber,
      customer.creditBalance,
      customer.debit,
      customer.balance,
      // Add additional columns as needed
    ]);

    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Sr",
        "Date",
        "Name",
        "Mobile Number",
        "Credit Balance",
        "Debit Balance",
        "Balance",
      ],
      ...sheetData,
    ]);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Data");

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, "customer_data.xlsx");
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchDatewiseRecords();
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://backdeploy.vercel.app/api/customer/customers"
      );
      console.log(response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <Navbar />
      <div className=" mt-20">
        <h1>Customer Payment Report</h1>

        {/* Date Input Fields */}
        <div className="flex space-x-4 my-4">
          <div>
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
            />
            <button
              className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
        </div>

        {/* Customer Table */}
        <table className="border-collapse border border-gray-300 min-w-full   divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="border p-2">Sr</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Mobile Number</th>
              <th className="border p-2">Credit Balance</th>
              <th className="border p-2">Debit Balance</th>
              <th className="border p-2">Balance</th>
              {/* Add additional columns as needed */}
            </tr>
          </thead>

          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer._id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {customer.dateWiseRecords.length > 0
                    ? new Date(
                        customer.dateWiseRecords[0].date
                      ).toLocaleDateString("en-GB")
                    : ""}
                </td>
                <td className="border p-2">
                  {customer.dateWiseRecords.length > 0 && (
                    <tr key={`${customer._id}-debit-details`}>
                      <td colSpan="8">
                        <table className="border-collapse border border-gray-300 min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="border p-2">Date</th>
                              <th className="border p-2">Time</th>
                              <th className="border p-2">Debit Amount</th>
                            </tr>
                          </thead>
                          
                          <tbody>
                            {customer.dateWiseRecords.map(
                              (record, recordIndex) => (
                                <tr
                                  key={`${customer._id}-debit-details-${recordIndex}`}
                                >
                                  <td className="border p-2">
                                    {new Date(record.date).toLocaleDateString(
                                      "en-GB"
                                    )}
                                  </td>
                                  <td className="border p-2">
                                    {new Date(record.date).toLocaleTimeString(
                                      "en-US",
                                      {
                                        hour: "numeric",
                                        minute: "numeric",
                                        second: "numeric",
                                      }
                                    )}
                                  </td>
                                  <td className="border p-2">{record.debit}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </td>

                <td className="border p-2">{customer.customerName}</td>
                <td className="border p-2">{customer.mobileNumber}</td>
                {/* Display the date from the first dateWiseRecord, you might want to modify this logic based on your use case */}
                <td className="border p-2">{customer.creditBalance}</td>
                <td className="border p-2">{customer.debit}</td>

                <td className="border p-2">{customer.balance} </td>
                {/* Add additional columns as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomerPaymentReport;