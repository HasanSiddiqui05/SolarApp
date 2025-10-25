import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { DialogTrigger } from '@radix-ui/react-dialog';
import { ListPlus, ListMinus } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from 'react-hot-toast'

const serviceOptions = [
  "System design and installation",
  "Maintenance and repair",
  "Site survey",
  "After-sales service and warranty support"
];

const schema = z.object({
  name: z.string().optional(), 
  image: z.string().optional(),
  services: z.array(
    z.object({
      serviceType: z.string().min(1, "Please select a service"),
      costIncurred: z.string().min(1, "Enter cost incurred"),
      costReceived: z.string().min(1, "Enter cost received"),
    })
  ).min(1, "At least one service must be added"),
});

const RecordService = () => {
  const [open, setOpen] = useState(false);
  const [backendError, setBackendError] = useState("");

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      services: [{ serviceType: "", costIncurred: "", costReceived: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/service/recordService`, data);
      console.log("Service recorded:", res.data);
      reset();
      setOpen(false);
      setBackendError("");
      toast.success('New Category Added')
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      setBackendError(errorMessage);
      console.error("Error adding service:", errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) reset();
    }}>
      <DialogTrigger asChild>
        <button className='flex items-center justify-center w-full p-3 rounded-sm cursor-pointer hover:bg-blue-300'>
          Record Service
        </button>
      </DialogTrigger>

      <DialogContent className={'sm:max-w-xl'}>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Record Solar Service</DialogTitle>
          <DialogDescription className='text-md mt-2'>
            Select service type and input cost details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='mt-2 flex flex-col items-center'>

          {fields.map((field, index) => (
            <div key={field.id} className="w-[95%] border border-gray-300 rounded-lg mb-2 p-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Controller
                  name={`services.${index}.serviceType`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger className="w-[46%]">
                        <SelectValue placeholder="Select Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((service, i) => (
                          <SelectItem key={i} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <input
                  type="number"
                  placeholder="Cost Incurred"
                  {...register(`services.${index}.costIncurred`)}
                  className="w-[27%] p-2 border border-gray-300 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Cost Received"
                  {...register(`services.${index}.costReceived`)}
                  className="w-[27%] p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Add / Remove Buttons */}
              <div className={`flex justify-center ${fields.length > 1 && 'justify-between'} gap-2 mt-2`}>
                    <button type="button" onClick={() => append({ serviceType: "", costIncurred: "", costReceived: "" })} className="flex justify-center items-center w-1/2 p-2 border rounded-md hover:bg-gray-100 text-green-600 cursor-pointer">
                      <ListPlus className="mr-1" /> Add Service
                    </button>


                {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex justify-center items-center w-1/2 p-2 border rounded-md hover:bg-gray-100 text-red-500 cursor-pointer"
                      >
                        <ListMinus className="mr-1" /> Remove Service
                      </button>

                )}
              </div>

              {errors.services?.[index] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.services[index].serviceType?.message ||
                    errors.services[index].costIncurred?.message ||
                    errors.services[index].costReceived?.message}
                </p>
              )}
            </div>
          ))}

          <button
            type='submit'
            className='w-[90%] px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-700 mt-2'
          >
            Record Service
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RecordService
