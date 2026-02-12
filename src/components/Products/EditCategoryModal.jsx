import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useEditCategoryMutation } from "../../Redux/apis/productsApi"; 
// 👆 create this mutation in RTK (shown below)

export const EditCategoryModal =  ({ isOpen, onClose, productData }) => {
  const [updateCategory, { isLoading }] = useEditCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    HscCode: "",
    GstRate: "",
  });

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || "",
        HscCode: productData.HscCode || "",
        GstRate: productData.GstRate || "",
      });
    }
  }, [productData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await updateCategory({
        id: productData._id,
        ...formData,
      }).unwrap();

      toast.success("Product Updated Successfully");
      onClose();
    } catch (error) {
      toast.error("Update Failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4">Edit Product</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
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

