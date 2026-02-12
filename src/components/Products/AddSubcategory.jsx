import React, { useState } from "react";
import {
  useAddSubcategoryMutation,
  useGetallcategoriesQuery,
} from "../../Redux/apis/productsApi"; // adjust if needed
import { toast } from "react-toastify";

export default function AddSubcategory() {
  const [addSubcategory, { isLoading }] = useAddSubcategoryMutation();
  const { data: categoryData } = useGetallcategoriesQuery();

  const categories = categoryData?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  /* -------------------- Handlers -------------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  /* -------------------- Submit -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId || !formData.image) {
      toast.error("Please fill all fields ❌");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("categoryId", formData.categoryId);
      data.append("image", formData.image);

      await addSubcategory(data).unwrap();

      toast.success("Subcategory Added Successfully ✅");

      // Reset form
      setFormData({
        name: "",
        categoryId: "",
        image: null,
      });
      setPreview(null);

    } catch (error) {
      console.log(error);
      toast.error("Failed to Add Subcategory ❌");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="bg-[#F8FAFC] py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border">

        <div className="px-5 py-3 border-b bg-[#1E264F] rounded-t-xl">
          <h2 className="text-white font-semibold text-lg">
            Add New Subcategory
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Subcategory Name */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Subcategory Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Select Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Subcategory Image
            </label>

            <label
              htmlFor="subcategoryImage"
              className="mt-2 flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-[#00E5B0]"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-28 object-contain"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  Click to Upload Image
                </span>
              )}
            </label>

            <input
              type="file"
              id="subcategoryImage"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#00E5B0] text-white px-6 py-2 rounded-lg"
            >
              {isLoading ? "Adding..." : "Add Subcategory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
