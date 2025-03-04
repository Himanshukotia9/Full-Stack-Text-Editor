import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

export default function PrivateRoute({ children }) {
    const { currentUser, loading } = useAuth();
    if (loading) {
      return <Loader/>
    }
    if(currentUser){
        return children
    }
    return <Navigate to='/login' replace/>
}
