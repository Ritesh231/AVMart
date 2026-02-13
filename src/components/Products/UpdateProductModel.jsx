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
  
  // Prefill
  useEffect(() => {
    if (productData) {
      setFormData({
        productName: productData.name || "",
        subtext: productData.subtext || "",
        description: productData.description || "",
        keyFeatures: productData.keyFeatures || "",
        wholesaleAdvantage: productData.wholesaleAdvantage || "",
        brand: productData.brand || "",
        category: productData.category?._id || "",
        subcategory: productData.subcategory?._id || "",
        categoryname: productData.category?.name || "",
        subcategoryname: productData.subcategory?.name|| "",
        status: productData.status || "active",
        // slug: productData.slug || "",
        primaryImage: null,
        variants: productData.variants || [],
      });
      setPreviewImage(productData.displayImage || null);
    }
  }, [productData]);

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
          <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand ID" className="border p-2 rounded-lg" />
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
              <input
  value={variant.label || ""}
  onChange={(e) =>
    handleVariantChange(index, "label", e.target.value)
  }
  placeholder="Label"
  className="border p-2 rounded"
/>

<input
  type="number"
  value={variant.quantityValue || ""}
  onChange={(e) =>
    handleVariantChange(index, "quantityValue", e.target.value)
  }
  placeholder="Quantity"
  className="border p-2 rounded"
/>

<input
  value={variant.quantityUnit || ""}
  onChange={(e) =>
    handleVariantChange(index, "quantityUnit", e.target.value)
  }
  placeholder="Unit (kg, ml, etc)"
  className="border p-2 rounded"
/>

<input
  type="number"
  value={variant.originalPrice || ""}
  onChange={(e) =>
    handleVariantChange(index, "originalPrice", e.target.value)
  }
  placeholder="Original Price"
  className="border p-2 rounded"
/>

<input
  type="number"
  value={variant.discountValue || ""}
  onChange={(e) =>
    handleVariantChange(index, "discountValue", e.target.value)
  }
  placeholder="Discount"
  className="border p-2 rounded"
/>

<select
  value={variant.discountType || "percent"}
  onChange={(e) =>
    handleVariantChange(index, e)
  }
  name="discountType"
  className="border p-2 rounded"
>
  <option value="percent">Percentage</option>
  <option value="fixed">Fixed</option>
</select>


<input
  type="number"
  value={variant.stock || ""}
  onChange={(e) =>
    handleVariantChange(index, "stock", e.target.value)
  }
  placeholder="Stock"
  className="border p-2 rounded"
/>

<input
  value={variant.sku || ""}
  onChange={(e) =>
    handleVariantChange(index, "sku", e.target.value)
  }
  placeholder="SKU"
  className="border p-2 rounded"
/>

<input
  type="number"
  value={variant.gstRate || ""}
  onChange={(e) =>
    handleVariantChange(index, "gstRate", e.target.value)
  }
  placeholder="GST Rate"
  className="border p-2 rounded"
/>


              </div>

              {/* Variant Image Upload */}
              <div className="mt-3">
                <label className="text-sm font-medium">Variant Image</label>

                <div className="border-dashed border-2 rounded-lg p-3 text-center mt-1 relative">
                  {variant.preview || variant.image ? (
                    <img
                      src={
                        variant.preview ||
                        (typeof variant.image === "string"
                          ? variant.image
                          : "")
                      }
                      alt="Variant Preview"
                      className="h-24 mx-auto object-contain"
                    />
                  ) : (
                    <p className="text-sm">Upload Image</p>
                  )}

                  <input
                    type="file"
                    onChange={(e) =>
                      handleVariantImageChange(index, e.target.files[0])
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={() => removeVariant(index)}
                className="text-red-500 text-sm mt-3"
              >
                Remove Variant
              </button>
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
