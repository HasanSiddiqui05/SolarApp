import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Pencil } from "lucide-react";

const UpdateProduct = ({ product, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const attributes = Object.keys(product.attributes || {});
  const categoryName = product.categoryName;

  // Dynamic Zod schema based on attributes
  const schema = useMemo(() => {
    const shape = {};
    attributes.forEach((attr) => {
      shape[attr] = z.string().min(0, `${attr} is required`);
    });
    return z.object(shape);
  }, [attributes]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: product.attributes,
  });

  useEffect(() => {
    if (open) {
      reset(product.attributes);
    }
  }, [open, product, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/product/updateProduct/${product._id}`,
        {
          categoryName,
          attributes: data,
        }
      );

      if (res.data.success) {
        setSuccessMessage(res.data.message || "Product updated successfully!");
        onUpdated?.(res.data.product);
        setTimeout(() => setOpen(false), 800);
      } else {
        setErrorMessage(res.data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      const backendMsg =
        err.response?.data?.message || "Server error. Please try again.";
      setErrorMessage(backendMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <button
          className="p-1 rounded bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
          title="Edit Product"
        >
          <Pencil size={16} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Update Product</DialogTitle>
          <DialogDescription>
            Modify the fields below and save your changes.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-2 text-center">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm mb-2 text-center">
            {successMessage}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-2 flex flex-col items-center w-full"
        >
          {attributes.map((field) => (
            <div key={field} className="w-[90%] flex flex-col mb-2">
              <input
                placeholder={field}
                {...register(field)}
                className="p-2 border border-gray-300 rounded-lg"
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          ))}

          <button type="submit" disabled={loading} className="w-[90%] px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-700 mt-2 cursor-pointer">
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProduct;
