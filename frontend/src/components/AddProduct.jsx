import React, { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { DialogTrigger } from '@radix-ui/react-dialog';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from 'axios';
import toast from 'react-hot-toast'

const AddProduct = ({ attributes = [], categoryName }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const schema = useMemo(() => {
    const shape = {};
    attributes.forEach(attr => {
      shape[attr] = z.string().min(1, `${attr} is required`);
    });
    return z.object(shape);
  }, [attributes]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: attributes.reduce((acc, field) => {
      acc[field] = "";
      return acc;
    }, {})
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await axios.post("http://localhost:3000/api/product/addProduct", {
        categoryName,
        attributes: data
      });

      setSuccessMessage("Product added successfully!");
      toast.success('New Product Added')
      reset();      
      setOpen(false); 
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {  setOpen(o);  if (!o) reset(); }}>
      <DialogTrigger asChild>
        <button className='border-2 border-slate-500 p-2 rounded-lg cursor-pointer'>
          Add Product
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl'> Add New Product </DialogTitle>
          <DialogDescription> Fill in all required fields </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-2 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm mb-2 text-center">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='mt-2 flex items-center flex-col w-full'>
          {attributes.map((field) => (
            <div key={field} className="w-[90%] flex flex-col mb-2">
              <input
                placeholder={field}
                {...register(field)}
                className='p-2 border border-gray-300 rounded-lg'
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]?.message}</p>
              )}
            </div>
          ))}

          <button 
            type='submit' 
            disabled={loading}
            className='w-[90%] px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-700 mt-2 disabled:opacity-50'
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProduct
