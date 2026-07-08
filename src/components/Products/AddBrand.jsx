import React, { useState } from "react";
import { useAddBrandMutation } from "../../Redux/apis/productsApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function AddBrand() {
  const [addBrand, { isLoading }] = useAddBrandMutation();

  const [formData, setFormData] = useState({
    name: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();


  /* -------------------- Handlers -------------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, JPEG and PNG images are allowed.");
      e.target.value = "";
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must not exceed 2 MB.");
      e.target.value = "";
      return;
    }

    // Validate dimensions
    const img = new Image();

    img.onload = () => {
      if (
        img.width !== REQUIRED_WIDTH ||
        img.height !== REQUIRED_HEIGHT
      ) {
        toast.error(
          `Brand image dimensions must be ${REQUIRED_WIDTH} × ${REQUIRED_HEIGHT}px.`
        );
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      setPreview(URL.createObjectURL(file));
    };

    img.src = URL.createObjectURL(file);
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
      navigate("/products/brands");

      setFormData({
        name: "",
        logo: null,
      });
      setPreview(null)
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to Add Brand ❌"
      );
    }
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  const REQUIRED_WIDTH = 400;
  const REQUIRED_HEIGHT = 400;

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


          {/* Brand Logo */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Brand Logo <span className="text-red-500">*</span>
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
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleLogoChange}
            />

            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p><strong>Supported Formats:</strong> JPG, JPEG, PNG</p>
              <p><strong>Required Size:</strong> 400 × 400 px</p>
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
              {isLoading ? "Adding..." : "Add Brand"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
