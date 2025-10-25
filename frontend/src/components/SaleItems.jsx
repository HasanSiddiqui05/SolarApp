import React from 'react'
import { CircleX} from 'lucide-react'

const SaleItems = ({ _id, displayName, stock, quantity, price, onUpdate, handleRemove }) => {
  const increase = () => {
    if (quantity < stock) onUpdate({ quantity: quantity + 1 })
  }

  const decrease = () => {
    if (quantity > 0) onUpdate({ quantity: quantity - 1 })
  }

  const handlePriceChange = (e) => {
    const val = parseFloat(e.target.value) || 0
    onUpdate({ price: val })
  }

  return (
    <div className="flex flex-col gap-2 border p-2 rounded mb-2">
        <div className='flex justify-between'>
            <p className="px-6 font-medium text-lg">{displayName}</p>
            <CircleX size={16} className='cursor-pointer text-red-500' onClick={handleRemove}/>
        </div>

      <div className='flex justify-between px-5'>
        <input type="number" value={price} onChange={handlePriceChange} placeholder='Price' className='border-2 rounded-sm p-2 w-30' />

        <div className="flex items-center gap-2">
          <button onClick={decrease} className="w-6 h-8 bg-gray-200 rounded hover:bg-gray-300"> - </button>
          <span className="w-8 text-center">{quantity}</span>
          <button onClick={increase} className="w-6 h-8 bg-gray-200 rounded hover:bg-gray-300" > + </button>
        </div>
      </div>

      <span className={`w-[92%] flex justify-end text-sm ${ stock > 3 ? ' text-gray-500' : 'text-red-400' }`} > In Stock: {stock} </span>
    </div>
  )
}

export default SaleItems
