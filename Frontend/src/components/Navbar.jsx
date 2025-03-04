import React, { useState } from 'react'
import logo from '../../public/docsIcon.png'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom';

export default function Navbar() {

    const { currentUser } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    // Dropdown menu items
    const menuItems = [
        { name: "Profile", path: "/profile" },
    ];

  return (
    <nav className='flex items-center px-14 h-20 justify-between bg-gray-200'>
        <div className='flex items-center space-x-4'>
            <Link to='/'><img src={logo} alt="" /></Link>
            <h1 className='text-xl font-semibold'>Text Editor</h1>
        </div>
        {currentUser && (
            <div className="relative">
                <img src={currentUser.photo} alt="Profile" className="size-12 rounded-xl cursor-pointer hover:border-2 hover:border-blue-600 transition-all" onClick={toggleDropdown}/>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                        <ul className="py-2">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.path} className="block px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )}
    </nav>
  )
}
