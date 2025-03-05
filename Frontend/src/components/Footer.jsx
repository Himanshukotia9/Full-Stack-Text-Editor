import React from 'react'

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <div className="flex flex-col justify-center items-center mt-10 border-t bg-gray-200 py-3">
        <p className='text-center text-gray-500 text-xs'>&copy; {currentYear} Text Editor. All Rights Reserved.</p>
    </div>
  )
}
