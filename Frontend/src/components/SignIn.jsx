//signIn.jsx
import React from 'react'
import { FaGoogle } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../utils/baseURL';

export default function SignIn() {

    const {signInWithGoogle} = useAuth();
    const navigate = useNavigate();
    
    const handleGoogleSignIn = async() => {
        try {
          const result = await signInWithGoogle()
          const user = result.user;

          const userData = {
            email: user.email,
            username: user.displayName,
            photo: user.photoURL
          };

          const response = await fetch(`${getBaseUrl()}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

        const data = await response.json();
          alert("User LoggedIn Successfully")
          navigate('/')
        } catch (error) {
          alert("Google sign in failed")
          console.log(error)
        }
      }

  return (
    <section className="text-gray-600 body-font">
        <div className="container px-5 py-16 mx-auto flex justify-center">
            <div className="p-4 lg:w-1/3">
                <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                    <h1 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">Google</h1>
                    <h2 className="title-font sm:text-lg text-xs font-medium text-gray-900 mb-3">SignIn</h2>
                    <button onClick={handleGoogleSignIn} className='w-full flex flex-wrap gap-1 items-center justify-center bg-[#0D0842] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none transition-colors'><FaGoogle className='mr-2'/>Sign in with Google</button>
                </div>
            </div>
        </div>
    </section>
  )
}
