import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      if (img.width !== 400 || img.height !== 400) {
        toast.error("Brand Logo must be exactly 400 × 400 px ❌");
        URL.revokeObjectURL(objectUrl);

        setLogo(null);
        setPreview(brandData?.logo || null);
        e.target.value = "";
        return;
      }

      setLogo(file);
      setPreview(objectUrl);
      // Don't revoke here because preview uses this URL.
    };

    img.onerror = () => {
      toast.error("Invalid image file ❌");
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  const handleClose = () => {
    setName("");
    setLogo(null);
    setPreview(null);
    onClose();
  };

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
          <div>
            <label className="block text-sm font-medium mb-1">
              Brand Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

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
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
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
