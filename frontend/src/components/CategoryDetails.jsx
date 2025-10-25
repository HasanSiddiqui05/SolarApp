import React, { useEffect, useState } from 'react'
import CategoryHeader from './CategoryHeader'
import CategoryBody from './CategoryBody'
import axios from 'axios'

const CategoryDetails =  ({ attributes = [], categoryName }) => {
  const [products, setProducts] = useState([])

  useEffect(()=> {
    const fetchProducts = async ()=> {
      try{
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/${categoryName}`);
        const productData = res.data.data || [];
        console.log(res)
        
        setProducts(productData);

      }catch(err){
        console.log('Error fetching Categories : ', err);
      }
    };
    fetchProducts();
  }, [categoryName]);

  const handleDelete = async (id) => {
  try {
    await axios.post(`http://localhost:3000/api/product/deleteProduct/${id}`, { 
      withCredentials: true 
    });

    setProducts(prev => prev.filter(p => p._id !== id));
  } catch (err) {
    console.error("Error deleting Product:", err.response?.data || err.message);
  }
};


  return (
    <div className='flex w-[95%] flex-col border rounded-lg'>
      <CategoryHeader items={attributes} />
      <CategoryBody products={products} onDelete={handleDelete} headerItems={attributes}/>
    </div>
  )
}

export default CategoryDetails
