import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";
import { useAddBannerMutation } from "../../Redux/apis/bannerApi";

const AddBanner = ({ closeModal }) => {
  const [addBanner, { isLoading }] = useAddBannerMutation();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    isActive: true,
    displayOrder: 0,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload banner image");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("isActive", formData.isActive);
      data.append("displayOrder", formData.displayOrder);
      data.append("image", image);

      await addBanner(data).unwrap();

      toast.success("Banner added successfully");
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add banner");
    }
  };

  return (
    <div className="bg-white rounded-2xl w-[360px] max-h-[550px] shadow-2xl border border-cyan-100">
      
      {/* HEADER */}
      <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#1A2550] to-[#62CDB9] text-white">
        <p className="text-xl">
          Upload banner image & details
        </p>
      </div>

      {/* BODY */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="">
        {/* TITLE */}
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
            placeholder="Summer Bestsellers"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* SUBTITLE */}
        <div>
          <label className="text-sm font-medium text-gray-700">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
            placeholder="Don't miss these hot picks!"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </div>

        {/* IMAGE UPLOAD + PREVIEW */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Banner Image
          </label>

          <label className="relative border-2 border-dashed border-cyan-400 rounded-xl h-28 w-full flex items-center justify-center cursor-pointer hover:bg-cyan-50 transition overflow-hidden">
            
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-cyan-600">
                <FiUploadCloud className="text-3xl mb-2" />
                <span className="text-xs text-gray-500">
                  Click to upload image
                </span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* DISPLAY ORDER */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Display Order
          </label>
          <input
            type="number"
            name="displayOrder"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={formData.displayOrder}
            onChange={handleChange}
          />
        </div>

        {/* ACTIVE */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            name="isActive"
            className="toggle toggle-primary"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span className="text-sm font-medium text-gray-700">
            Active Banner
          </span>
        </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 text-sm rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60"
          >
            {isLoading ? "Adding..." : "Add Banner"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBanner;
