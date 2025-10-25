import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { RiLoader5Line } from "react-icons/ri";
import { ScrollArea } from "./ui/scroll-area";
import { Undo2 } from "lucide-react";
import LogDetails from "./LogDetails";

const InventoryLogs = ({ type = "sales" }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const years = []
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Endpoint dynamically changes based on type
  const endpoint =
    type === "sales"
      ? `${import.meta.env.VITE_API_URL}/api/sales/getSales`
      : `${import.meta.env.VITE_API_URL}/api/services/getServices`;

  // Fetch data
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(endpoint);
        if (res.data.success) {
          setRecords(res.data.data);
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [type]);

  // Undo (only for sales)
  const handleUndo = async (id) => {
    if (type !== "sales") return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/sales/undoSale/${id}`
      );
      if (res.data.success) {
        setRecords((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert(res.data.message || "Failed to undo sale.");
      }
    } catch (err) {
      console.error("Undo error:", err);
      alert(err.response?.data?.message || "Error undoing sale.");
    }
  };

  // Month filter
  const filteredRecords = selectedMonth
    ? records.filter((r) => {
        const recordMonth = new Date(r.createdAt).getMonth();
        return months[recordMonth] === selectedMonth;
      })
    : records;

  // Calculate total
  const total = filteredRecords.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );

  // Loader
  if (loading) {
    return (
      <div className="flex h-screen w-full justify-center mt-[200px]">
        <RiLoader5Line size={25} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full text-sm sm:text-base md:text-md ">
      {/* Month Filter */}
      <div className="flex justify-end md:px-20 md:py-5">
        <Select onValueChange={(val) => setSelectedMonth(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="This Year" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Header */}
      <div className="w-full flex my-3 font-bold">
        <div className="w-1/5">Date</div>
        <div className="w-2/5">
          {type === "sales" ? "Products" : "Services"}
        </div>
        <div className="w-1/5">Total</div>
        <div className="w-1/5">Actions</div>
      </div>

      <ScrollArea className={'h-[420px]'}>            
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => {
            const canUndo = type === "sales";

            return (
              <div key={record._id} className="w-full flex border-b py-2">
                {/* Date */}
                <div className="w-1/5">
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>

                {/* Products / Services */}
                <div className="w-2/5">
                  {type === "sales" ? (
                    record.products.map((p, idx) => (
                      <div key={idx}>
                        {p.productDetails?.displayName || "Unnamed"} (x
                        {p.quantitySold})
                      </div>
                    ))
                  ) : (
                    record.services.map((s, idx) => (
                      <div key={idx}>
                        {s.serviceType}
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                <div className="w-1/5 flex items-center">
                  Rs. {record.totalAmount}
                </div>

                {/* Actions */}
                <div className={`w-1/5 flex ${type != "sales" && 'pl-3'} gap-2 items-center`}>
                  <LogDetails sale={record} />

                  {canUndo && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 rounded text-gray-600 hover:bg-gray-100 cursor-pointer">
                          <Undo2 size={18} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to undo this sale?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will restore the stock levels and remove this
                            sale record. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-slate-500 text-white hover:bg-slate-700 cursor-pointer"
                            onClick={() => handleUndo(record._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-7 text-gray-500">
            No {type} recorded for this month
          </div>
        )}
      </ScrollArea>

      {/* Total Summary */}
      <div className="w-full text-xl font-medium text-end xl:px-30 lg:px-10 px-5 pt-5">
        Total: Rs. {total}
      </div>
    </div>
  );
};

export default InventoryLogs;
