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
        variants: productData.variants.map(v => {
          const originalPrice = Number(v.originalPrice) || 0;
          const gstRate = Number(v.gstRate ?? 18);
          const gstAmount = parseFloat(((originalPrice * gstRate) / 100).toFixed(2));
          const marginPercentage = v.marginPercentage ?? 0;
          const inRate = parseFloat((originalPrice + gstAmount).toFixed(2));
          const outRate = Math.round(inRate + (inRate * marginPercentage) / 100);

          return {
            ...v,
            discountType: v.discountType || "percentage",
            discountValue: v.discountValue ?? 0,
            imageUrls: v.images || [],
            imageFiles: [],
            gstRate,
            gstAmount,
            CGST: parseFloat((gstAmount / 2).toFixed(2)),
            SGST: parseFloat((gstAmount / 2).toFixed(2)),
            marginPercentage,
            InRate: inRate,
            OutRate: outRate,
            MrpPrice: v.MrpPrice || "",
          };
        }),
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

    // Recalculate whenever originalPrice, gstRate, or marginPercentage changes
    const originalPrice = parseFloat(field === "originalPrice" ? value : updatedVariants[index].originalPrice) || 0;
    const gstRate = parseFloat(field === "gstRate" ? value : updatedVariants[index].gstRate) || 0;
    const marginPercentage = parseFloat(field === "marginPercentage" ? value : updatedVariants[index].marginPercentage) || 0;

    const gstAmount = Math.round(((originalPrice * gstRate) / 100));
    const sgstAmount = Math.round((gstAmount / 2));
    const cgstAmount = Math.round((gstAmount / 2));
    const inRate = Math.round((originalPrice + gstAmount));
    const outRate = Math.round(inRate + (inRate * marginPercentage) / 100);

    updatedVariants[index].gstAmount = gstAmount || "";
    updatedVariants[index].SGST = sgstAmount || "";
    updatedVariants[index].CGST = cgstAmount || "";
    updatedVariants[index].InRate = inRate || "";
    updatedVariants[index].OutRate = outRate || "";

    if (field === "MrpPrice") {
      const mrp = parseFloat(value) || 0;
      if (outRate > 0 && mrp < outRate) {
        updatedVariants[index].mrpError = `MRP must be greater than Out Rate (₹${outRate})`;
      } else {
        updatedVariants[index].mrpError = "";
      }
    }

    if (field === "originalPrice" || field === "gstRate" || field === "marginPercentage") {
      const mrp = parseFloat(updatedVariants[index].MrpPrice) || 0;
      if (mrp && mrp < outRate) {
        updatedVariants[index].mrpError = `MRP must be greater than Out Rate (₹${outRate})`;
      } else {
        updatedVariants[index].mrpError = "";
      }
    }

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

      // ✅ Format variants 
      const formattedVariants = formData.variants.map((v) => ({
        _id: v._id,
        quantityValue: Number(v.quantityValue),
        quantityUnit: v.quantityUnit,
        originalPrice: Number(v.originalPrice),
        discountType: v.discountType || null,
        discountValue: Number(v.discountValue || 0),
        stock: Number(v.stock),
        images: v.imageUrls || [],
        gstRate: Number(v.gstRate || 0),
        gstAmount: Number(v.gstAmount || 0),
        CGST: Number(v.gstRate / 2 || 0),
        CGSTprice: Number(v.CGST || 0),
        SGST: Number(v.gstRate / 2 || 0),
        SGSTprice: Number(v.SGST || 0),
        marginPercentage: Number(v.marginPercentage || 0),
        InRate: Number(v.InRate || 0),
        OutRate: Number(v.OutRate || 0),
        MrpPrice: Number(v.MrpPrice || 0),
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
          <div className="relative">
            <input
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600 peer-focus:bg-white">
              Product Name
            </label>
          </div>
          <div className="relative">
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600 peer-focus:bg-white">
              Slug
            </label>
          </div>

          <div className="relative">
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
              Brand
            </label>
          </div>

          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
              Category
            </label>
          </div>

          <div className="relative">
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Subcategory</option>
              {filteredSubcategories.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
              Subcategory
            </label>
          </div>

          <div className="relative">
            <input
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
              Status
            </label>
          </div>
        </div>

        <div className="relative mt-4">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full border rounded-lg px-3 pt-5 pb-2 text-sm focus:outline-none focus:border-indigo-500"
          />
          <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
            Description
          </label>
        </div>

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

                <div className="relative">
                  <input
                    type="number"
                    value={variant.quantityValue || ""}
                    onChange={(e) => handleVariantChange(index, "quantityValue", e.target.value)}
                    placeholder=" "
                    className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all
    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
                    Quantity
                  </label>
                </div>


                <div className="relative">
                  <select
                    value={variant.quantityUnit || ""}
                    onChange={(e) => handleVariantChange(index, "quantityUnit", e.target.value)}
                    className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Unit</option>
                    {QUANTITY_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit || "None"}
                      </option>
                    ))}
                  </select>
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                    Unit
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={variant.originalPrice || ""}
                    onChange={(e) => handleVariantChange(index, "originalPrice", e.target.value)}
                    placeholder=" "
                    className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all
    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
                    Original Price
                  </label>
                </div>

                {/* Discount */}
                {/* <div className="flex flex-col sm:flex-row gap-2">
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
                </div> */}

                {/* GST Rate */}
                <div className="relative">
                  <div className="relative">
                    <select
                      value={variant.gstRate ?? ""}
                      onChange={(e) => handleVariantChange(index, "gstRate", Number(e.target.value))}
                      className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm bg-white focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                      <option value="">Select GST</option>
                      {GST_RATES.map((g) => (
                        <option key={g} value={g}>{g}%</option>
                      ))}
                    </select>
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                      GST Rate
                    </label>
                    {variant.gstRate !== "" && variant.originalPrice && (
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none">
                        ₹{variant.gstAmount || ""} ({variant.gstRate}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* CGST */}
                <div className="relative">
                  <div className="relative">
                    <input
                      readOnly
                      value={variant.CGST ? `₹ ${variant.CGST}` : ""}
                      placeholder={variant.gstRate ? `CGST @ ${variant.gstRate / 2}%` : "Select GST first"}
                      className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm bg-gray-50 outline-none  font-semibold"
                    />
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                      CGST
                    </label>
                    {variant.CGST && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none">
                        ({variant.gstRate / 2}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* SGST */}
                <div className="relative">
                  <div className="relative">
                    <input
                      readOnly
                      value={variant.SGST ? `₹ ${variant.SGST}` : ""}
                      placeholder={variant.gstRate ? `SGST @ ${variant.gstRate / 2}%` : "Select GST first"}
                      className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm bg-gray-50 outline-none  font-semibold"
                    />
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                      SGST
                    </label>
                    {variant.SGST && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none">
                        ({variant.gstRate / 2}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Margin % */}
                <div className="relative">
                  <input
                    type="number"
                    value={variant.marginPercentage || ""}
                    onChange={(e) => handleVariantChange(index, "marginPercentage", e.target.value)}
                    placeholder=" "
                    className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all
    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
                    Margin %
                  </label>
                </div>

                {/* InRate */}

                <div className="relative">
                  <input
                    type="number"
                    value={variant.InRate || ""}
                    onChange={(e) => handleVariantChange(index, "InRate", e.target.value)}
                    placeholder=" "
                    className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all
    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
                    In Rate
                  </label>
                </div>

                {/* Out Rate */}
                <div className="relative">
                  <input
                    readOnly
                    value={variant.OutRate || ""}
                    className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm bg-green-50 outline-none text-green-700 font-bold"
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                    Out Rate
                  </label>
                </div>

                {/* MRP Price */}
                <div className="relative">
                  <input
                    type="number"
                    value={variant.MrpPrice || ""}
                    onChange={(e) => handleVariantChange(index, "MrpPrice", e.target.value)}
                    placeholder=" "
                    min={variant.OutRate || 0}
                    className={`peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm focus:outline-none focus:border-indigo-500 ${variant.mrpError ? "border-red-500" : ""
                      }`}
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all
    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
                    MRP Price
                  </label>
                  {variant.mrpError && (
                    <p className="text-red-500 text-xs mt-1">{variant.mrpError}</p>
                  )}
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


                <div className="relative">
                  <input
                    type="number"
                    value={variant.stock || ""}
                    onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                    placeholder=" "
                    className="peer w-full border rounded-lg px-3 pt-2 pb-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all
    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
                    Stock
                  </label>
                </div>
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
            className="px-4 py-2 bg-gradient-to-r from-[#FF8800] to-[#FF6600] text-white rounded-lg w-full sm:w-auto"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
