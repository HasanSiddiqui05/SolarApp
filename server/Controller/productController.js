import Category from "../Model/categoryModel.js";
import Product from '../Model/productModel.js'
import Sale from '../Model/salesModel.js'

export const addProduct = async (req, res) => {
  try {
    const { categoryName, attributes } = req.body;

    if (!categoryName || !attributes) {
      return res.status(400).json({ error: "Category name and attributes are required" });
    }

    // Find category by its name
    const category = await Category.findOne({ name: categoryName, isDeleted: false });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check for missing required attributes
    const missingAttrs = category.attributes.filter(
      (attr) => !attributes[attr] || attributes[attr].trim() === ""
    );
    if (missingAttrs.length > 0) {
      return res.status(400).json({
        error: `Missing required attributes: ${missingAttrs.join(", ")}`,
      });
    }

    // Create product with category name
    const product = new Product({
      categoryName: category.name,
      attributes,
    });
    await product.save();

    // Update category stock (case-insensitive check for Stock attribute)
    const productStock = parseInt(attributes.stock || attributes.Stock || "0", 10) || 0;
    category.stock = (category.stock || 0) + productStock;
    await category.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
      categoryStock: category.stock,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const { name: categoryName } = req.params;  

    if (!categoryName) {
      return res.status(400).json({ success: false, error: "categoryName is required" });
    }

    const products = await Product.find({ categoryName, isDeleted: false })
      .select("attributes") 
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ success: false, message: "ProductID not found" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const stock = parseInt(
      product.attributes instanceof Map
        ? product.attributes.get("Stock") || product.attributes.get("stock") || "0"
        : product.attributes?.Stock || product.attributes?.stock || "0",
      10
    );

    const category = await Category.findOne({
      name: product.categoryName,
      isDeleted: false,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    console.log("Product attributes:", product.attributes);
    console.log(stock)
    category.stock = Math.max(0, (category.stock || 0) - stock);
    await category.save();

    res.status(200).json({ success: true, message: "Product deleted and category stock updated successfully", product, updatedCategoryStock: category.stock, });
  } catch (err) {
    console.error("Error Deleting Product:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { attributes } = req.body;

    // Step 1: Find product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Step 2: Compare old vs new attributes
    const newAttrs = attributes;
    const oldAttrs = Object.fromEntries(product.attributes);

    const changedFields = Object.keys(newAttrs).filter(
      (key) => newAttrs[key] !== oldAttrs[key]
    );

    const riskyFields = changedFields.filter( (key) => key.toLowerCase() !== "stock" && oldAttrs[key] && oldAttrs[key].trim() !== "" );

    // Step 4: If risky fields exist, check for related sales
    if (riskyFields.length > 0) {
      const existingSales = await Sale.find({ "products.productId": product._id });

      if (existingSales.length > 0) {
        return res.status(400).json({ success: false,
           message: `Cannot update fields (${riskyFields.join(
            ", " )}) — this product has recorded sales. Only 'Stock' can be modified. Create a new product instead.`,
        });
      }
    }

    // Step 5: Safe update (update product)
    product.attributes = new Map(Object.entries(newAttrs));
    await product.save();

    // Step 6: Update total stock in the related category
    const products = await Product.find({ categoryName: product.categoryName, isDeleted: false });

    let totalStock = 0;
    for (const p of products) {
      const attrs = Object.fromEntries(p.attributes || []);
      const stockValue = parseFloat(attrs.Stock || attrs.stock || 0);
      if (!isNaN(stockValue)) {
        totalStock += stockValue;
      }
    }
    
    // Step 7: Update category record
    const category = await Category.findOneAndUpdate(
      { name: product.categoryName, isDeleted: false },
      { stock: totalStock },
      { new: true }
    );


    res.status(200).json({ success: true, message: "Product and category stock updated successfully", data: { product, category },});

  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
