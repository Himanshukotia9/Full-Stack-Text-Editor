import React from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col gap-2 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-center text-xl font-bold mb-4">Profile</h2>
      <img src={currentUser.photo} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
      <p><strong>Name:</strong> {currentUser.username}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <button type="button" onClick={handleLogout} className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5">Logout</button>
    </div>
  )
}
