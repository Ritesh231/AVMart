import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  useAddProductMutation,
  useGetallSubcategoriesQuery,
  useGetallBrandsQuery,
  useGetallcategoriesQuery,
  useSearchPartyQuery,
} from "../../Redux/apis/productsApi";
import { toast } from "react-toastify";
import { IoIosCloudUpload } from "react-icons/io";
import { useNavigate } from "react-router-dom";

/* -------------------- Reusable Fields -------------------- */

const InputField = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <input
      {...props}
      className={`w-full mt-1 px-3 py-2 text-sm border ${error ? 'border-red-500' : 'border-gray-200'
        } rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const TextareaField = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <textarea
      rows="3"
      {...props}
      className={`w-full mt-1 px-3 py-2 text-sm border ${error ? 'border-red-500' : 'border-gray-200'
        } rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, options, error, ...props }) => (
  <div>
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <select
      {...props}
      className={`w-full mt-1 px-3 py-2 text-sm border ${error ? 'border-red-500' : 'border-gray-200'
        } rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none`}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

/* -------------------- Main Component -------------------- */

export default function AddProduct() {
  const [partySearch, setPartySearch] = useState("");
  const [selectedParty, setSelectedParty] = useState(null);
  const [addProduct, { isLoading }] = useAddProductMutation();

  const { data: subcategoryData } = useGetallSubcategoriesQuery();
  const { data: brandData } = useGetallBrandsQuery();
  const { data: categoryData } = useGetallcategoriesQuery();
  const { data: partyData } = useSearchPartyQuery(partySearch, {
    skip: !partySearch,
  });

  const partyList = partyData?.data || [];
  const [isNewParty, setIsNewParty] = useState(false);

  const subcategories = subcategoryData?.data || [];
  const brands = brandData?.data || [];
  const categories = categoryData?.data || [];

  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleRemoveBg = async (type = "primary", index = null) => {
    let file;

    if (type === "primary") {
      file = watch("primaryImages")?.[0];
    } else if (type === "variant") {
      file = variants[index]?.imageFiles?.[0];
    }

    if (!file) {
      return toast.error("Please upload image first");
    }

    try {
      setIsRemovingBg(true);

      const formData = new FormData();
      formData.append("image_file", file);

      const res = await fetch(import.meta.env.VITE_REMOVE_BG_API, {
        method: "POST",
        headers: {
          "X-Api-Key": import.meta.env.VITE_REMOVE_BG_API_KEY,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(errText);
        throw new Error("Remove.bg failed");
      }

      const blob = await res.blob();
      const newFile = new File([blob], "no-bg.png", { type: "image/png" });

      if (type === "primary") {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        const newFileList = dataTransfer.files;

        // Update the form value
        setValue("primaryImages", newFileList, {
          shouldValidate: true,
          shouldDirty: true,
        });

        // ✅ IMPORTANT: Sync the hidden file input with the new FileList
        // This prevents react-hook-form from resetting the field to empty on re-render
        const fileInput = document.getElementById("primaryImage");
        if (fileInput) {
          fileInput.files = newFileList;
        }

        // Update preview
        setPreview(URL.createObjectURL(newFile));

        // ✅ Manually trigger validation
        await trigger("primaryImages");

      } else {
        const updated = [...variants];
        updated[index].imageFiles = [newFile];
        updated[index].previewImages = [URL.createObjectURL(newFile)];

        // ✅ Sync variant DOM input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        const fileInput = document.getElementById(`variantImages-${index}`);
        if (fileInput) {
          fileInput.files = dataTransfer.files;
        }

        setVariants(updated);
      }

      toast.success("Background Removed ✅");

    } catch (err) {
      console.error(err);
      toast.error("Failed to remove background ❌");
    } finally {
      setIsRemovingBg(false);
    }
  };
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  /* -------------------- Main Form -------------------- */
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      subtext: "",
      description: "",
      keyFeatures: "",
      wholesaleAdvantage: "",
      brand: "",
      category: "",
      subcategory: "",
      status: "active",
      primaryImages: null,
    },
  });

  /* -------------------- Filter Subcategory -------------------- */
  const selectedCategory = watch("category");

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories.filter(
      (sub) => sub.CategoryId === selectedCategory
    );
  }, [selectedCategory, subcategories]);

  /* -------------------- Variants -------------------- */
  const [variants, setVariants] = useState([
    {
      quantityValue: "",
      quantityUnit: "",
      originalPrice: "",
      discountType: "",
      discountValue: "",
      gstRate: "",
      stock: "",
      marginPercentage: "",
      InRate: "",
      // sku: "",
      imageFiles: [], // For storing file objects
      imageUrls: [], // For storing URLs (if you have them)
      previewImages: [], // For preview
    },
  ]);

  /* -------------------- Variant Logic -------------------- */
  const handleVariantChange = (index, e) => {
    const updated = [...variants];
    let { name, value } = e.target;

    // ✅ Restrict marginPercentage
    if (name === "marginPercentage") {
      if (value > 100) value = 100;
      if (value < 0) value = 0;
    }

    updated[index][name] = value;
    setVariants(updated);
  };

  const handleVariantImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updated = [...variants];

    // Store the actual file objects in imageFiles
    updated[index].imageFiles = files;

    // Create preview URLs
    updated[index].previewImages = files.map((file) =>
      URL.createObjectURL(file)
    );

    // For now, keep imageUrls empty since you don't have URLs yet
    updated[index].imageUrls = [];

    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        quantityValue: "",
        quantityUnit: "",
        originalPrice: "",
        discountType: "percent",
        discountValue: "",
        gstRate: "",
        marginPercentage: "",
        InRate: "",
        stock: "",
        // sku: "",
        imageFiles: [],
        imageUrls: [],
        previewImages: [],
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  /* -------------------- Submit -------------------- */
  const onSubmit = async (data) => {
    const formData = data;

    /* ---------------- REQUIRED FIELD VALIDATION ---------------- */
    if (!formData.productName?.trim()) return toast.error("Product Name is required");
    if (!formData.brand) return toast.error("Brand is required");
    if (!formData.category) return toast.error("Category is required");
    if (!variants.length) return toast.error("At least one variant required");

    if (!isNewParty && !selectedParty) {
      return toast.error("Please select a Party");
    }

    // Validate variants
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.quantityValue || !v.quantityUnit) return toast.error(`Variant ${i + 1}: Quantity required`);
      if (!v.originalPrice) return toast.error(`Variant ${i + 1}: Original Price required`);

      if ((!v.imageFiles || v.imageFiles.length === 0) && (!v.imageUrls || v.imageUrls.length === 0)) {
        return toast.error(`Variant ${i + 1}: Image is required`);
      }
    }

    try {
      const submitData = new FormData();

      // 1. Append basic product fields
      submitData.append("productName", formData.productName.trim());
      submitData.append("subtext", formData.subtext?.trim() || "");
      submitData.append("description", formData.description?.trim() || "");
      submitData.append("keyFeatures", formData.keyFeatures?.trim() || "");
      submitData.append("wholesaleAdvantage", formData.wholesaleAdvantage?.trim() || "");
      submitData.append("brand", formData.brand);
      submitData.append("category", formData.category);
      submitData.append("subcategory", formData.subcategory || "");
      submitData.append("status", formData.status);

      // ✅ FIXED: Handle Party data properly
      if (!isNewParty && selectedParty) {
        // For existing party - send just the ID
        submitData.append("Party", selectedParty._id);
      } else if (isNewParty && data.newParty) {

        submitData.append("Party[PartName]", data.newParty?.name || "");
        submitData.append("Party[contactPerson]", data.newParty?.contactPerson || "");
        submitData.append("Party[phone]", data.newParty?.phone || "");
        submitData.append("Party[GSTin]", data.newParty?.GSTin || "");
        submitData.append("Party[PAN]", data.newParty?.PAN || "");
        submitData.append("Party[BillingAddress]", data.newParty?.address || "");
        submitData.append("Party[statePinCode]", data.newParty?.statePinCode || "");
        submitData.append("Party[placeOfSupply]", data.newParty?.placeOfSupply || "");

        // Option 2: Send as JSON string but backend needs to parse it
        // If backend expects a JSON string, uncomment below:
        /*
        submitData.append("Party", JSON.stringify({
          PartName: data.newParty?.name || "",
          contactPerson: data.newParty?.contactPerson || "",
          phone: data.newParty?.phone || "",
          GSTin: data.newParty?.GSTin || "",
          PAN: data.newParty?.PAN || "",
          BillingAddress: data.newParty?.address || "",
          statePinCode: data.newParty?.statePinCode || "",
          placeOfSupply: data.newParty?.placeOfSupply || "",
        }));
        */
      }

      // 2. Clear out primary images (Frontend files)
      if (formData.primaryImages && formData.primaryImages[0]) {
        submitData.append("primaryImages", formData.primaryImages[0]);
      }

      // 3. Format variants JSON (keeping existing URLs)
      const formattedVariants = variants.map((v) => ({
        _id: v._id,
        quantityValue: Number(v.quantityValue),
        quantityUnit: v.quantityUnit,
        originalPrice: Number(v.originalPrice),
        gstRate: v.gstRate,
        discountType: v.discountType || null,
        discountValue: Number(v.discountValue || 0),
        stock: Number(v.stock),
        marginPercentage: Number(v.marginPercentage || 0),
        InRate: Number(v.InRate || 0),
        images: v.imageUrls || []
      }));

      submitData.append("variants", JSON.stringify(formattedVariants));

      // 4. Append new variant image files
      variants.forEach((v, index) => {
        if (v.imageFiles && v.imageFiles.length > 0) {
          v.imageFiles.forEach((file) => {
            submitData.append(`variantImage_${index}`, file);
          });
        }
      });

      // 5. API Call
      const response = await addProduct(submitData).unwrap();
      toast.success("Product Added Successfully ✅");
      navigate("/products/all");

    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.data?.message || "Failed to process product ❌");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="bg-[#F8FAFC] py-6 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md border">
        <div className="px-5 py-3 border-b bg-[#1E264F] rounded-t-xl">
          <h2 className="text-white font-semibold text-lg">
            Add New Product
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">

          {/* -------------------- Party Section -------------------- */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsNewParty(false)}
              className={`px-3 py-1 text-xs rounded ${!isNewParty ? "bg-[#1E264F] text-white" : "bg-gray-200"}`}
            >
              Select Existing
            </button>

            <button
              type="button"
              onClick={() => setIsNewParty(true)}
              className={`px-3 py-1 text-xs rounded ${isNewParty ? "bg-[#1E264F] text-white" : "bg-gray-200"}`}
            >
              Add New Party
            </button>
          </div>

          {!isNewParty && (
            <>
              <input
                type="text"
                placeholder="Search Party"
                value={partySearch}
                onChange={(e) => {
                  setPartySearch(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />

              {showDropdown && partyList.length > 0 && (
                <div className="border rounded-lg max-h-40 overflow-y-auto bg-white shadow">
                  {partyList.map((party) => (
                    <div
                      key={party._id}
                      onClick={() => {
                        setSelectedParty(party);
                        setPartySearch(party.PartName);
                        setShowDropdown(false);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                    >
                      {party.PartName} ({party.phone})
                    </div>
                  ))}
                </div>
              )}
              {selectedParty && (
                <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded text-sm">
                  ✅ Selected: {selectedParty.PartName}
                </div>
              )}
            </>
          )}

          {isNewParty && (
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Party Name" {...register("newParty.name")} />
              <InputField label="Contact Person" {...register("newParty.contactPerson")} />
              <InputField label="Phone" {...register("newParty.phone")} />
              <InputField label="GST" {...register("newParty.GSTin")} />
              <InputField label="Address" {...register("newParty.address")} />
              <InputField label="PAN" {...register("newParty.PAN")} />
              <InputField label="State + PinCode" {...register("newParty.statePinCode")} />
              <InputField label="Place of Supply" {...register("newParty.placeOfSupply")} />
            </div>
          )}

          <div className="space-y-2">
            {/* Section Title */}
            <h3 className="font-semibold text-gray-700 text-lg">
              Product Details
            </h3>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <InputField
                label="Product Name"
                error={errors.productName?.message}
                {...register("productName", { required: "Product Name is required" })}
              />

              <InputField
                label="Subtext"
                error={errors.subtext?.message}
                {...register("subtext")}
              />

              <SelectField
                label="Brand"
                options={brands}
                error={errors.brand?.message}
                {...register("brand", { required: "Brand is required" })}
              />

              <SelectField
                label="Category"
                options={categories}
                error={errors.category?.message}
                {...register("category", { required: "Category is required" })}
              />

              <SelectField
                label="Subcategory"
                options={filteredSubcategories}
                error={errors.subcategory?.message}
                {...register("subcategory",)}
              />

              {/* Main Image */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Primary Image <span className="text-red-500">*</span>
                </label>

                {/* Upload Box */}
                <label
                  htmlFor="primaryImage"
                  className={`mt-1 flex flex-col items-center justify-center 
      border-2 border-dashed rounded-lg h-28 cursor-pointer transition
      ${errors.primaryImages
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-[#00E5B0]'
                    }`}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="h-20 object-contain"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v-8m0 0L9 7m3-3l3 3"
                        />
                      </svg>
                      <span className="text-xs text-gray-400 mt-1">
                        Click to Upload
                      </span>
                    </>
                  )}
                </label>

                {/* Hidden Input */}
                <input
                  id="primaryImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("primaryImages", {
                    required: "Primary Image is required",
                    validate: (files) => {
                      if (!files || files.length === 0) {
                        return "Primary Image is required";
                      }
                      return true;
                    },
                    onChange: (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    },
                  })}
                />

                {errors.primaryImages && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.primaryImages.message}
                  </p>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveBg("primary")}
                    disabled={isRemovingBg}
                    className="text-xs px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isRemovingBg ? "Processing..." : "Remove Background"}
                  </button>
                </div>
              </div>


            </div>

            {/* Textareas */}
            <div className="space-y-4">
              <TextareaField
                label="Description"
                error={errors.description?.message}
                {...register("description")}
              />

              <TextareaField
                label="Key Features (Comma separated)"
                error={errors.keyFeatures?.message}
                {...register("keyFeatures")}
              />

              <TextareaField
                label="Wholesale Advantage"
                error={errors.wholesaleAdvantage?.message}
                {...register("wholesaleAdvantage")}
              />
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Product Variants</h3>

            {variants.map((variant, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <InputField
                    label="Product Size"
                    name="quantityValue"
                    placeholder="e.g. 300"
                    value={variant.quantityValue}
                    onChange={(e) => handleVariantChange(index, e)}
                  />

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Product Unit
                    </label>
                    <select name="quantityUnit"
                      value={variant.quantityUnit}
                      onChange={(e) => handleVariantChange(index, e)}
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none">
                      <option value="">Select</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="piece">piece</option>
                      <option value="dozen">dozen</option>
                      <option value="pack">pack</option>
                      <option value="box">box</option>
                    </select>
                  </div>

                  <InputField
                    label="Original Price"
                    name="originalPrice"
                    placeholder="Value should be Number"
                    type="number"
                    value={variant.originalPrice}
                    onChange={(e) => handleVariantChange(index, e)}
                  />


                  {/* <div>
                    <label className="text-xs font-medium text-gray-600">
                      Discount Type
                    </label>
                    <select
                      name="discountType"
                      value={variant.discountType}
                      onChange={(e) => handleVariantChange(index, e)}
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none"
                    >
                      <option value="">None</option>
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat</option>
                    </select>
                  </div>

                  <InputField
                    label="Discount Value"
                    name="discountValue"
                    placeholder="Value should be Number"
                    type="number"
                    value={variant.discountValue}
                    onChange={(e) => handleVariantChange(index, e)}
                    min={0}
                    max={variant.discountType === "percentage" ? 100 : undefined}
                    onInput={(e) => {
                      if (variant.discountType === "percentage" && e.target.value > 100) {
                        e.target.value = 100;
                      }
                    }}
                  /> */}

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      GST Rate
                    </label>
                    <select
                      name="gstRate"
                      value={variant.gstRate}
                      onChange={(e) => handleVariantChange(index, e)}
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none"
                    >
                      <option value="">Select</option>
                      <option value="0">0%</option>
                      <option value="3">3%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>

                  <InputField
                    label="Stock"
                    name="stock"
                    type="number"
                    placeholder="Value should be a Number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, e)}
                  />

                  <InputField
                    label="Margin %"
                    name="marginPercentage"
                    type="number"
                    placeholder="Enter margin %"
                    value={variant.marginPercentage}
                    onChange={(e) => handleVariantChange(index, e)}
                    min={0}
                    max={100}
                    onInput={(e) => {
                      if (e.target.value > 100) {
                        e.target.value = 100;
                      }
                    }}
                  />

                  <InputField
                    label="In Rate"
                    name="InRate"
                    type="number"
                    placeholder="Enter In Rate"
                    value={variant.InRate}
                    onChange={(e) => handleVariantChange(index, e)}
                  />

                  {/* <InputField
                    label="SKU"
                    name="sku"
                    placeholder="SOAP-3PACK"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, e)}
                  /> */}
                </div>

                {/* Variant Images */}
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Variant Images
                  </label>

                  <div className="mt-2">
                    {/* Hidden Input */}
                    <input
                      id={`variantImages-${index}`}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleVariantImageChange(index, e)}
                    />

                    {/* Upload / Preview Box */}
                    <label
                      htmlFor={`variantImages-${index}`}
                      className="w-32 h-32 border-2 border-dashed border-gray-300 
      rounded-lg cursor-pointer hover:border-[#00E5B0] 
      flex items-center justify-center overflow-hidden relative"
                    >
                      {variant.previewImages?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 p-1 overflow-auto">
                          {variant.previewImages.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="variant"
                              className="w-12 h-12 object-cover rounded"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <IoIosCloudUpload className="text-2xl text-gray-400" />
                          <span className="text-[10px] text-gray-400 mt-1 text-center">
                            Upload
                          </span>
                        </div>
                      )}
                    </label>

                  </div>

                  <div className="flex gap-2 mt-2 w-96">
                    <button
                      type="button"
                      onClick={() => handleRemoveBg("variant", index)}
                      disabled={isRemovingBg}
                      className="text-xs px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isRemovingBg ? "Processing..." : "Remove Background"}
                    </button>
                  </div>
                </div>

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove Variant
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="bg-[#1E264F] text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90"
            >
              + Add Variant
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#00E5B0] text-white px-5 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


