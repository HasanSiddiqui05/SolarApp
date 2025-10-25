import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      index: true,
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    displayName: {
      type: String,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("attributes")) {
    const attrs = Object.fromEntries(this.attributes);
    const excludedKeys = ["stock", "price"];

    const nameParts = Object.entries(attrs)
      .filter(([key, value]) => !excludedKeys.includes(key.toLowerCase()) && value && value.trim() !== "" )
      .map(([_, value]) => value.trim());

    if (nameParts.length > 1) {
      this.displayName = nameParts.join(" - ");
    }
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
