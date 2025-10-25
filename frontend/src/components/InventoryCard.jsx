import React, { useState } from "react"
import CategoryDetails from "./CategoryDetails"
import { Pencil, Trash2 } from "lucide-react"
import AddProduct from '@/components/AddProduct'
import UpdateCategory from "./UpdateCategory"

const InventoryCard = ({ _id, name, image, stock, attributes = [], onDelete }) => {
  const [details, showDetails] = useState(false)
  const [totalQuantity, setTotalQuantity] = useState(0)

  return (
    <>
      <div 
        className={`flex p-2 gap-2 cursor-pointer rounded transition border-t  
        ${details ? "bg-gray-200" : "hover:bg-gray-200"}`} 
        onClick={() => showDetails(prev => !prev)}
      >
        <div className="flex-1 flex justify-center items-center">
          <img src={image} alt={name} className="w-16 h-16 object-contain" />
        </div>
        <div className="flex-1 flex justify-center items-center">{name}</div>
        <div className="flex-1 flex justify-center items-center">{stock}</div>
        <div className="flex-1 flex gap-3 justify-center items-center" onClick={(e) => e.stopPropagation()}>
          <UpdateCategory _id={_id} name={name} image={image} attributes={attributes}/>
          <button onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete();
            }} className="p-1 rounded bg-red-500 text-white hover:bg-red-600" >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className={`flex flex-col w-full items-center ${details && 'p-4'}`}>
        {details && 
          <div className="w-[93%] pb-3 flex items-center justify-end pr-2"> 
            <AddProduct attributes={attributes} categoryName={name}/> 
          </div>
        }
        {details && (
          <CategoryDetails 
            attributes={attributes} 
            categoryName={name}  
          />
        )}
      </div>
    </>
  )
}

export default InventoryCard
