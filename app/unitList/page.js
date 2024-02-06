// 'use client'
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UnitList = () => {
//   const [units, setUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedUnit, setSelectedUnit] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [newUnit, setNewUnit] = useState('');
//   const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

//   useEffect(() => {
//     const fetchUnits = async () => {
//       try {
//         const response = await axios.get('https://backdeploy.vercel.app/api/unit/units');
//         setUnits(response.data);
//       } catch (error) {
//         console.error('Error fetching units:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    

//     fetchUnits();
//   }, []);

//   const handleEditClick = (unit) => {
//     setSelectedUnit(unit);
//     setIsEditModalOpen(true);
//   };

//   const handleDeleteClick = (unit) => {
//     setSelectedUnit(unit);
//     setIsDeleteModalOpen(true);
//   };

//   const handleEditSubmit = async (e, updatedUnit) => {
//     e.preventDefault();
  
//     try {
//       // Make an API request using Axios to update the unit
//       await axios.patch(`https://backdeploy.vercel.app/api/unit/units/${selectedUnit._id}`, {
//         unit: updatedUnit.unit, // Use 'unit' instead of 'updatedUnit.units'
//       });
  
//       // Update the local state after a successful edit
//       setUnits((prevUnits) =>
//         prevUnits.map((unit) => (unit._id === selectedUnit._id ? updatedUnit : unit))
//       );
//     } catch (error) {
//       console.error('Error updating unit:', error);
//     } finally {
//       setIsEditModalOpen(false);
//     }
//   };

//   const handleDeleteSubmit = async () => {
//     try {
//       await axios.delete(`https://backdeploy.vercel.app/api/unit/units/${selectedUnit._id}`);
//       // Remove the deleted unit from the local state
//       setUnits((prevUnits) => prevUnits.filter((unit) => unit._id !== selectedUnit._id));
//     } catch (error) {
//       console.error('Error deleting unit:', error);
//     } finally {
//       setIsDeleteModalOpen(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Make an API request using Axios to post the new unit
//       await axios.post('https://backdeploy.vercel.app/api/unit/units', { unit: newUnit });

//       // Fetch the updated list of units
//       const response = await axios.get('https://backdeploy.vercel.app/api/unit/units');
//       setUnits(response.data);

//       // Reset the new unit input field
//       setNewUnit('');

//       // Open the success popup
//       setIsSuccessPopupOpen(true);

//       // Close the success popup after a few seconds (e.g., 3 seconds)
//       setTimeout(() => {
//         setIsSuccessPopupOpen(false);
//       }, 3000);
//     } catch (error) {
//       console.error('Error submitting form:', error.message);
//       // Handle the error as needed
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto bg-white p-4 rounded-lg shadow-md mt-20">
//       <form onSubmit={handleSubmit} className="mb-4">
//         <div className="mb-4">
//           <label htmlFor="newUnit" className="block text-sm font-medium text-gray-600">
//             Add Unit:
//           </label>
//           <input
//             type="text"
//             id="newUnit"
//             name="newUnit"
//             value={newUnit}
//             onChange={(e) => setNewUnit(e.target.value)}
//             className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
//           />
//         </div>

//         <div className="col-span-2 flex justify-center mt-1">
//           <button
//             type="submit"
//             className="bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-12 rounded-full"
//           >
//             Add Unit
//           </button>
//         </div>
//       </form>

//       {isSuccessPopupOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {/* Modal Overlay */}
//           <div className="fixed inset-0 bg-black opacity-50"></div>

//           {/* Modal Content */}
//           <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
//             <h2 className="text-2xl font-bold mb-4">Unit Added Successfully!</h2>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="overflow-auto max-h-full ">
//           <table className="min-w-full border border-gray-300">
//             <thead className="text-sm bg-gray-300 text-gray-700">
//               <tr>
//                 <th className="p-1 border whitespace-nowrap">Unit</th>
//                 <th className="p-1 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="text-md font-sans font-semibold ">
//               {units.map((unit) => (
//                 <tr key={unit._id} className="hover:bg-gray-100">
//                   <td className="pl-4 border text-left text-gray pr-4">{unit.unit}</td>
//                   <td className="pl-2 border text-left text-gray flex items-center space-x-3">
//                     <button
//                       className="text-gray mr-3 hover:bg-gray-300 font-sans focus:outline-none font-medium border border-gray-400 p-1 rounded-full px-4 text-sm flex mb-1 mt-1"
//                       onClick={() => handleEditClick(unit)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="text-gray mr-3 hover:bg-gray-300 font-sans focus:outline-none font-medium border border-gray-400 p-1 rounded-full px-2 text-sm flex mb-1 mt-1"
//                       onClick={() => handleDeleteClick(unit)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {/* Modal Overlay */}
//           <div className="fixed inset-0 bg-black opacity-50"></div>

//           {/* Modal Content */}
//           <div className="relative z-50 bg-white p-6 rounded-md shadow-lg w-96">
//             <span
//               className="absolute top-0 right-0 p-4 cursor-pointer text-3xl"
//               onClick={() => setIsEditModalOpen(false)}
//             >
//               &times;
//             </span>

//             <h2 className="text-2xl font-bold mb-4">Edit Unit</h2>

//             {/* Edit Form */}
//             <form onSubmit={(e) => handleEditSubmit(e, selectedUnit)} className="mb-4">
//               {/* units */}
//               <div className="mb-1">
//                 <label htmlFor="editUnit" className="block text-sm font-medium text-gray-600">
//                   units:
//                 </label>
//                 <input
//                   type="text"
//                   id="editUnit"
//                   name="editUnit"
//                   value={selectedUnit.unit}
//                   onChange={(e) => setSelectedUnit({ ...selectedUnit, unit: e.target.value })}
//                   className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
//                 />
//               </div>

//               {/* Save Button */}
//               <div className="flex justify-center mt-1">
//     <button
//       type="submit"
//       className="bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-12 rounded-full"
//     >
//       Save
//     </button>
//   </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {/* Modal Overlay */}
//           <div className="fixed inset-0 bg-black opacity-50"></div>

//           {/* Modal Content */}
//           <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
//             <span
//               className="absolute top-0 right-0 p-4 cursor-pointer text-3xl"
//               onClick={() => setIsDeleteModalOpen(false)}
//             >
//               &times;
//             </span>

//             <h2 className="text-2xl font-bold mb-4">Delete Unit</h2>
//             <p className="text-gray-700 mb-4">Are you sure you want to delete this unit?</p>

//             {/* Delete Button */}
//             <button
//               onClick={handleDeleteSubmit}
//               className="border border-gray-400 hover:bg-red-500 text-gray font-bold py-2 px-4 rounded-full mr-2"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UnitList


'use client'
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { faEye, faEyeSlash, faUser, fawhatsapp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  const router = useRouter()
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://backdeploy.vercel.app/api/auth/login', { username, password });
      // Handle successful login, save token to localStorage, redirect, etc.
      console.log(response.data);
      const token = response.data.token;

      localStorage.setItem('authToken', token);
      setMessage('Login successful');
      router.push('/dashboard')

      // Open the success popup
      setIsSuccessPopupOpen(true);

      // Close the success popup after a few seconds (e.g., 3 seconds)
      setTimeout(() => {
        setIsSuccessPopupOpen(false);
      }, 6000);
    } catch (error) {
      setMessage('Authentication failed');
    }
  };

  return (
    <div className="" >
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div className="hidden lg:block lg:w-1/2 bg-cover text-center">
          {/* Add your logo here */}
          <div className='flex items-center ml-8 mb-2 mt-2'>
            <Image src='/ab.png' alt='logo' height={60} width={60} style={{ display: 'block' }} />
          </div>
          <div className=''>
            <Image src='/myhotel.png' alt='logo' height={1200} width={1200} /></div>
          <div>
            <span>Branches: Pune | Satara | Kolhapur | Mumbai </span></div>
          <div>
            <footer className="text-center text-black-500 text-xs md:text-sm mb-4">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className='flex' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512" style={{ marginRight: '14px' }}>
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6" fill="green" stroke="green" strokeWidth="20" />
                  </svg>
                  <span className='mr-2'>Contact Us: 8888732973 / 9699810037</span>
                </div>
              </div>
            </footer>
          </div>
        </div>

        <div className="w-full p-3 lg:w-96 border-solid mt-16">
          <div className='bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 p-4 rounded'>
            <p className="text-2xl  text-white text-center font-bold">Welcome !</p>
            <div className="mt-4 relative">
              <label className="block text-white text-sm md:text-base font-semibold mb-2">Username</label>
              <input
                className="text-gray-300 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 px-4 block w-full appearance-none pl-10 text-sm md:text-base"
                type="text"
                value={username}
                placeholder='Enter Username'
                onChange={(e) => setUsername(e.target.value)}

              />
              <div className="absolute inset-y-0 left-1 flex items-center pr-4 mt-8">
                <FontAwesomeIcon icon={faUser} className="text-gray-500 cursor-pointer"
                />

              </div>
            </div>

            <div className="mt-4 relative">
              <label className="block text-white text-sm md:text-base font-semibold mb-2">Password</label>
              <input
                className="text-gray-300 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 px-4 block w-full appearance-none pl-10 text-sm md:text-base"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder='Enter Password'
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 left-1 flex items-center pr-4 mt-8">
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className="text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              {isSuccessPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  {/* Modal Overlay */}
                  <div className="fixed inset-0 bg-black opacity-50"></div>

                  {/* Modal Content */}
                  <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-green-700">Login Successful!</h2>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-end">
              <Link href="/forgotPassword" className="text-sm md:text-sm font-medium text-blue-800 mr-2">Forgot Password?</Link>
            </div>
            <div className="col-span-2 flex justify-center mt-3">
              <button
                className=" bg-blue-100 text-blue-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full w-64 mx-auto"
                onClick={handleLogin}
              >
                Login
              </button>
              {/* {message && <p className="mt-4 text-green-500">{message}</p>} */}
            </div> 
          </div>
          <div className="ml-2 mb-2">
          <footer className="text-center text-black-500 text-xs md:text-sm">
            &copy; AB Software Solution. All rights reserved.
          </footer>
        </div>
        </div>
      </div>
    </div>
  );
}