import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import axios from 'axios'
import SearchBox from './SearchBox'
import SaleItems from './SaleItems'
import { ScrollArea } from "@/components/ui/scroll-area"
import toast from 'react-hot-toast'

const RecordSale = () => {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  

const handleAddProduct = (product) => {
  if (items.find(item => item._id === product._id)) return;

  setItems(prev => [
      ...prev,
      { 
        ...product, 
        quantity: 0, 
        price: parseFloat(product.attributes.Price) || 0,
        stock: parseInt(product.attributes.Stock) || 0
      }
    ]);
  };

  // update product quantity or price
  const handleUpdateItem = (id, updates) => {
    setItems(prev =>
      prev.map(item =>
        item._id === id ? { ...item, ...updates } : item
      )
    )
  }

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price, 0
  )

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const allValid = items.every(item => item.quantity > 0);

      if (!allValid) {
        setErrorMessage("Each item must have quantity greater than 0");
        return;
      }

      const total = items.reduce(
        (sum, item) => sum + item.quantity * item.price, 0
      );


      const products = items.map(item => ({
        productId: item._id,
        quantitySold: item.quantity,
        unitPrice: item.price
      }));

      await axios.post(`${import.meta.env.VITE_API_URL}/api/sales/recordSale`, {
        products,
        totalAmount: total
      });

      toast.success('Sale Recorded')
      setOpen(false);
      setItems([]);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to record sale");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(item => item._id !== id))
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className=' flex items-center justify-center w-full p-3 rounded-sm cursor-pointer hover:bg-blue-300'>
          Record Sale
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Record Sale</DialogTitle>
          <DialogDescription>Fill in all required fields</DialogDescription>
        </DialogHeader>

        <div className='mt-2 flex flex-col items-center w-full gap-2'>
          <SearchBox onAddProduct={handleAddProduct} />
          {errorMessage && (<p className="text-red-500 text-sm mb-2 text-center">{errorMessage}</p>)}

          <ScrollArea className='h-[320px] w-[90%]'>
            {items.map(item => (
              <SaleItems
                key={item._id}
                {...item}
                onUpdate={(updates) => handleUpdateItem(item._id, updates)}
                handleRemove={() => handleRemoveItem(item._id)}  
              />
            ))}
          </ScrollArea>


          <p className='w-[80%] font-medium text-lg text-right'> Total : {total} </p>
 
          <button onClick={handleSubmit} className='w-[90%] px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-700 mt-4 disabled:opacity-50' disabled={items.length === 0 || loading} >
            {loading ? "Recording..." : "Record Sale"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RecordSale
