import Sales from "../Model/salesModel.js";
import Product from "../Model/productModel.js";
import Category from "../Model/categoryModel.js";

export const searchAll = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json({ products: [] });
    }

    const products = await Product.find({
      isDeleted: false,
      $or: [
        { displayName: { $regex: query, $options: "i" } },
        { categoryName: { $regex: query, $options: "i" } }
      ]
    })
      .limit(50)
      .select("displayName attributes categoryName");

    res.json({ products });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


export const recordSale = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      let currentStock = parseInt(product.attributes.get("Stock") || "0", 10);

      if (currentStock < item.quantitySold) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.displayName}`,});
      }

      product.attributes.set("Stock", String(currentStock - item.quantitySold));
      await product.save();

      const category = await Category.findOne({ name: product.categoryName });
      if (category) {
        category.stock -= item.quantitySold;
        await category.save();
      }
    }

    const sale = new Sales({
      products: products.map(item => ({
        productId: item.productId,   
        quantitySold: item.quantitySold,
        unitPrice: item.unitPrice,
      })),
      totalAmount: totalAmount,
    });
    await sale.save();
    res.status(201).json({ success: true, data: sale });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

export const listSales = async (req, res) => {
  try {
    const sales = await Sales.find();

    const salesWithProducts = await Promise.all(
      sales.map(async (sale) => {
        const detailedProducts = await Promise.all(
          sale.products.map(async (item) => {
            const product = await Product.findById(item.productId).select("attributes displayName categoryName");
            return {
              ...item.toObject(),
              productDetails: product || null,
            };
          })
        );

        return {
          ...sale.toObject(),
          products: detailedProducts,
        };
      })
    );

    res.status(200).json({ success: true, data: salesWithProducts });
  } catch (err) {
    console.error("List Sales Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

export const undoSale = async (req, res) => {
  try {
    const { saleId } = req.params;

    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res.status(404).json({ success: false, message: "Sale not found" });
    }

    for (let item of sale.products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const currentStock = parseInt(product.attributes.get("Stock") || "0", 10);
      const updatedStock = currentStock + item.quantitySold;
      product.attributes.set("Stock", String(updatedStock));
      await product.save();

      const category = await Category.findOne({ name: product.categoryName });
      if (category) {
        category.stock = (category.stock || 0) + item.quantitySold;
        await category.save();
      }
    }

    await sale.deleteOne();

    res.status(200).json({
      success: true,
      message: "Sale undone successfully and stock restored",
    });
  } catch (err) {
    console.error("Undo Sale Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message, });
  }
};



export const reportData = async (req, res) => {
  try {
    const { month } = req.query;

    const sales = await Sales.find();

    let filteredSales = sales;
    if (month !== undefined && month !== null && month !== "") {
      const monthNum = parseInt(month, 10);
      filteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getMonth() === monthNum;
      });
    }

    const categoryTotals = {};

    for (const sale of filteredSales) {
      for (const product of sale.products) {
        const item = await Product.findById(product.productId);

        if (!item) continue; 

        const category = item.categoryName || "Uncategorized";
        const subtotal = product.quantitySold * product.unitPrice;

        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += subtotal;
      }
    }

    // Convert into array for frontend charts
    const categoryData = Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }));

    // Grand total
    const total = categoryData.reduce((sum, c) => sum + c.total, 0);

    res.status(200).json({
      success: true,
      total,
      categories: categoryData, // ✅ send breakdown
    });
  } catch (err) {
    console.error("ReportData Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message,});
  }
};

export const reportData2 = async (req, res) => {
  try{
    const { option } = req.query;
    if (option == 'yearly'){
      const sales = await Sales.find()
    }

  }catch(err){
    console.error("ReportData Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message,});
  }
}

export const salesOverTime = async (req, res) => {
  try {
    const { type, year, month } = req.query; 
    // type = "yearly" | "monthly" | "weekly" | "daily"
    // year & month are optional depending on the type

    let groupStage = {};
    let matchStage = {};

    // 🎯 Yearly → group by year
    if (type === "yearly") {
      groupStage = {
        _id: { year: { $year: "$createdAt" } },
        total: { $sum: "$totalAmount" },
      };
    }

    // 🎯 Monthly → group by month of a year
    if (type === "monthly") {
      if (!year) return res.status(400).json({ success: false, message: "Year is required for monthly view" });
      matchStage = { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } };

      groupStage = {
        _id: { month: { $month: "$createdAt" } },
        total: { $sum: "$totalAmount" },
      };
    }

    // 🎯 Weekly → group by week of a year
    if (type === "weekly") {
      if (!year) return res.status(400).json({ success: false, message: "Year is required for weekly view" });
      matchStage = { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } };

      groupStage = {
        _id: { week: { $week: "$createdAt" } }, // ISO weeks (1–52)
        total: { $sum: "$totalAmount" },
      };
    }

    if (type === "daily") {
      if (!year || !month) return res.status(400).json({ success: false, message: "Year & Month required for daily view" });
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      matchStage = { $match: { createdAt: { $gte: startDate, $lte: endDate } } };

      groupStage = {
        _id: { day: { $dayOfMonth: "$createdAt" } },
        total: { $sum: "$totalAmount" },
      };
    }

    const pipeline = [];
    if (Object.keys(matchStage).length) pipeline.push(matchStage);
    pipeline.push({ $group: groupStage });
    pipeline.push({ $sort: { "_id": 1 } });

    const result = await Sales.aggregate(pipeline);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("salesOverTime Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};