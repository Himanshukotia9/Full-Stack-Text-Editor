import React, { useEffect, useState } from 'react'
import { FiPlus } from "react-icons/fi";
import Docs from '../components/Docs';
import getBaseUrl from '../utils/baseURL';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'

export default function HomePage() {

  const { currentUser } = useAuth()
  const [isModel, setIsModel] = useState(false)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/api/docs/${currentUser.uid}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch documents');
        }

        setDocs(data);  // Store fetched documents
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError(error.message);
      }
    };

    if (currentUser) fetchDocs();
  }, [currentUser]);

  const createDoc = async() => {
    if(title === ''){
      setError('Please enter a title')
    }
    else{
      try {
        const response = await fetch(`${getBaseUrl()}/api/docs/createDoc`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.uid,
            title: title,
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create document');
        }
  
        alert('Document created successfully!');
        setDocs([data.doc]);
        setTitle('');
        setIsModel(false)
        navigate(`/docs/${data.doc._id}`)
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleDeleteDoc = (docId) => {
    setDocs(docs.filter(doc => doc._id !== docId));
  };

  return (
    <div className='sm:px-20'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl sm:text-3xl'>All Documents</h2>
        <button onClick={() => setIsModel(true)} className='flex items-center text-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-base sm:text-lg px-3 py-2.5 gap-2 transition-colors'>New Document <FiPlus /></button>
      </div>
      <div id='all-docs' className='mt-4'>
        {docs.length > 0 ? (
          docs.map((doc) => (
            <Docs key={doc._id} doc={doc} onDelete={handleDeleteDoc} />
          ))
        ) : (
          <p>No documents found.</p>
        )}
      </div>
      {isModel && (
        <div id='create-doc-model' className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 w-screen h-screen flex flex-col items-center justify-center'>
        <div className='bg-white p-3 rounded-lg w-[35vw] h-[30vh]'>
          <h3 className='text-xl font-semibold'>Create New Document</h3>
          <div className='flex flex-col gap-2 mt-2'>
            <p className='text-sm text-gray-600 font-medium'>Title</p>
            <div className='w-full'>
              <input onChange={(e) => {setTitle(e.target.value); setError('');}} value={title} type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Title" required />
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          </div>
          <div className='flex items-center justify-between w-full mt-2 space-x-2'>
            <button onClick={createDoc} className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-base sm:text-lg px-2 py-1 transition-colors w-1/2'>Create Doc</button>
            <button type="button" onClick={() => {setIsModel(false); setError('')}} className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-base sm:text-lg px-2 py-1 transition-colors w-1/2">Cancel</button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
