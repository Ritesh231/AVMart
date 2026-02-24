import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUpdateProductMutation } from "../../Redux/apis/productsApi";

export default function EditProductModal({
  isOpen,
  onClose,
  productData,
}) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  
  const [formData, setFormData] = useState({
    productName: "",
    subtext: "",
    description: "",
    keyFeatures: "",
    wholesaleAdvantage: "",
    brand: "",
    category: "",
    subcategory: "",
    categoryname: "",
    subcategoryname: "",
    status: "active",
    slug: "",
    primaryImage: null,
    variants: [],
  });
   
  const [previewImage, setPreviewImage] = useState(null);

useEffect(() => {
  if (productData) {
    setFormData({
      productName: productData.productName || "",
      subtext: productData.subtext || "",
      description: productData.description || "",
      keyFeatures: productData.keyFeatures || [],
      wholesaleAdvantage: productData.wholesaleAdvantage || "",
      brand: productData.brand?._id || "",
      brandname: productData.brand?.name || "",
      category: productData.category?._id || "",
      categoryname: productData.category?.name || "",
      subcategory: productData.subcategory?._id || "",
      subcategoryname: productData.subcategory?.name || "",
      status: productData.status || "active",
      slug: productData.slug || "",
      origin: productData.origin || "",
      shelfLife: productData.shelfLife || "",
      storage: productData.storage || "",
      primaryImage: null,
      variants: productData.variants.map(v => ({
        ...v,
        discountType: v.discountType || "percentage",
        discountValue: v.discountValue ?? 0,
        gstRate: v.gstRate ?? 18,
      })),
    });

    setPreviewImage(productData.primaryImages?.[0] || null);
  }
}, [productData]);

  const QUANTITY_UNITS = ["ml", "l", "g", "kg", "piece", "dozen", "pack", "box", ""];
  const GST_RATES = [0, 3, 5, 12, 18, 28];

  // Handle normal input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "primaryImage") {
      const file = files[0];
      setFormData({ ...formData, primaryImage: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Variant change
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Variant image upload
  const handleVariantImageChange = (index, file) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index].image = file;
    updatedVariants[index].preview = URL.createObjectURL(file);

    setFormData({ ...formData, variants: updatedVariants });
  };
  
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: "", price: "", stock: "", sku: "", image: null },
      ],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      // Basic Fields
      data.append("productName", formData.productName);
      data.append("subtext", formData.subtext);
      data.append("description", formData.description);
      data.append("keyFeatures", formData.keyFeatures); // send as string
      data.append("wholesaleAdvantage", formData.wholesaleAdvantage);
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("status", formData.status);
      data.append("slug", formData.slug);

      // Primary Image (plural name!)
      if (formData.primaryImage instanceof File) {
        data.append("primaryImages", formData.primaryImage);
      }

      // Variants
      const cleanedVariants = formData.variants.map((v) => ({
        quantityValue: Number(v.quantityValue),
        quantityUnit: v.quantityUnit,
        originalPrice: Number(v.originalPrice),
        discountType: v.discountType || "percent",
        discountValue: Number(v.discountValue || 0),
        gstRate: Number(v.gstRate || 18),
        stock: Number(v.stock),
        sku: v.sku,
        images: v.images || [],
      }));

      data.append("variants", JSON.stringify(cleanedVariants));

      await updateProduct({
        id: productData._id,
        body: data,
      }).unwrap();

      toast.success("Product Updated Successfully");
      onClose();
    } catch (err) {
      toast.error(err.message || "Update Failed");
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-[800px] p-6 shadow-xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-bold mb-4">Edit Product</h2>

        {/* Basic Fields */}
        <div className="grid grid-cols-2 gap-3">
          <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" className="border p-2 rounded-lg" />
          <input name="slug" value={formData.slug} onChange={handleChange} placeholder="Slug" className="border p-2 rounded-lg" />
          <input name="brand" value={formData.brandname} onChange={handleChange} placeholder="Brand ID" className="border p-2 rounded-lg" />
          <input name="category" value={formData.categoryname} onChange={handleChange} placeholder="Category ID" className="border p-2 rounded-lg" />
          <input name="subcategory" value={formData.subcategoryname} onChange={handleChange} placeholder="Subcategory ID" className="border p-2 rounded-lg" />
          <input name="status" value={formData.status} onChange={handleChange} placeholder="Status" className="border p-2 rounded-lg" />
        </div>

        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded-lg mt-3" />
        <div className="grid grid-cols-3 gap-3 mt-3">
          <input
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Origin"
            className="border p-2 rounded"
          />

          <input
            name="shelfLife"
            value={formData.shelfLife}
            onChange={handleChange}
            placeholder="Shelf Life"
            className="border p-2 rounded"
          />

          <input
            name="storage"
            value={formData.storage}
            onChange={handleChange}
            placeholder="Storage Info"
            className="border p-2 rounded"
          />
        </div>

        {/* Main Image Upload */}
        <div className="mt-4">
          <label className="font-medium">Main Product Image</label>

          <div className="border-dashed border-2 rounded-lg p-4 text-center mt-2 relative">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="h-32 mx-auto object-contain" />
            ) : (
              <p>Click to upload image</p>
            )}

            <input
              type="file"
              name="primaryImage"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Variants Section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Variants</h3>

          {formData.variants.map((variant, index) => (
            <div key={index} className="border p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Quantity Value */}
                <input
                  type="number"
                  value={variant.quantityValue || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "quantityValue", e.target.value)
                  }
                  placeholder="Quantity"
                  className="border p-2 rounded"
                />

                {/* Quantity Unit Dropdown */}
                <select
                  value={variant.quantityUnit || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "quantityUnit", e.target.value)
                  }
                  className="border p-2 rounded"
                >
                  <option value="">Select Unit</option>
                  {QUANTITY_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit || "None"}
                    </option>
                  ))}
                </select>

                {/* Original Price */}
                <input
                  type="number"
                  value={variant.originalPrice || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "originalPrice", e.target.value)
                  }
                  placeholder="Original Price"
                  className="border p-2 rounded"
                />
                 
                {/* Discount Value */}
                <div className="flex items-center gap-2">
                  {/* Discount Value Input */}
                  <div className="relative w-full">
                    <input
                      type="number"
                      value={variant.discountValue || ""}
                      onChange={(e) => {
                        let value = Number(e.target.value);

                        // Limit to 100 if percentage
                        if (variant.discountType === "percentage" && value > 100) {
                          value = 100;
                        }

                        handleVariantChange(index, "discountValue", value);
                      }}
                      placeholder="Discount"
                      className={`border p-2 rounded w-full ${variant.discountType === "percentage" ? "pr-8" : ""
                        }`} // Add padding-right for % sign
                    />
                    
                    {/* % sign inside input */}
                    {variant.discountType === "percentage" && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        %
                      </span>
                    )}
                  </div>
                  
                  {/* Discount Type Dropdown */}
                  <select
                    value={variant.discountType || "percentage"}
                    onChange={(e) =>
                      handleVariantChange(index, "discountType", e.target.value)
                    }
                    className="border p-2 rounded"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>

                {/* Stock */}
                <input
                  type="number"
                  value={variant.stock || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  placeholder="Stock"
                  className="border p-2 rounded"
                />

                {/* SKU */}
                <input
                  value={variant.sku || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "sku", e.target.value)
                  }
                  placeholder="SKU"
                  className="border p-2 rounded"
                />

                {/* GST Rate Dropdown */}
                <select
                  value={variant.gstRate ?? ""}
                  onChange={(e) =>
                    handleVariantChange(index, "gstRate", Number(e.target.value))
                  }
                  className="border p-2 rounded"
                >
                  {/* Placeholder option */}
                  <option value="" disabled>
                    Select GST Rate
                  </option>

                  {/* Actual GST options */}
                  {GST_RATES.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}%
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}


          <button
            onClick={addVariant}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            + Add Variant
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
