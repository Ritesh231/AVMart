import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useEditSubcategoryMutation } from "../../Redux/apis/productsApi";

export default function EditSubcategoryModal({
  isOpen,
  onClose,
  subcategoryData,
}) {
  const [editSubcategory, { isLoading }] = useEditSubcategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    image: null,
  });

  useEffect(() => {
    if (subcategoryData) {
      setFormData({
        name: subcategoryData.name || "",
        categoryId: subcategoryData.CategoryId || "",
        image: null,
      });
    }
  }, [subcategoryData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = async () => {
  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("categoryId", formData.categoryId);

    if (formData.image) {
      data.append("image", formData.image);
    }

    // ✅ LOG FORM DATA CONTENTS
    console.log("---- FormData Payload ----");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    // ✅ Specifically log image details
    if (formData.image) {
      console.log("Image Name:", formData.image.name);
      console.log("Image Type:", formData.image.type);
      console.log("Image Size (bytes):", formData.image.size);
    } else {
      console.log("No image selected");
    }

    await editSubcategory({
      id: subcategoryData._id,
      body: data,
    }).unwrap();

    toast.success("Subcategory Updated Successfully");
    onClose();
  } catch (err) {
    toast.error("Update Failed");
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4">Edit Subcategory</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Subcategory Name"
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="text"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            placeholder="Category ID"
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="file"
            name="image"
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
}
