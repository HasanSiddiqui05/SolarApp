import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SidebarIcon } from 'lucide-react'
import SolarLogo from '@/assets/SolarLogo.png'

  const months = [ 
    "January", "February", "March","April","May","June",
    "July","August","September","October","November","December" 
  ];
  const functions = [
    'Sales', 'Revenue vs Cost', 'Profit', 'Sales by Category', 'Current Stock Level', 
  ]

const Reports = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [saleData, setSaleData] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [chartData, setChartData] = useState([])
    const [func, setFunction] = useState('Sales')
    
    const toggle = () => {
    setIsMenuOpen(!isMenuOpen);
    };

    const fetchSaleData = async (month = null) => {
        try{
            const res = await axios.get("http://localhost:3000/api/sales/reportData", {
                params: {month}
            });
            if (res.data.success) {
                setSaleData(res.data.total);
                setChartData(res.data.categories)
            }
        }catch(err){
            console.error("Error fetching sales:", err);
        }
    }

    
    useEffect(()=> {
        fetchSaleData()
    }, [])


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

      <div className='md:w-5/6 w-full flex flex-col p-5 '>
        <div className='text-center font-medium sm:text-3xl text-xl md:p-10 sm:p-3 p-2  font-serif '>
            {selectedMonth? `Sales during ${selectedMonth} : ${saleData}` : `Sales this year : ${saleData}`}
        </div>
        <div className='flex justify-end gap-20 px-20 py-5'>
            {/* <Select onValueChange={(val) => { 
                setFunction(val)
                }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
                {functions.map((func, index) => (
                <SelectItem key={index} value={func}>
                    {func}
                </SelectItem>
                ))}
            </SelectContent>
            </Select> */}

            <Select onValueChange={(val) => { 
                setSelectedMonth(val)
                const month = months.indexOf(val)
                fetchSaleData(month);

                }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
                {months.map((month, index) => (
                <SelectItem key={index} value={month}>
                    {month}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        
        
        <div className="flex justify-center items-center w-[screen] h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            </BarChart>
        </ResponsiveContainer>
        </div>

        </div>
    </div>
  )
}

export default Reports
