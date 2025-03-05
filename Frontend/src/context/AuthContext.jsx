import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase/firebase.config';

const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext)
}

const googleProvider = new GoogleAuthProvider();

//authProvider
export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const[loading, setLoading] = useState(true)

    //signUp/signIn with Google
    const signInWithGoogle = async () => {
        return await signInWithPopup(auth, googleProvider);
    }

    //Logout user
    const logout = () => {
        return signOut(auth);
    }

    //manage user
    useEffect(() => {
        const authListener = onAuthStateChanged(auth,(user) => {
            if(user){
                const {email, displayName, photoURL, uid} = user;
                setCurrentUser({
                    email,
                    username: displayName,
                    photo: photoURL,
                    uid,
                })
            }
            else{
                setCurrentUser(null);
            }
            setLoading(false);
        })
        return () => authListener();
    },[])

    const value = {
        currentUser,
        loading,
        signInWithGoogle,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
