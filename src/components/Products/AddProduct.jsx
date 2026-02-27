import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  useAddProductMutation,
  useGetallSubcategoriesQuery,
  useGetallBrandsQuery,
  useGetallcategoriesQuery,
} from "../../Redux/apis/productsApi";
import { toast } from "react-toastify";
import { IoIosCloudUpload } from "react-icons/io";

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
  const [addProduct, { isLoading }] = useAddProductMutation();

  const { data: subcategoryData } = useGetallSubcategoriesQuery();
  const { data: brandData } = useGetallBrandsQuery();
  const { data: categoryData } = useGetallcategoriesQuery();

  const subcategories = subcategoryData?.data || [];
  const brands = brandData?.data || [];
  const categories = categoryData?.data || [];

  const [preview, setPreview] = useState(null);

  /* -------------------- Main Form -------------------- */
  const {
    register,
    handleSubmit,
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
      // gstRate: "",
      stock: "",
      // sku: "",
      imageFiles: [], // For storing file objects
      imageUrls: [], // For storing URLs (if you have them)
      previewImages: [], // For preview
    },
  ]);

  /* -------------------- Variant Logic -------------------- */
  const handleVariantChange = (index, e) => {
    const updated = [...variants];
    updated[index][e.target.name] = e.target.value;
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
        // gstRate: "",
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
    if (!formData.productName?.trim())
      return toast.error("Product Name is required");

    if (!formData.brand)
      return toast.error("Brand is required");

    if (!formData.category)
      return toast.error("Category is required");

    // if (!formData.subcategory)
    //   return toast.error("Subcategory is required");

    if (!formData.primaryImages || !formData.primaryImages[0])
      return toast.error("Primary Image is required");

    if (!variants.length)
      return toast.error("At least one variant required");

    // Validate variants
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];

      if (!v.quantityValue || !v.quantityUnit)
        return toast.error(`Variant ${i + 1}: Quantity required`);

      if (!v.originalPrice)
        return toast.error(`Variant ${i + 1}: Original Price required`);

      const originalPrice = Number(v.originalPrice);
      const discountValue = Number(v.discountValue || 0);

      if (discountValue > originalPrice) {
        return toast.error(`Variant ${i + 1}: Discount cannot exceed original price`);
      }
       
      if (!v.stock)
        return toast.error(`Variant ${i + 1}: Stock required`);

      // if (!v.sku)
      //   return toast.error(`Variant ${i + 1}: SKU required`);
    }

    try {
      const submitData = new FormData();

      // Append all fields
      submitData.append("productName", formData.productName.trim());
      submitData.append("subtext", formData.subtext?.trim() || "");
      submitData.append("description", formData.description?.trim() || "");
      submitData.append("keyFeatures", formData.keyFeatures?.trim() || "");
      submitData.append("wholesaleAdvantage", formData.wholesaleAdvantage?.trim() || "");
      submitData.append("brand", formData.brand);
      submitData.append("category", formData.category);
      submitData.append("subcategory", formData.subcategory);
      submitData.append("status", formData.status);
        
      // Primary image
      submitData.append("primaryImages", formData.primaryImages[0]);
      
      // Format variants - Use imageUrls if available, otherwise empty array
      const formattedVariants = variants.map((v) => ({
        quantityValue: Number(v.quantityValue),
        quantityUnit: v.quantityUnit,
        originalPrice: Number(v.originalPrice),
        discountType: v.discountType || null,
        discountValue: Number(v.discountValue || 0),
        // gstRate: Number(v.gstRate || 0),
        stock: Number(v.stock),
        // sku: v.sku,
        // IMPORTANT: Send empty array for now since we don't have URLs
        // The API expects URLs, not files
        images: [] // Send empty array to avoid errors
      }));

      submitData.append("variants", JSON.stringify(formattedVariants));

      // DO NOT append variant image files here - the API expects URLs in the images array
      // If you need to upload images, you need to do it separately and get URLs first

      // Log the FormData contents (for debugging)
      console.log("FormData entries:");
      for (let pair of submitData.entries()) {
        if (pair[0] === 'variants') {
          console.log(pair[0], JSON.parse(pair[1]));
        } else if (pair[0].includes('image')) {
          console.log(pair[0], 'File:', pair[1].name, 'Size:', pair[1].size);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      // Make the API call
      const response = await addProduct(submitData).unwrap();

      toast.success("Product Added Successfully ✅");
      console.log("Response:", response);

      // Reset form
      setVariants([{
        quantityValue: "",
        quantityUnit: "",
        originalPrice: "",
        discountType: "percent",
        discountValue: "",
        // gstRate: "",
        stock: "",
        // sku: "",
        imageFiles: [],
        imageUrls: [],
        previewImages: [],
      }]);
      setPreview(null);

    } catch (error) {
      console.error("Full error:", error);

      // Handle different error types
      let errorMessage = "Failed to Add Product ❌";

      if (error.data) {
        if (typeof error.data === 'string' && error.data.includes('<!DOCTYPE')) {
          errorMessage = "Server error (500). Please check your data format.";
          console.error("Server returned HTML error page");
        } else {
          errorMessage = error.data.message || errorMessage;
        }
      } else if (error.error) {
        errorMessage = error.error;
      }

      toast.error(errorMessage);
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
                Primary Image
              </label>

              {/* Upload Box */}
              <label
                htmlFor="primaryImage"
                className="mt-1 flex flex-col items-center justify-center 
    border-2 border-dashed border-gray-300 rounded-lg 
    h-28 cursor-pointer hover:border-[#00E5B0] transition"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-20 object-contain"
                  />
                ) : (
                  <>
                    {/* Upload Icon */}
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

          {/* Variants */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Product Variants</h3>

            {variants.map((variant, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <InputField
                    label="Quantity Value"
                    name="quantityValue"
                    placeholder="Value should be Number"
                    value={variant.quantityValue}
                    onChange={(e) => handleVariantChange(index, e)}
                  />

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Quantity Unit
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

                  <InputField
                    label="Discount Value"
                    name="discountValue"
                    placeholder="Value should be Number"
                    type="number"
                    value={variant.discountValue}
                    onChange={(e) => handleVariantChange(index, e)}
                  />

                  <div>
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

                  {/* <div>
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
                  </div> */}

                  <InputField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={variant.stock}
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
                    Variant Images (Preview only - URLs needed for API)
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
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Images are for preview only. API expects image URLs.
                    </p>
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