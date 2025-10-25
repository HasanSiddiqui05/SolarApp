import React, {useState} from 'react'
import Sidebar from '@/components/Sidebar'
import InventoryLogs from '@/components/InventoryLogs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarIcon } from 'lucide-react'
import SolarLogo from '@/assets/SolarLogo.png'

const SalesLog = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const toggle = () => {
      setIsMenuOpen(!isMenuOpen);
    };

  return (
    <div className='w-full min-h-screen flex md:flex-row flex-col relative'>
      <div className="hidden md:flex xl:w-[260px] lg:w-[220px] md:w-[200px] border-r-2">
        <Sidebar />
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/20" onClick={toggle}></div>
          <div className="relative z-50 w-[220px] h-full bg-gray-100 shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="w-full md:hidden flex items-center justify-center p-2 border-b">
        <SidebarIcon className="w-6 h-6 cursor-pointer absolute left-10 top-7" onClick={toggle} />
        <div className="ml-7 w-34"> <img src={SolarLogo}></img> </div>
      </div>


      <div className='md:w-5/6 w-full flex py-5 sm:px-5 px-2  justify-center'>
        <Tabs defaultValue="sales" className="sm:w-[95%] w-[100%]">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <InventoryLogs type="sales" />
          </TabsContent>

          <TabsContent value="services">
            <InventoryLogs type="services" />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}

export default SalesLog
