import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { DialogTrigger } from '@radix-ui/react-dialog';
import { ListPlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import axios from 'axios';
import {toast} from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Must be a valid image URL"),
  attributes: z.array(
    z.object({
      value: z.string().min(1, "Attribute cannot be empty"),
    })
  ).min(1, "At least one attribute is required"),
});

const AddCategory = () => {
  const [open, setOpen] = useState(false)  
  const [backendError, setBackendError] = useState("");

  const { register, handleSubmit, control, reset, formState: { errors }, } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      image: "",
      attributes: [{ value: "" }],
    },
  });
  
  const { fields, append } = useFieldArray({
    control,
    name: "attributes",
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      attributes: data.attributes.map(attr => attr.value),
    };

    try {
      const res = await axios.post("http://localhost:3000/api/category/addCategory", payload);
      console.log("Category added:", res.data);

      reset();
      setOpen(false);
      toast.success('New Category Added')
      setBackendError(""); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      setBackendError(errorMessage); 
      console.error("Error adding category:", errorMessage);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) { 
        reset(); 
      }}}
    > 
      <DialogTrigger asChild>
        <button className=' flex items-center justify-center w-full p-3 rounded-sm cursor-pointer hover:bg-blue-300'>
          Add Category
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl'> Add New Product Type </DialogTitle>
          <DialogDescription className='text-md mt-2'> Add Product attributes other than Company and Stock</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='mt-2 flex items-center flex-col'>
        <input placeholder='Name' {...register('name')} className='w-[90%] p-2 border border-gray-300 rounded-lg mb-2'/>
        {errors.name && ( <p className="text-red-500 text-sm mb-2">{errors.name.message}</p> )}
        {backendError && ( <p className="text-red-500 text-sm mb-2">{backendError}</p> )}


          <input placeholder='Image' {...register('image')} className='w-[90%] p-2 border border-gray-300 rounded-lg mb-2'/>
          {errors.image && <p className="text-red-500 text-sm mb-2">{errors.image.message}</p>}

          {fields.map((field, index) => (
            <div key={field.id} className="w-[90%] border flex flex-col border-gray-300 rounded-lg mb-2">
              <div className="flex items-center">
                <input
                  {...register(`attributes.${index}.value`)}
                  placeholder={`Attribute ${index + 1}`}
                  className="w-[90%] p-2 border-none outline-none"
                />
                {index === fields.length - 1 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => append({ value: "" })}
                        className="p-2 cursor-pointer border-l-2"
                      >
                        <ListPlus />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add more attributes</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {errors.attributes?.[index]?.value && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.attributes[index].value.message}
                </p>
              )}
            </div>
          ))}

          {errors.attributes?.message && (
            <p className="text-red-500 text-sm mb-2">{errors.attributes.message}</p>
          )}

          <button type='submit' className='w-[90%] px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-700 text-center flex justify-center mt-2'>
            Add Product
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCategory
