import React from 'react'
import AddCategory from '@/components/AddCategory'
import SolarLogo from '@/assets/SolarLogo.png'
import RecordSale from '@/components/RecordSale'
import RecordService from './RecordService'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation() 
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const isActive = (path) => location.pathname === path ? "bg-blue-300" : "hover:bg-blue-300"

  return (
    <div className='text-sm text-black w-full flex flex-col p-3 pt-10 gap-3 bg-gray-100 h-screen sticky top-0'>
      <div className='flex justify-center'>
        <img src={SolarLogo} className='w-50'></img>
      </div>
      <div className='w-full h-full flex justify-between flex-col items-center'>
        <div className='w-full flex flex-col gap-2'>
          <div onClick={() => navigate('/HomePage')} className={`flex items-center justify-center w-full p-3 rounded-sm cursor-pointer ${isActive("/")}`}>
            Home
          </div>
          <AddCategory/>
          <RecordSale/>
          <RecordService/>
          <div onClick={() => navigate('/SalesLog')} className={`flex items-center justify-center w-full p-3 rounded-sm cursor-pointer ${isActive("/SalesLog")}`}>
            Inventory Logs
          </div>
          <div onClick={()=> navigate('/Reports')} className={`flex items-center justify-center w-full p-3 rounded-sm cursor-pointer ${isActive("/Reports")}`}>
            Report
          </div>
        </div>
        <div onClick={handleLogout} className={`flex items-center justify-center w-full p-3 rounded-sm cursor-pointer ${isActive("/Logout")}`}>
            Logout
        </div>
      </div>
    </div>
  )
}

export default Sidebar
