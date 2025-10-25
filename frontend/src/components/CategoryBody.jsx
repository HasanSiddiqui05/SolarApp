import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import UpdateProduct from "./UpdateProduct";

const CategoryBody = ({ products = [], onEdit, onDelete, headerItems = [] }) => {
  return (
    <div className="flex flex-col divide-y">
      {products.map((product, rowIndex) => {
        const values = product.attributes || {};

        return (
          <div key={rowIndex} className="flex text-center relative group hover:bg-gray-50" >
            {headerItems.map((attr, i) => (
              <div key={i} className="flex-1 p-2 border-r last:border-r-0">
                {values[attr] || ""}
              </div>
            ))}

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <UpdateProduct product={product} onUpdated={(updated) => {
                // update local list of products if needed
                console.log("Updated product:", updated);
              }} />

              <button onClick={() => onDelete(product._id)} className="p-1 rounded bg-red-500 text-white cursor-pointer hover:bg-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBody;
