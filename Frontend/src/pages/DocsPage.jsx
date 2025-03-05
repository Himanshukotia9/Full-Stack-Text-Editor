import React, {useState, useRef, useEffect} from 'react';
import JoditEditor from "jodit-pro-react";
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import getBaseUrl from '../utils/baseURL';

const config = {
    height: 400, // Set height (in pixels)
    minHeight: 300, // Minimum height
};

export default function DocsPage() {
    let {id} = useParams()
    const editor = useRef(null)
    const { currentUser } = useAuth();
    const [content, setContent] = useState('')
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchDoc = async () => {
        try {
            const response = await fetch(`${getBaseUrl()}/api/docs/single/${id}`);
            const text = await response.text();
            const data = JSON.parse(text);
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch document');
            }
    
            setContent(data[0].content);
        } catch (error) {
            console.error("Fetch Error:", error.message);
            setError(error.message);
        }
    };
      fetchDoc();
    }, []);

    const updateDoc = async () => {
      try {
          const response = await fetch(`${getBaseUrl()}/api/docs/${currentUser.uid}/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content }),
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.message || "Failed to update document");
          }
  
          alert('Document updated successfully!');
      } catch (error) {
          console.error("Error updating Document", error.message);
      }
  };
    
  return (
    <div className='sm:px-20 space-y-2'>
      {error && <p className="text-red-600">{error}</p>}
      <JoditEditor
			ref={editor}
			value={content}
      config={config}
			tabIndex={1} // tabIndex of textarea
			onChange={(newContent) => setContent(newContent)}
		  />
      <button onClick={updateDoc} className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-base sm:text-lg px-5 py-1.5 transition-colors'>Save</button>
    </div>
  )
}
