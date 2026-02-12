import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUpdateBrandMutation } from "../../Redux/apis/productsApi";

export default function EditBrandModal({ isOpen, onClose, brandData }) {
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();

  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  // Prefill data
  useEffect(() => {
    if (brandData) {
      setName(brandData.name || "");
      setPreview(brandData.logo || null);
      setLogo(null);
    }
  }, [brandData]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);

      if (logo) {
        formData.append("logo", logo);
      }

      // Debug payload
      console.log("---- Brand Update Payload ----");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await updateBrand({
        id: brandData._id,
        body: formData,
      }).unwrap();

      toast.success("Brand Updated Successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Update Failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl">
        <h2 className="text-lg font-bold mb-4">Edit Brand</h2>

        <div className="space-y-4">
          {/* Brand Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Brand Name"
            className="w-full border p-2 rounded-lg"
          />

          {/* Logo Upload */}
          <div className="border-dashed border-2 rounded-lg p-4 text-center relative">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-20 mx-auto object-contain"
              />
            ) : (
              <p>Upload Logo</p>
            )}

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setLogo(file);
                setPreview(URL.createObjectURL(file));
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
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
