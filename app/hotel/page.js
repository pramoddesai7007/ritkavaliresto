'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

const CreateHotelForm = () => {
  const [formData, setFormData] = useState({
    hotelName: '',
    address: '',
    email: '',
    contactNo: '',
    gstNo: '',
    sacNo: '',
    fssaiNo: '',
    hotelLogo: null,
    qrCode: null,
  });

  const [hotels, setHotels] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // New state for success modal

  // Fetch hotels on component mount
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('https://backdeploy.vercel.app/api/hotel/get-all');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const [editFormData, setEditFormData] = useState({
    hotelName: '',
    address: '',
    email: '',
    contactNo: '',
    gstNo: '',
    sacNo: '',
    fssaiNo: '',
    hotelLogo: null,
    qrCode: null,
  });

  // State to manage whether the edit modal is open or not
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Function to open the edit modal and fetch hotel details
  const handleEdit = async (hotelId) => {
    try {
      const response = await axios.get(`https://backdeploy.vercel.app/api/hotel/get/${hotelId}`);
      const hotelDetails = response.data;

      setEditFormData(hotelDetails);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching hotel details for edit:', error);
    }
  };

  // Function to handle changes in the edit form
  const handleEditInputChange = (e) => {
    const { name, value, type, files } = e.target;

    // Capitalize the first letter if the input is not empty
    const capitalizedValue = value !== '' ? capitalizeFirstLetter(value) : '';

    setEditFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  // Function to handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataForUpload = new FormData();
      Object.entries(editFormData).forEach(([key, value]) => {
        formDataForUpload.append(key, value);
      });

      const response = await axios.patch(`https://backdeploy.vercel.app/api/hotel/edit/${editFormData._id}`, formDataForUpload);
      console.log('Hotel edited successfully:', response.data);

      setIsEditModalOpen(false); // Close the edit modal
      fetchHotels(); // Refresh the list after editing
    } catch (error) {
      console.error('Error editing hotel:', error);
    }
  };



  const handleDelete = async (hotelId) => {
    try {
      await axios.delete(`https://backdeploy.vercel.app/api/hotel/delete/${hotelId}`);
      console.log('Hotel deleted successfully.');
      fetchHotels(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    // Capitalize the first letter if the input is not empty
    const capitalizedValue = value !== '' && (name === 'hotelName' || name === 'address')
      ? capitalizeFirstLetter(value)
      : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: capitalizedValue,
    }));
  };


  const resetForm = () => {
    setFormData({
      hotelName: '',
      address: '',
      email: '',
      contactNo: '',
      gstNo: '',
      sacNo: '',
      fssaiNo: '',
      hotelLogo: null,
      qrCode: null,
    });
  };

  // Function to handle successful hotel creation
  const handleSuccessModal = () => {
    setIsSuccessModalOpen(true);
    setTimeout(() => {
      setIsSuccessModalOpen(false);
    }, 2000); // Auto-close success modal after 3 seconds (adjust as needed)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataForUpload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataForUpload.append(key, value);
      });

      const response = await axios.post('https://backdeploy.vercel.app/api/hotel/create', formDataForUpload);
      console.log('Hotel created successfully:', response.data);

      resetForm(); // Clear form data
      fetchHotels(); // Refresh the list after successful submission
      handleSuccessModal(); // Display success modal
    } catch (error) {
      console.error('Error creating hotel:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow-md font-sans mt-11">
        {isSuccessModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-base font-semibold mb-4 text-green-600">Hotel Created Successfully!</h2>
              {/* You can customize the success message here */}
            </div>
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-2">Create Hotel</h2>
        {/* Hotel Name */}
        <div className="flex flex-wrap">
          <div className="w-full sm:w-1/2 lg:w-1/3 mb-4">
            <label className="block text-sm font-medium text-gray-600">Resturant Name
              <span className='text-red-500'>*</span>
            </label>
            <input
              id="hotelNameInput"
              type="text"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/3 mb-4 lg:ml-80">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>

          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-600">Address
              <span className='text-red-500'>*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>

          <div className="flex justify-center gap-5 w-full mb-4 ">
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-2 sm:mb-0">
              <label className="block text-sm font-medium text-gray-600">Contact No.
                <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                className="w-full p-1 border rounded-md"
              />
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/4 mb-2 sm:mb-0">
              <label className="block text-sm font-medium text-gray-600">GST No.</label>
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleInputChange}
                className="w-full p-1 border rounded-md"
              />
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/4 mb-2 sm:mb-0">
              <label className="block text-sm font-medium text-gray-600">SAC No.</label>
              <input
                type="text"
                name="sacNo"
                value={formData.sacNo}
                onChange={handleInputChange}
                className="w-full p-1 border rounded-md"
              />
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/4 mb-2 sm:mb-0 ">
              <label className="block text-sm font-medium text-gray-600">FSSAI No.</label>
              <input
                type="text"
                name="fssaiNo"
                value={formData.fssaiNo}
                onChange={handleInputChange}
                className="w-full p-1 border rounded-md"
              />
            </div>
          </div>


          <div className="flex mb-4">
            <div className="w-full sm:w-1/2 mb-2 sm:mb-0 mr-4">
              <label className="block text-sm font-medium text-gray-600">Hotel Logo</label>
              <input
                type="file"
                name="hotelLogo"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="w-full sm:w-1/2 ">
              <label className="block text-sm font-medium text-gray-600">QR Code</label>
              <input
                type="file"
                name="qrCode"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-center w-full mb-4">
            <button
              type="submit"
              className="bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full w-full lg:w-72"
              onClick={handleSubmit}
            >
              Create Hotel
            </button>
          </div>

          <div className="max-h-80 custom-scrollbars overflow-y-auto">
            <table className="min-w-full mt-4">
              <thead className="text-sm bg-zinc-100 text-yellow-600 border">
                <tr>
                  <th className="p-2 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Hotel Name</th>
                  <th className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">Address</th>
                  <th className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">Email</th>
                  <th className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">Contact No.</th>
                  <th className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">GST No.</th>
                  <th className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">SAC No.</th>
                  <th className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">FSSAI No.</th>
                  <th className=" pl-2 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel._id}>
                    <td className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">{hotel.hotelName}</td>
                    <td className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">{hotel.address}</td>
                    <td className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">{hotel.email}</td>
                    <td className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">{hotel.contactNo}</td>
                    <td className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">{hotel.gstNo}</td>
                    <td className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">{hotel.sacNo}</td>
                    <td className="p-2 whitespace-nowrap text-left text-gray lg:pl-6">{hotel.fssaiNo}</td>
                    <td className="text-center pl-2">
                      <td className="py-1 text-center flex">
                        <button
                          className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                          onClick={() => handleEdit(hotel._id)}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            color="orange"

                            className="cursor-pointer"
                          />{" "}

                        </button>
                        <button
                          className="text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                          onClick={() => handleDelete(hotel._id)}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            color="red"
                            className="cursor-pointer"
                          />{" "}
                        </button>
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-full center bg-black bg-opacity-50 flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className='relative'>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute right-3 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <h2 className="text-base font-semibold">Edit Hotel</h2>
            <form onSubmit={handleEditSubmit}>
              <div className='flex justify-between'>
                {/* Hotel Name */}
                <div className="mb-2 ">
                  <label className="block text-sm font-medium text-gray-600 whitespace-nowrap">Resturant Name</label>
                  <input
                    type="text"
                    name="hotelName"
                    value={editFormData.hotelName}
                    onChange={handleEditInputChange}
                    className="lg:w-96 p-1 border rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="lg:w-96 p-1 border rounded-md"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditInputChange}
                  className="w-full p-1 border rounded-md"
                />
                {/* Email */}
              </div>

              <div className="flex justify-between">
                {/* Contact No. */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Contact No.</label>
                  <input
                    type="text"
                    name="contactNo"
                    value={editFormData.contactNo}
                    onChange={handleEditInputChange}
                    className="w-full p-1 border rounded-md"
                  />
                </div>
                {/* GST No. */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600">GST No.</label>
                  <input
                    type="text"
                    name="gstNo"
                    value={editFormData.gstNo}
                    onChange={handleEditInputChange}
                    className="w-full p-1 border rounded-md"
                  />
                </div>
                {/* SAC No. */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600">SAC No.</label>
                  <input
                    type="text"
                    name="sacNo"
                    value={editFormData.sacNo}
                    onChange={handleEditInputChange}
                    className="w-full p-1 border rounded-md"
                  />
                </div>
                {/* FSSAI No. */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600">FSSAI No.</label>
                  <input
                    type="text"
                    name="fssaiNo"
                    value={editFormData.fssaiNo}
                    onChange={handleEditInputChange}
                    className="w-full p-1 border rounded-md"
                  />
                </div>
              </div>


              <div className="flex justify-between">
                {/* Hotel Logo */}
                <div className="mb-2 mr-4">
                  <label className="block text-sm font-medium text-gray-600">Hotel Logo</label>
                  <input
                    type="file"
                    name="hotelLogo"
                    accept="image/*"
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                {/* QR Code */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600">QR Code</label>
                  <input
                    type="file"
                    name="qrCode"
                    accept="image/*"
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-center mt-3">
                <button
                  type="submit"
                  className="bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full w-72"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateHotelForm;