import React, { useState, useMemo } from "react";
import {
  useAddProductMutation,
  useGetallSubcategoriesQuery,
  useGetallBrandsQuery,
  useGetallcategoriesQuery,
} from "../../Redux/apis/productsApi";
import { toast } from "react-toastify";

/* -------------------- Reusable Fields -------------------- */

const InputField = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <input
      {...props}
      className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg 
      focus:ring-2 focus:ring-[#00E5B0] outline-none"
    />
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <textarea
      rows="3"
      {...props}
      className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg 
      focus:ring-2 focus:ring-[#00E5B0] outline-none"
    />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <select
      {...props}
      className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg 
      focus:ring-2 focus:ring-[#00E5B0] outline-none"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
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

  const [formData, setFormData] = useState({
    productName: "",
    subtext: "",
    description: "",
    keyFeatures: "",
    wholesaleAdvantage: "",
    brand: "",
    category: "",
    subcategory: "",
    status: "active",
    slug: "",
    primaryImages: "",
  });
  
  /* -------------------- Filter Subcategory -------------------- */

  const filteredSubcategories = useMemo(() => {
    if (!formData.category) return [];
    return subcategories.filter(
      (sub) => sub.CategoryId === formData.category
    );
  }, [formData.category, subcategories]);

  /* -------------------- Variants -------------------- */

  const [variants, setVariants] = useState([
    {
      quantityValue: "",
      quantityUnit: "",
      originalPrice: "",
      discountType: "percent",
      discountValue: "",
      gstRate: "",
      stock: "",
      sku: "",
      images: [],
      previewImages: [],
    },
  ]);

  /* -------------------- Handlers -------------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.target.value,
      subcategory: "",
    });
  };

  const handleSubcategoryChange = (e) => {
    setFormData({
      ...formData,
      subcategory: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      primaryImages: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  /* -------------------- Variant Logic -------------------- */

  const handleVariantChange = (index, e) => {
    const updated = [...variants];
    updated[index][e.target.name] = e.target.value;
    setVariants(updated);
  };

  const handleVariantImageChange = (index, e) => {
    const files = Array.from(e.target.files);

    const updated = [...variants];
    updated[index].images = files;
    updated[index].previewImages = files.map((file) =>
      URL.createObjectURL(file)
    );

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
        stock: "",
        sku: "",
        images: [],
        previewImages: [],
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  /* -------------------- Submit -------------------- */

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();

    // Append normal fields
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    // Append variant images
    variants.forEach((variant, index) => {
      variant.images.forEach((file) => {
        data.append("variantImages", file);
      });
    });

    // Remove previewImages before sending
    const formattedVariants = variants.map((v) => ({
      quantityValue: Number(v.quantityValue),
      quantityUnit: v.quantityUnit,
      originalPrice: Number(v.originalPrice),
      discountType: v.discountType,
      discountValue: Number(v.discountValue),
      gstRate: Number(v.gstRate),
      stock: Number(v.stock),
      sku: v.sku,
      images: [], // backend should map uploaded files
    }));

    data.append("variants", JSON.stringify(formattedVariants));

    await addProduct(data).unwrap();

    toast.success("Product Added Successfully ✅");
  } catch (error) {
    console.log(error);
    toast.error("Failed to Add Product ❌");
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

        <form onSubmit={handleSubmit} className="p-5 space-y-6">

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <InputField label="Product Name" name="productName" value={formData.productName} onChange={handleChange} />
            <InputField label="Slug" name="slug" value={formData.slug} onChange={handleChange} />
            <InputField label="Subtext" name="subtext" value={formData.subtext} onChange={handleChange} />

            <SelectField label="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} options={brands} />
            <SelectField label="Category" value={formData.category} onChange={handleCategoryChange} options={categories} />
            <SelectField label="Subcategory" value={formData.subcategory} onChange={handleSubcategoryChange} options={filteredSubcategories} />

            

            {/* Main Image */}
          <div>
  <label className="text-xs font-medium text-gray-600">
    Product Image
  </label>

  <label
    htmlFor="mainImage"
    className="mt-1 flex items-center justify-center border-2 border-dashed 
    rounded-lg p-4 cursor-pointer hover:border-[#00E5B0]"
  >
    {preview ? (
      <img
        src={preview}
        alt="preview"
        className="h-24 object-contain"
      />
    ) : (
      <span className="text-xs text-gray-400">
        Click to Upload
      </span>
    )}
  </label>

  <input
    type="file"
    id="mainImage"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;

      setFormData((prev) => ({
        ...prev,
        primaryImages: file,
      }));

      setPreview(URL.createObjectURL(file));
    }}
  />
</div>



  <TextareaField
    label="Description"
    name="description"
    value={formData.description}
    onChange={handleChange}
  />

  <TextareaField
    label="Key Features (Comma separated)"
    name="keyFeatures"
    value={formData.keyFeatures}
    onChange={handleChange}
  />

  <TextareaField
    label="Wholesale Advantage"
    name="wholesaleAdvantage"
    value={formData.wholesaleAdvantage}
    onChange={handleChange}
  />




          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Product Variants</h3>

            {variants.map((variant, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50 space-y-3">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <InputField label="Quantity Value" name="quantityValue" value={variant.quantityValue} onChange={(e) => handleVariantChange(index, e)} />
                  <InputField label="Quantity Unit" name="quantityUnit" value={variant.quantityUnit} onChange={(e) => handleVariantChange(index, e)} />
                  <InputField label="Original Price" name="originalPrice" value={variant.originalPrice} onChange={(e) => handleVariantChange(index, e)} />
                  <InputField label="Discount Value" name="discountValue" value={variant.discountValue} onChange={(e) => handleVariantChange(index, e)} />
                  <InputField label="GST Rate" name="gstRate" value={variant.gstRate} onChange={(e) => handleVariantChange(index, e)} />
                  <InputField label="Stock" name="stock" value={variant.stock} onChange={(e) => handleVariantChange(index, e)} />
                  <InputField label="SKU" name="sku" value={variant.sku} onChange={(e) => handleVariantChange(index, e)} />
                </div>

                {/* Variant Images */}
               <div>
  <label className="text-xs font-medium text-gray-600">
    Variant Images
  </label>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => {
      const files = Array.from(e.target.files);

      const updated = [...variants];
      updated[index].images = files;
      updated[index].previewImages = files.map((file) =>
        URL.createObjectURL(file)
      );

      setVariants(updated);
    }}
    className="mt-2"
  />

  <div className="flex gap-2 mt-2 flex-wrap">
    {variant.previewImages?.map((img, i) => (
      <img
        key={i}
        src={img}
        alt="variant"
        className="h-16 rounded border"
      />
    ))}
  </div>
</div>


                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove Variant
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="bg-[#1E264F] text-white px-4 py-2 rounded-lg text-sm"
            >
              + Add Variant
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#00E5B0] text-white px-5 py-2 rounded-lg"
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
