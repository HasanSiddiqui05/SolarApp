import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { FileText } from "lucide-react";

const LogDetails = ({ sale }) => {
  // Handle both sales and service entries
  const isService = !!sale?.services;
  const items = sale?.products || sale?.services || [];

  // Calculate total cost & profit/loss safely
  const totalBuyingCost = items.reduce((sum, item) => {
    const buyPrice = isService
      ? parseFloat(item.costIncurred || 0)
      : parseFloat(item.productDetails?.attributes?.Price || 0);
    const qty = isService ? 1 : item.quantitySold || 0;
    return sum + buyPrice * qty;
  }, 0);

  const profit = (sale?.totalAmount || 0) - totalBuyingCost;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="View Details"
        >
          <FileText size={18} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            {isService ? "Service Details" : "Sale Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 text-sm text-gray-500">
          <p>
            <strong>Date:</strong>{" "}
            {sale?.createdAt
              ? new Date(sale.createdAt).toLocaleString("en-GB")
              : "N/A"}
          </p>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 font-semibold text-gray-700 border-b border-gray-300 pb-2 text-sm">
          <span>{isService ? "Service Type" : "Product"}</span>
          <span className="text-center">{isService ? "Cost Incurred" : "Qty"}</span>
          <span className="text-center">
            {isService ? "Cost Received" : "Sold Price"}
          </span>
          <span className="text-center">
            {isService ? "Profit/Loss" : "Bought Price"}
          </span>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-gray-200 mt-1">
          {items.length > 0 ? (
            items.map((item, idx) => {
              if (isService) {
                const profitLoss = item.costReceived - item.costIncurred;
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-4 py-2 text-sm text-gray-700"
                  >
                    <span>{item.serviceType}</span>
                    <span className="text-center">Rs. {item.costIncurred}</span>
                    <span className="text-center">Rs. {item.costReceived}</span>
                    <span
                      className={`text-center ${
                        profitLoss >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {profitLoss >= 0 ? "+" : "-"}Rs. {Math.abs(profitLoss)}
                    </span>
                  </div>
                );
              } else {
                const boughtPrice = parseFloat(
                  item.productDetails?.attributes?.Price || 0
                );
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-4 py-2 text-sm text-gray-700"
                  >
                    <span>{item.productDetails?.displayName || "N/A"}</span>
                    <span className="text-center">{item.quantitySold}</span>
                    <span className="text-center">Rs. {item.unitPrice}</span>
                    <span className="text-center">Rs. {boughtPrice}</span>
                  </div>
                );
              }
            })
          ) : (
            <p className="text-center text-gray-500 py-3">
              No details available.
            </p>
          )}
        </div>

        {/* Summary */}
        <div className="border-t border-gray-300 mt-2 pt-3 text-sm">
          <div className="flex justify-between mb-1 text-gray-700">
            <span>Total Amount Received</span>
            <span>Rs. {sale?.totalAmount || 0}</span>
          </div>
          <div className="flex justify-between mb-1 text-gray-700">
            <span>Total Cost Incurred</span>
            <span>Rs. {totalBuyingCost}</span>
          </div>
          <div
            className={`flex justify-between font-semibold ${
              profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{profit >= 0 ? "Profit" : "Loss"}</span>
            <span>
              {profit >= 0 ? "+" : "-"} Rs. {Math.abs(profit)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogDetails;
