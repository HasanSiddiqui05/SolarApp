import Category from '../Model/categoryModel.js'
import Product from '../Model/productModel.js';

export const addCategory = async (req, res) => { 
  try {
    const { name, image, attributes } = req.body;

    if (!name || !attributes) {
      return res
        .status(400)
        .json({ message: "Name and attribute are required fields" });
    }

    const trimmedName = name.trim();

    const existing = await Category.findOne({ name: trimmedName, isDeleted: false });
    if (existing) {
      return res.status(400).json({ message: "Category name must be unique" });
    }

    const products = await Product.find({ categoryName: trimmedName, isDeleted: false });

    let totalStock = 0;
    products.forEach((product) => {
      const attrs = Object.fromEntries(product.attributes);
      const stock = parseInt(attrs.Stock || "0", 10);
      if (!isNaN(stock)) {
        totalStock += stock;
      }
    });

    const finalAttributes = Array.from(
      new Set(["Company", ...attributes, "Price", "Stock"])
    );

    const category = new Category({
      name: trimmedName,
      image,
      stock: totalStock,
      attributes: finalAttributes,
    });

    await category.save();

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false })
    res.status(200).json({ success: true, data: categories })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ success: false, message: "CategoryID not found" });
    }

    const category = await Category.findById(id)

    await Category.findByIdAndUpdate(id, { 
      isDeleted: true, 
      name: category.name + "_deleted_" + Date.now() 
    });

    res.status(200).json({ success: true, message: "Category deleted", category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, image, attributes } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image, attributes },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found", });
    }

    const products = await Product.find({ categoryName: name });

    for (const product of products) {
      const productAttrs = Object.fromEntries(product.attributes || []);
      const updatedAttrs = {};

      attributes.forEach(attrKey => {
        if (productAttrs.hasOwnProperty(attrKey)) {
          updatedAttrs[attrKey] = productAttrs[attrKey];
        } else {
          updatedAttrs[attrKey] = "";
        }
      });

      product.attributes = new Map(Object.entries(updatedAttrs));

      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Category and related products updated successfully",
      data: category,
    });
  } catch (err) {
    console.error("Update Category Error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};
