import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoIosCloudUpload } from "react-icons/io";
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
    categoryName: "",
    image: null,
  });

  useEffect(() => {
    if (subcategoryData) {
      setFormData({
        name: subcategoryData.name || "",
        categoryId: subcategoryData.CategoryId || "",
        categoryName: subcategoryData.categoryName || "",
        image: null,
      });

      setPreview(subcategoryData.image || null);
    }
  }, [subcategoryData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0];
      if (!file) return;

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width !== 800 || img.height !== 800) {
          toast.error("Subcategory Image must be exactly 800 × 800 px ❌");

          setFormData((prev) => ({
            ...prev,
            image: null,
          }));

          setPreview(subcategoryData?.image || null);
          e.target.value = "";
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          image: file,
        }));

        setPreview(objectUrl);
      };

      img.onerror = () => {
        toast.error("Invalid image file ❌");
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [preview, setPreview] = useState(null);

  const handleSubmit = async () => {

    if (!formData.image && !preview) {
      toast.error("Subcategory Image is required ❌");
      return;
    }

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("categoryId", formData.categoryId);

      if (formData.image) {
        data.append("image", formData.image);
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
            name="categoryName"
            value={formData.categoryName}
            readOnly
            className="w-full border p-2 rounded-lg bg-gray-100"
          />

          <div>
            <label
              htmlFor="editImage"
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-indigo-500 transition"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-24 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <IoIosCloudUpload size={36} />
                  <span className="text-sm mt-2">
                    Click to Upload Image
                  </span>
                </div>
              )}
            </label>

            <input
              type="file"
              id="editImage"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>

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
