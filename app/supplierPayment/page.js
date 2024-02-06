'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const SupplierPayment = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [supplierDetails, setSupplierDetails] = useState({});
    const [creditBalance, setCreditBalance] = useState(0);
    const [balance, setBalance] = useState(0);
    const [debitAmount, setDebitAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dateWiseRecords, setDateWiseRecords] = useState([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup

    useEffect(() => {
        axios.get('https://backdeploy.vercel.app/api/supplier/suppliers')
            .then(response => setSuppliers(response.data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        if (selectedSupplier) {
            axios.get(`https://backdeploy.vercel.app/api/supplier/suppliers/${selectedSupplier}`)
                .then(response => {
                    setSupplierDetails(response.data);
                    setCreditBalance(response.data.credit);
                    setBalance(response.data.balance);
                    setDateWiseRecords(response.data.dateWiseRecords);
                })
                .catch(error => console.error('Error:', error));
        } else {
            setSupplierDetails({});
            setCreditBalance(0);
            setBalance(0);
            setDateWiseRecords([]);
        }
    }, [selectedSupplier]);

    const handleSupplierChange = (e) => {
        setSelectedSupplier(e.target.value);
    };

    const handleDebitSubmission = (e) => {
        e.preventDefault();

        if (debitAmount <= creditBalance && !loading) {
            setLoading(true);

            const updatedBalance = balance - debitAmount;
            setBalance(updatedBalance);

            axios.put(`https://backdeploy.vercel.app/api/supplier/updateBalance/${selectedSupplier}`, {
                debit: debitAmount,
            })
                .then(response => {
                    const updatedSupplier = response.data;
                    setSupplierDetails(updatedSupplier);
                    setShowSuccessPopup(true); // Show success popup
                    // Fetch updated records
                    axios.get(`https://backdeploy.vercel.app/api/supplier/suppliers/${selectedSupplier}`)
                        .then(response => {
                            // setDateWiseRecords(response.data.dateWiseRecords);
                            setDateWiseRecords(prevRecords => [
                                ...prevRecords,
                                { debit: debitAmount, date: new Date().toISOString() }
                              ]);
                        })
                        .catch(error => console.error('Error fetching updated records:', error));
                })
                .catch(error => {
                    setBalance(balance);
                    console.error('Error submitting debit:', error);
                })
                .finally(() => {
                    setLoading(false);
                    setDebitAmount(0);
                });
        } else {
            alert('Debit amount cannot exceed credit balance or request is still processing');
        }
    };
    const formatDateTime = (dateString) => {
        const options = {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true, // Display time in 12-hour format
    
        };
    
        const dateTime = new Date(dateString);
        const formatter = new Intl.DateTimeFormat('en-GB', options);
    
        return formatter.format(dateTime);
      };
      

    return (
        <>
            <Navbar />
            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-lg text-green-600">Amount submitted successfully!</p>
                        <button
                            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                            onClick={() => setShowSuccessPopup(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* End of Success Popup */}
            <div className="max-w-5xl mx-auto bg-white p-8 shadow-md font-sans mt-11">
                <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-400 text-left">Vendor Payment</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <div className="mb-2">
                            <label htmlFor="supplierDropdown" className="block font-semibold">Select Vendor</label>
                            <select
                                id="supplierDropdown"
                                onChange={handleSupplierChange}
                                value={selectedSupplier}
                                className="p-1 border border-gray-300 rounded w-full"
                            >
                                <option value="">Select a supplier</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier._id} value={supplier._id}>
                                        {supplier.vendorName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="addressInput" className="block font-semibold">Address:</label>
                            <input
                                type="text"
                                id="addressInput"
                                value={supplierDetails.address || ''}
                                readOnly
                                className="p-1 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="contactNumberInput" className="block font-semibold">Contact Number:</label>
                            <input
                                type="text"
                                id="contactNumberInput"
                                value={supplierDetails.contactNumber || ''}
                                readOnly
                                className="p-1 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="emailIdInput" className="block font-semibold">Email ID:</label>
                            <input
                                type="text"
                                id="emailIdInput"
                                value={supplierDetails.emailId || ''}
                                readOnly
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="gstNumberInput" className="block font-semibold">GST Number:</label>
                            <input
                                type="text"
                                id="gstNumberInput"
                                value={supplierDetails.gstNumber || ''}
                                readOnly
                                className="p-1 border border-gray-300 rounded w-full"
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="debitAmount" className="block font-semibold">Enter Debit Amount:</label>
                            <input
                                type="number"
                                id="debitAmount"
                                value={debitAmount}
                                onChange={(e) => setDebitAmount(e.target.value)}
                                className="p-1 border border-gray-300 rounded w-full"
                            />
                        </div>

                        <form className="mt-4 flex justify-between" onSubmit={handleDebitSubmission}>
                            <button
                                type="submit"
                                className="bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                    <div className="w-md bg-gray-100 p-4 rounded ml-8 h-min mt-20 ">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-400 text-left mb-3">Totals</h2>
                        <div>
                            <label htmlFor="creditInput" className="block font-semibold">Credit:</label>
                            <input
                                type="number"
                                id="creditInput"
                                value={supplierDetails.credit || ''}
                                readOnly
                                className="p-1 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="debitInput" className="block font-semibold">Debit:</label>
                            <input
                                type="number"
                                id="debitInput"
                                value={supplierDetails.debit || ''}
                                readOnly
                                className="p-1 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="balanceInput" className="block font-semibold">Balance:</label>
                            <input
                                type="number"
                                id="balanceInput"
                                value={balance}
                                readOnly
                                className="p-1 border border-gray-300 rounded w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="custom-scrollbars overflow-auto max-h-full">
                    <table className=" min-w-full mt-4">
                    <thead className="text-sm bg-zinc-100 text-yellow-600 border">
                            <tr>
                                <th className="p-3 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Payment Date</th>
                                <th className="p-3 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Vendor Name</th>
                                <th className="p-3 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Debit Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dateWiseRecords.map(record => (
                                <tr key={record._id}>
                                    <td className='p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4'>{formatDateTime (record.date)}</td>
                                    <td className='p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4'>{supplierDetails.vendorName}</td>
                                    <td className='p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4'>{record.debit}.00</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default SupplierPayment;