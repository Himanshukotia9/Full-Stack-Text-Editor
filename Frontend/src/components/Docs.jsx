//Docs.jsx
import React from 'react'
import { FcDocument } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../utils/baseURL';
import { useAuth } from '../context/AuthContext';

export default function Docs({doc, onDelete, uploadToDrive, isGoogleConnected }) {
  const navigate = useNavigate();
  const {currentUser} = useAuth();

  const handleUpload = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking upload
    
    if (!isGoogleConnected) {
      alert("Please connect to Google Drive first to upload documents");
      return;
    }
    
    uploadToDrive(doc._id);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete

    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
        const response = await fetch(`${getBaseUrl()}/api/docs/${currentUser.uid}/${doc._id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete document");
        }

        alert("Document deleted successfully!");
        onDelete(doc._id); // Remove the deleted document from UI
    } catch (error) {
        console.error("Error deleting document:", error);
        alert(error.message);
    }
  };
  return (
    <div className='flex cursor-pointer items-center justify-between p-2 bg-[#f0f0f0] mb-2 hover:bg-[#dcdcdc] transition-all rounded-lg' onClick={() => navigate(`/docs/${doc._id}`)}>
      <div id='left-section' className='flex items-center gap-2'>
        <FcDocument className='size-10 rounded-full'/>
        <div>
            <h3 className='text-xl'>{doc.title}</h3>
            <p className='text-xs text-gray-500'>Created On: {new Date(doc.createdAt).toLocaleDateString()} | 
            Last Updated On: {new Date(doc.lastUpdate).toLocaleDateString()}</p>
        </div>
      </div>
      <div id='Right-section' className='flex gap-2'>
        <FaRegSave id='UploadDoc' onClick={handleUpload} className='size-6 text-blue-500 hover:text-blue-600'/>
        <MdDelete className='size-6 text-red-600 hover:text-red-700' onClick={handleDelete} />
      </div>
    </div>
  )
}
