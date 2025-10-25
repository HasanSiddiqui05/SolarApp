import React, { useState } from 'react'
import Inventory from '@/components/Inventory'
import Sidebar from '@/components/Sidebar'
import { SidebarIcon } from 'lucide-react'
import SolarLogo from '@/assets/SolarLogo.png'
import {motion} from 'framer-motion'

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full max-h-screen flex md:flex-row flex-col relative">
      <div className="hidden md:flex xl:w-[260px] lg:w-[220px] md:w-[200px] border-r-2">
        <Sidebar />
      </div>

      {isMenuOpen && (
        <motion.div 
        initial={{opacity: 0 , x:-100}}
        animate={{opacity:1 , x:0}}
        exit= {{opacity: 0, x: 200}}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/20" onClick={toggle}></div>
          <div className="relative z-50 w-[220px] h-full bg-gray-100 shadow-xl">
            <Sidebar />
          </div>
        </motion.div>
      )}

      <div className="w-full md:hidden flex items-center justify-center p-2 border-b">
        <SidebarIcon className="w-6 h-6 cursor-pointer absolute left-10 top-7" onClick={toggle} />
        <div className="ml-7 w-34"> <img src={SolarLogo}></img> </div>
      </div>

      <div className="flex-1 flex justify-center py-5">
        <Inventory />
      </div>
    </div>
  )
}

export default Homepage
