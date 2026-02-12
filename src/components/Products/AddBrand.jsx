import React, { useState } from "react";
import { useAddBrandMutation } from "../../Redux/apis/productsApi";
import { toast } from "react-toastify";

export default function AddBrand() {
  const [addBrand, { isLoading }] = useAddBrandMutation();

  const [formData, setFormData] = useState({
    name: "",
    logo: null,
  });
  
  const [preview, setPreview] = useState(null);

  /* -------------------- Handlers -------------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, logo: file });
    setPreview(URL.createObjectURL(file));
  };

  /* -------------------- Submit -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.logo) {
      toast.error("Please fill all fields ❌");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("logo", formData.logo);

      await addBrand(data).unwrap();

      toast.success("Brand Added Successfully ✅");

      // Reset
      setFormData({
        name: "",
        logo: null,
      });
      setPreview(null);

    } catch (error) {
      console.log(error);
      toast.error("Failed to Add Brand ❌");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="bg-[#F8FAFC] py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border">

        <div className="px-5 py-3 border-b bg-[#1E264F] rounded-t-xl">
          <h2 className="text-white font-semibold text-lg">
            Add New Brand
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Brand Name */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Brand Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5B0] outline-none"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Brand Logo
            </label>

            <label
              htmlFor="brandLogo"
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
                  Click to Upload Logo
                </span>
              )}
            </label>

            <input
              type="file"
              id="brandLogo"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#00E5B0] text-white px-6 py-2 rounded-lg"
            >
              {isLoading ? "Adding..." : "Add Brand"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
