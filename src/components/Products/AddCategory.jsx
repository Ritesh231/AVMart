import React, { useState } from "react";
import { useAddCategoryMutation } from "../../Redux/apis/productsApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const [addCategory, { isLoading }] = useAddCategoryMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    HscCode: "",
    // GstRate: "",
    image: null,
  });

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  const REQUIRED_WIDTH = 512;
  const REQUIRED_HEIGHT = 512;

  const [preview, setPreview] = useState(null);

  /* -------------------- Handlers -------------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File Type Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, JPEG and PNG images are allowed.");
      e.target.value = "";
      return;
    }

    // File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must not exceed 2 MB.");
      e.target.value = "";
      return;
    }

    // Image Dimension Validation
    const img = new Image();

    img.onload = () => {
      if (
        img.width !== REQUIRED_WIDTH ||
        img.height !== REQUIRED_HEIGHT
      ) {
        toast.error(
          `Image dimensions must be ${REQUIRED_WIDTH} × ${REQUIRED_HEIGHT}px.`
        );
        e.target.value = "";
        return;
      }

      // Success
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      setPreview(URL.createObjectURL(file));
    };

    img.src = URL.createObjectURL(file);
  };

  /* -------------------- Submit -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Category Image is required.");
      return;
    }

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("HscCode", formData.HscCode);
      // data.append("GstRate", formData.GstRate);
      data.append("image", formData.image);

      await addCategory(data).unwrap();

      toast.success("Category Added Successfully ✅");
      navigate("/products/categories");

      // Reset form
      setFormData({
        name: "",
        HscCode: "",
        // GstRate: "",
        image: null,
      });
      setPreview(null);

    } catch (error) {
      console.log(error);
      toast.error("Failed to Add Category ❌");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="bg-[#F8FAFC] py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border">

        <div className="px-5 py-3 border-b bg-[#1E264F] rounded-t-xl">
          <h2 className="text-white font-semibold text-lg">
            Add New Category
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-xs font-medium text-gray-600">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                HSC Code
              </label>
              <input
                type="text"
                name="HscCode"
                value={formData.HscCode}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none"
              />
            </div>

            {/* <div>
              <label className="text-xs font-medium text-gray-600">
                GST Rate (%)
              </label>
              <input
                type="number"
                name="GstRate"
                value={formData.GstRate}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none"
              />
            </div> */}

          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">
              Category Image <span className="text-red-500">*</span>
            </label>

            <label
              htmlFor="categoryImage"
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
              id="categoryImage"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p><strong>Supported Formats:</strong> JPG, JPEG, PNG</p>
              <p><strong>Required Size:</strong> 512 × 512 px</p>
              <p><strong>Maximum File Size:</strong> 2 MB</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white px-6 py-2 rounded-lg"
            >
              {isLoading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
