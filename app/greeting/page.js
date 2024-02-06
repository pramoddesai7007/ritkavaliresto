"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Greetings = () => {
  const [createGreetData, setCreateGreetData] = useState({
    greet: '',
    message: '',
  });
  const [updateGreetData, setUpdateGreetData] = useState({
    id: '',
    greet: '',
    message: '',
  });
  const [deleteGreetId, setDeleteGreetId] = useState('');
  const [greetings, setGreetings] = useState([]);

  useEffect(() => {
    getGreetings();
  }, []);

 

  const getGreetings = async () => {
    try {
      const response = await axios.get('https://backdeploy.vercel.app/api/greet/greet');
      setGreetings(response.data);
    } catch (error) {
      console.error('Error retrieving greetings:', error);
    }
  };


  
  const handleEdit = (greet) => {
    setUpdateGreetData({ id: "", greet: greet.greet, message: greet.message });
  };

  const deleteGreet = async (greetId) => {
    try {
      const response = await axios.delete(`https://backdeploy.vercel.app/api/greet/greet/${greetId}`);
      console.log('Greet deleted:', response.data);
      getGreetings(); // Refresh the list after deleting a greet
    } catch (error) {
      console.error('Error deleting greet:', error);
    }
  };





  


  const createGreet = async () => {
    // Validation: Check if either greet or message is empty
   
  
    try {
      const response = await axios.post('https://backdeploy.vercel.app/api/greet/greet', createGreetData);
      console.log('Greet created:', response.data);
      setCreateGreetData({ greet: '', message: '' });
      getGreetings(); // Refresh the list after creating a new greet
    } catch (error) {
      console.error('Error creating greet:', error);
      // Provide user feedback on error
    }
  };
  
  const updateGreet = async (greetId) => {
    // Validation: Check if both greet and message are empty
    if (!updateGreetData.greet && !updateGreetData.message) {
      console.error('Please fill in both Greet and Message fields.');
      // You might also want to provide user feedback here
      return;
    }
  
    try {
      const response = await axios.patch(`https://backdeploy.vercel.app/api/greet/greet/${greetId}`, updateGreetData);
      console.log('Greet updated:', response.data);
      setUpdateGreetData({ id: '', greet: '', message: '' });
      getGreetings(); // Refresh the list after updating a greet
    } catch (error) {
      console.error('Error updating greet:', error);
      // Provide user feedback on error
    }
  };
  

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-8 mt-20">
      <h1 className="text-4xl font-bold mb-8">Greet App</h1>

      {/* Create Greet */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create Greet</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Greet"
            className="border p-2"
            value={createGreetData.greet}
            onChange={(e) => setCreateGreetData({ ...createGreetData, greet: e.target.value })}
          />
          <input
            type="text"
            placeholder="Message"
            className="border p-2"
            value={createGreetData.message}
            onChange={(e) => setCreateGreetData({ ...createGreetData, message: e.target.value })}
          />
          <button className="bg-blue-500 text-white p-2 rounded" onClick={createGreet}>
            Create
          </button>
        </div>
      </div>

      {/* Get Greetings */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">List of Greetings</h2>
        <ul>
        {greetings.map((greet) => (
            <li key={greet._id} className="mb-4">
              {/* Display editable fields */}
              <input
                type="text"
                value={updateGreetData.greet || greet.greet}
                onChange={(e) => setUpdateGreetData({ ...updateGreetData, greet: e.target.value })}
              />
              <input
                type="text"
                value={updateGreetData.message || greet.message}
                onChange={(e) => setUpdateGreetData({ ...updateGreetData, message: e.target.value })}
              />
          
              <button
                className="ml-4 bg-red-500 text-white p-2 rounded"
                onClick={() => deleteGreet(greet._id)} 
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default Greetings;