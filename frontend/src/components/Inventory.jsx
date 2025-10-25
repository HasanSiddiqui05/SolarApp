import InventoryCard from './InventoryCard'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { RiLoader5Line } from "react-icons/ri";
import { ScrollArea } from './ui/scroll-area';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/category/`, {
          withCredentials: true,
        });
        console.log("API Response:", res.data);
        setCategories(res.data.data);
      } catch (err) {
        console.log('Error fetching Categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/category/deleteCategory/${id}`,
        {},
        { withCredentials: true }
      );
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success('Category Deleted')
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="w-[95%] flex flex-col gap-1 items-center border-2 rounded-xl p-2 h-[99%]">
      <div className="w-full flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex w-full p-3 gap-2 border-b-2 text-xl font-bold">
          <h1 className="w-1/4 text-center">Image</h1>
          <h1 className="w-1/4 text-center">Product</h1>
          <h1 className="w-1/4 text-center">Inventory</h1>
          <h1 className="w-1/4 text-center">Actions</h1>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex w-full justify-center items-center flex-1">
            <RiLoader5Line className="animate-spin" size={25} />
          </div>
        ) : categories.length > 0 ? (
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="flex flex-col w-full">
              {categories.map((c) => (
                <InventoryCard
                  key={c._id}
                  {...c}
                  onDelete={() => handleDelete(c._id)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-5 text-xl flex-1 flex items-center justify-center">
            There are no existing categories
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
