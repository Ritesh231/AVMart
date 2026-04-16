import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useUpdateProductMutation, useGetallSubcategoriesQuery, useGetallBrandsQuery,
  useGetallcategoriesQuery,
} from "../../Redux/apis/productsApi";
import { IoCloudUploadSharp } from "react-icons/io5";

export default function EditProductModal({
  isOpen,
  onClose,
  productData,
}) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { data: subcategoryData } = useGetallSubcategoriesQuery();
  const { data: brandData } = useGetallBrandsQuery();
  const { data: categoryData } = useGetallcategoriesQuery();
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const subcategories = subcategoryData?.data || [];
  const brands = brandData?.data || [];
  const categories = categoryData?.data || [];

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

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.CategoryId === formData.category
  );

  const [previewImage, setPreviewImage] = useState(null);

  const removeExistingImage = (variantIndex, imgIndex) => {
    const updatedVariants = [...formData.variants];

    updatedVariants[variantIndex].imageUrls =
      updatedVariants[variantIndex].imageUrls.filter((_, i) => i !== imgIndex);

    setFormData({ ...formData, variants: updatedVariants });
  };

  const removeNewImage = (variantIndex, imgIndex) => {
    const updatedVariants = [...formData.variants];

    updatedVariants[variantIndex].imageFiles =
      updatedVariants[variantIndex].imageFiles.filter((_, i) => i !== imgIndex);

    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleRemoveBg = async (type = "primary", index = null) => {
    let file;

    if (type === "primary") {
      if (formData.primaryImage) {
        file = formData.primaryImage;
      } else if (previewImage) {
        const res = await fetch(previewImage);
        const blob = await res.blob();
        file = new File([blob], "primary.png", { type: blob.type });
      }
    }

    // ✅ ADD THIS BLOCK FOR VARIANT
    else if (type === "variant") {
      const variant = formData.variants[index];

      // ✅ New uploaded file
      if (variant?.imageFiles?.length > 0) {
        file = variant.imageFiles[0];
      }

      // ✅ Existing image URL → convert to file
      else if (variant?.imageUrls?.length > 0) {
        const res = await fetch(variant.imageUrls[0]);
        const blob = await res.blob();
        file = new File([blob], "variant.png", { type: blob.type });
      }
    }

    if (!file) {
      return toast.error("Upload image first");
    }

    try {
      setIsRemovingBg(true);

      const fd = new FormData();
      fd.append("image_file", file);

      const res = await fetch(import.meta.env.VITE_REMOVE_BG_API, {
        method: "POST",
        headers: {
          "X-Api-Key": import.meta.env.VITE_REMOVE_BG_API_KEY,
        },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        throw new Error("Remove BG failed");
      }

      const blob = await res.blob();
      const newFile = new File([blob], "no-bg.png", {
        type: "image/png",
      });

      // ✅ UPDATE VARIANT IMAGE PROPERLY
      if (type === "variant") {
        const updated = [...formData.variants];

        updated[index].imageFiles = [newFile]; // replace with new bg removed file
        updated[index].imageUrls = []; // optional: clear old URL

        setFormData({
          ...formData,
          variants: updated,
        });
      }

      toast.success("Background Removed ✅");
    } catch (err) {
      console.error(err);
      toast.error("Remove BG Failed ❌");
    } finally {
      setIsRemovingBg(false);
    }
  };

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
        // origin: productData.origin || "",
        // shelfLife: productData.shelfLife || "",
        // storage: productData.storage || "",
        primaryImage: null,
        variants: productData.variants.map(v => ({
          ...v,
          discountType: v.discountType || "percentage",
          discountValue: v.discountValue ?? 0,
          imageUrls: v.images || [],
          imageFiles: [],
          // gstRate: v.gstRate ?? 18,
        })),
      });

      setPreviewImage(productData.primaryImages?.[0] || null);
    }
  }, [productData]);

  const QUANTITY_UNITS = ["ml", "l", "g", "kg", "piece", "dozen", "pack", "box", ""];
  // const GST_RATES = [0, 3, 5, 12, 18, 28];

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
  const handleVariantImageChange = (index, files) => {
    const updatedVariants = [...formData.variants];

    updatedVariants[index].imageFiles = [
      ...(updatedVariants[index].imageFiles || []),
      ...Array.from(files),
    ];

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
      const submitData = new FormData();

      // Basic fields
      submitData.append("productName", formData.productName);
      submitData.append("subtext", formData.subtext || "");
      submitData.append("description", formData.description || "");
      submitData.append("keyFeatures", formData.keyFeatures || "");
      submitData.append("wholesaleAdvantage", formData.wholesaleAdvantage || "");
      submitData.append("brand", formData.brand);
      submitData.append("category", formData.category);
      submitData.append("subcategory", formData.subcategory || "");
      submitData.append("status", formData.status);
      submitData.append("slug", formData.slug);

      // Primary Image
      if (formData.primaryImage instanceof File) {
        submitData.append("primaryImages", formData.primaryImage);
      }

      // ✅ Format variants (KEEP EXISTING URLS)
      const formattedVariants = formData.variants.map((v) => ({
        _id: v._id,
        quantityValue: Number(v.quantityValue),
        quantityUnit: v.quantityUnit,
        originalPrice: Number(v.originalPrice),
        discountType: v.discountType || null,
        discountValue: Number(v.discountValue || 0),
        stock: Number(v.stock),
        images: v.imageUrls || [], // ✅ IMPORTANT
      }));

      submitData.append("variants", JSON.stringify(formattedVariants));

      // ✅ Upload new files separately
      formData.variants.forEach((v, index) => {
        if (v.imageFiles?.length > 0) {
          v.imageFiles.forEach((file) => {
            submitData.append(`variantImage_${index}`, file);
          });
        }
      });

      await updateProduct({
        id: productData._id,
        body: submitData,
      }).unwrap();

      toast.success("Product Updated Successfully ✅");
      onClose();

    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Update Failed ❌");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">

      <div className="bg-white rounded-xl w-full max-w-3xl p-4 sm:p-6 shadow-xl max-h-[95vh] overflow-y-auto">

        <h2 className="text-base sm:text-lg font-bold mb-4">Edit Product</h2>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" className="border p-2 rounded-lg text-sm" />
          <input name="slug" value={formData.slug} onChange={handleChange} placeholder="Slug" className="border p-2 rounded-lg text-sm" />

          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            name="category"
            value={formData.category}
            onChange={(e) => {
              setFormData({
                ...formData,
                category: e.target.value,
                subcategory: ""
              });
            }}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="">Select Subcategory</option>
            {filteredSubcategories.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <input name="status" value={formData.status} onChange={handleChange} placeholder="Status" className="border p-2 rounded-lg text-sm" />
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded-lg mt-3 text-sm"
        />

        {/* Main Image Upload */}
        <div className="mt-4">
          <label className="font-medium text-sm">Main Product Image</label>

          <div className="border-dashed border-2 rounded-lg p-3 sm:p-4 text-center mt-2 relative">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="h-24 sm:h-32 mx-auto object-contain" />
            ) : (
              <p className="text-sm">Click to upload image</p>
            )}

            <input
              type="file"
              name="primaryImage"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleRemoveBg("primary")}
              disabled={isRemovingBg}
              className="text-xs px-3 py-1 rounded-md bg-yellow-500 text-white w-full sm:w-auto"
            >
              {isRemovingBg ? "Processing..." : "Remove Background"}
            </button>
          </div>
        </div>

        {/* Variants Section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-sm sm:text-base">Variants</h3>

          {formData.variants.map((variant, index) => (
            <div key={index} className="border p-3 sm:p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <input
                  type="number"
                  value={variant.quantityValue || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "quantityValue", e.target.value)
                  }
                  placeholder="Quantity"
                  className="border p-2 rounded text-sm"
                />

                <select
                  value={variant.quantityUnit || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "quantityUnit", e.target.value)
                  }
                  className="border p-2 rounded text-sm"
                >
                  <option value="">Select Unit</option>
                  {QUANTITY_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit || "None"}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={variant.originalPrice || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "originalPrice", e.target.value)
                  }
                  placeholder="Original Price"
                  className="border p-2 rounded text-sm"
                />

                {/* Discount */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative w-full">
                    <input
                      type="number"
                      value={variant.discountValue || ""}
                      onChange={(e) => {
                        let value = Number(e.target.value);
                        if (variant.discountType === "percentage" && value > 100) {
                          value = 100;
                        }
                        handleVariantChange(index, "discountValue", value);
                      }}
                      placeholder="Discount"
                      className={`border p-2 rounded w-full text-sm ${variant.discountType === "percentage" ? "pr-8" : ""}`}
                    />

                    {variant.discountType === "percentage" && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        %
                      </span>
                    )}
                  </div>

                  <select
                    value={variant.discountType || "percentage"}
                    onChange={(e) =>
                      handleVariantChange(index, "discountType", e.target.value)
                    }
                    className="border p-2 rounded text-sm w-full sm:w-auto"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>

                {/* Images */}
                <div className="mt-3">
                  <label className="text-sm font-medium">Variant Images</label>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {variant.imageUrls?.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} alt="variant" className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index, i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {variant.imageFiles?.map((file, i) => (
                      <div key={i} className="relative">
                        <img src={URL.createObjectURL(file)} alt="preview" className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index, i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded cursor-pointer text-sm w-full sm:w-auto justify-center">
                    <IoCloudUploadSharp size={20} />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        handleVariantImageChange(index, e.target.files)
                      }
                    />
                  </label>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveBg("variant", index)}
                      disabled={isRemovingBg}
                      className="text-xs px-3 py-1 rounded-md bg-yellow-500 text-white w-full sm:w-auto"
                    >
                      {isRemovingBg ? "Processing..." : "Remove Background"}
                    </button>
                  </div>
                </div>

                <input
                  type="number"
                  value={variant.stock || ""}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  placeholder="Stock"
                  className="border rounded text-sm px-2 py-1.5 sm:py-2 h-9 sm:h-10"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addVariant}
            className="px-4 py-2 bg-green-500 text-white rounded-lg w-full sm:w-auto"
          >
            + Add Variant
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg w-full sm:w-auto">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg w-full sm:w-auto"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
