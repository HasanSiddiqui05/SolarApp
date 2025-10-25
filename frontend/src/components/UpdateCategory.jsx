import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { DialogTrigger } from '@radix-ui/react-dialog';
import { ListPlus, ListMinus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import axios from 'axios';
import { Pencil } from "lucide-react";
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

const UpdateCategory = ({ _id, name, image, attributes = [] }) => {
  const [open, setOpen] = useState(false);
  const [backendError, setBackendError] = useState("");

  const constantAttributes = ['company', 'stock']
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name || "",
      image: image || "",
      attributes: attributes.length
        ? attributes.filter(attr => !constantAttributes.includes(attr.toLowerCase())).map(attr => ({ value: attr }))
        : [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      image: data.image,
      attributes:  [
        ...["Company"], 
        ...data.attributes.map(attr => attr.value),
        ...["Stock"]],
    };

    try {
      const res = await axios.post(
        `http://localhost:3000/api/category/updateCategory/${_id}`,
        payload
      );
      console.log("Category updated:", res.data);

      reset();
      setOpen(false);
      toast.success('Category Updated')
      setBackendError(""); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      setBackendError(errorMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          reset({
            name,
            image,
            attributes: attributes.length
              ? attributes.filter(attr => !constantAttributes.includes(attr.toLowerCase())).map(attr => ({ value: attr }))
              : [{ value: "" }],
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          <Pencil size={16} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Update Product Type</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex items-center flex-col">
          <input
            placeholder="Name"
            {...register('name')}
            className="w-[90%] p-2 border border-gray-300 rounded-lg mb-2"
          />
          {errors.name && (<p className="text-red-500 text-sm mb-2">{errors.name.message}</p>)}
          {backendError && (<p className="text-red-500 text-sm mb-2">{backendError}</p>)}

          <input
            placeholder="Image"
            {...register('image')}
            className="w-[90%] p-2 border border-gray-300 rounded-lg mb-2"
          />
          {errors.image && <p className="text-red-500 text-sm mb-2">{errors.image.message}</p>}

          {fields.map((field, index) => (
            <div key={field.id} className="w-[90%] border flex flex-col border-gray-300 rounded-lg mb-2">
              <div className="flex items-center">
                <input
                  {...register(`attributes.${index}.value`)}
                  placeholder={`Attribute ${index + 1}`}
                  className="w-[90%] p-2 border-none outline-none"
                />


                {fields.length > 1 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 cursor-pointer border-l-2 text-red-600 hover:bg-gray-100"
                      >
                        <ListMinus />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Attribute</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* ✅ Add button (only on last field) */}
                {index === fields.length - 1 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => append({ value: "" })}
                        className="p-2 cursor-pointer border-l-2 text-green-600 hover:bg-gray-100"
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

          <button
            type="submit"
            className="w-[90%] px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-700 mt-2"
          >
            Update Product
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategory;
