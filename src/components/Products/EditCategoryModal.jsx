import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useEditCategoryMutation } from "../../Redux/apis/productsApi";
import { Upload } from "lucide-react";

export const EditCategoryModal = ({ isOpen, onClose, productData }) => {
  const [updateCategory, { isLoading }] = useEditCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    HscCode: "",
    GstRate: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || "",
        HscCode: productData.HscCode || "",
        GstRate: productData.GstRate || "",
      });

      setPreview(productData.image || ""); // existing image
    }
  }, [productData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit with FormData
  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("HscCode", formData.HscCode);
      data.append("GstRate", formData.GstRate);

      if (image) {
        data.append("image", image);
      }

      await updateCategory({
        id: productData._id,
        formData: data,
      }).unwrap();

      toast.success("Category Updated Successfully 🚀");
      onClose();
    } catch (error) {
      toast.error("Update Failed ❌");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4">Edit Category</h2>

        <div className="space-y-4">

          {/* Image Upload Box */}
          <label className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden">

            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Upload size={28} />
                <span className="text-sm">Upload Image</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>

          {/* Inputs */}
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="text"
            name="HscCode"
            placeholder="HSC Code"
            value={formData.HscCode}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="number"
            name="GstRate"
            placeholder="GST Rate"
            value={formData.GstRate}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
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
};