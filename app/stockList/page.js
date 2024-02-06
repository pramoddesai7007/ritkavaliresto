'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const StockOutwardTable = () => {
  const [stockOutwardList, setStockOutwardList] = useState([]);
  const [stockReports, setStockReports] = useState([]);
  const [startDate, setStartDate] = useState(getFormattedDate(new Date())); // Default to today's date
  const [endDate, setEndDate] = useState(getFormattedDate(new Date())); // Default to today's date
  const [searchTerm, setSearchTerm] = useState('');
  const [itemList, setItemList] = useState([]);

  const fetchStockOutwardList = async (start, end) => {
    try {
      const response = await axios.get('https://backdeploy.vercel.app/api/stockOut/stockOut', {
        params: {
          startDate: start,
          endDate: end,
        },
      });
      console.log(response.data)
      setStockOutwardList(response.data);
    } catch (error) {
      console.error('Error fetching stock outward list:', error.response ? error.response.data : error.message);
    }
  };

  const fetchStockReports = async () => {
    try {
      const formattedStartDate = getFormattedDate(new Date(startDate));
      const formattedEndDate = getFormattedDate(new Date(endDate));

      const response = await axios.get('https://backdeploy.vercel.app/api/stockOut/stockOut', {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });

      setStockReports(response.data);
    } catch (error) {
      console.error('Error fetching stock reports:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchStockOutwardList(startDate, endDate);
    fetchStockReports();
  }, [startDate, endDate]); // Update when the dates change

  const filteredStockOutwardList = stockOutwardList.filter((entry) =>
    entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.waiterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleSearch = () => {
  //   // Call the fetch functions with the selected date range
  //   fetchStockOutwardList(startDate, endDate);
  //   fetchStockReports();
  // };
  // const handleSearchButtonClick = () => {
  //   fetchStockOutwardList(startDate, endDate);
  //   fetchStockReports();
  //   console.log("Performing search for:", searchTerm);
  //   // Add your search functionality here
  // };

  const exportToExcel = () => {
    const filteredData = filteredStockOutwardList.map((entry, index) => {
      const stockReport = stockReports.find(
        (report) =>
          report.waiterName === entry.waiterName && report.productName === entry.productName
      );

      const formattedEntryDate = getFormattedDate(new Date(entry.date));
      const isDateInRange = formattedEntryDate >= startDate && formattedEntryDate <= endDate;

      if (isDateInRange) {
        const remainingStock = stockReport
          ? stockReport.stockQty - entry.stockQty
          : '-';
        const totalStock = stockReport ? stockReport.stockQty : '-';

        return {
          'SR No.': index + 1,
          'Waiter Name': entry.waiterName,
          'Product Name': entry.productName,
          'Available Stock': entry.availableQuantity,
          'Stock Taken': entry.stockQty,
          'Remaining Stock': entry.availableQuantity - entry.stockQty,

          Date: new Date(entry.date).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          }),
        };
      }

      return null;
    }).filter(Boolean); // Remove null or undefined entries

    const ws = XLSX.utils.json_to_sheet(filteredData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'StockData');

    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });

    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(data, 'StockData.xlsx');
  };
  const fetchItems = async () => {
    try {
      const response = await axios.get('https://backdeploy.vercel.app/api/item/items');
      setItemList(response.data);
    } catch (error) {
      console.error('Error fetching items:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []); // Run once on component mount
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-6 p-8 bg-white rounded-md shadow-md font-sans">
        <div className="w-2/3">
          {/* Stock Outward Table */}
          <h1 className="text-xl font-bold mb-3">Stock Outward</h1>

          {/* Start and end date inputs */}
          <div className="flex justify-between items-center mb-4">
            <div className="mr-2">
              <label className="block text-sm font-medium text-gray-600">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 p-1 w-full border rounded-md text-sm"
              />
            </div>
            <div className="mr-2">
              <label className="block text-sm font-medium text-gray-600">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 p-1 w-full border rounded-md text-sm"
              />
            </div>
            <div className="mr-2">
            </div>
            <button
              className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
          <div className="flex">
            <div className=" mx-auto justify-center">
              <table id="stock-outward-table" className=" border-collapse border border-gray-300 min-w-1/2  divide-y divide-gray-200">
                <thead className="text-base bg-zinc-100 text-yellow-700 border">
                  <tr>
                    <th className="p-2 border whitespace-nowrap">SR No.</th>
                    <th className="p-2 border whitespace-nowrap">Waiter Name</th>
                    <th className="p-2 border whitespace-nowrap">Product Name</th>
                    <th className="p-2 border whitespace-nowrap">Available Stock</th>
                    <th className="p-2 border whitespace-nowrap">Stock Taken</th>
                    <th className="p-2 border whitespace-nowrap">Remaining Stock</th>
                    <th className="p-2 border whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStockOutwardList.map((entry, index) => {
                    const stockReport = stockReports.find(
                      (report) =>
                        report.waiterName === entry.waiterName && report.productName === entry.productName
                    );

                    const formattedEntryDate = getFormattedDate(new Date(entry.date));
                    const isDateInRange = formattedEntryDate >= startDate && formattedEntryDate <= endDate;

                    if (isDateInRange) {
                      const remainingStock = stockReport
                        ? stockReport.stockQty - entry.stockQty
                        : '-';

                      return (
                        <tr key={index}>
                          <td className="p-1 border text-center">{index + 1}</td>
                          <td className="p-1 border text-center">{entry.waiterName}</td>
                          <td className="p-1 border text-center">{entry.productName}</td>
                          <td className="p-1 border text-center">{entry.availableQuantity}</td>
                          <td className="p-1 border text-center">{entry.stockQty}</td>
                          <td className="p-1 border text-center">{entry.availableQuantity - entry.stockQty}</td>
                          <td className="p-1 border text-center">
                            {new Date(entry.date).toLocaleString('en-GB', {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric',
                              hour12: true,
                            })}
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            </div>

            {/* <h1 className="text-xl font-bold mb-3">Item Table</h1> */}
            <div className="pl-10 mt-2">
              {/* Item List Table */}
              <table className="border-collapse border border-gray-300 min-w-md divide-y divide-gray-200">
                <thead className="text-base bg-zinc-100 text-yellow-700 border">
                  <tr>
                    <th className="p-2 border whitespace-nowrap">Item Name</th>
                    <th className="p-2 border whitespace-nowrap">Total Stock Quantity</th> {/* New Column */}
                  </tr>
                </thead>
                <tbody>
                  {itemList.map((item) => (
                    <tr key={item.itemId}>
                      <td className="p-1 border text-center">{item.itemName}</td>
                      <td className="p-1 border text-center">{item.stockQty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default StockOutwardTable;

function getFormattedDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}