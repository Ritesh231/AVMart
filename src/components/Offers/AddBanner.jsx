import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import {
  useAddTopSellingBannerMutation,
  useAddNormalBannerMutation,
  useAddCategoryBannerMutation,
  useAddSubcategoryBannerMutation,
} from "../../Redux/apis/bannerApi";
import { useGetallcategoriesQuery, useGetallSubcategoriesQuery } from "../../Redux/apis/productsApi";
import { toast } from "react-toastify";

const AddBanner = ({ closeModal, activeTab }) => {
  const [addTopSelling, { isLoading: topLoading }] =
    useAddTopSellingBannerMutation();

  const [addNormal, { isLoading: normalLoading }] =
    useAddNormalBannerMutation();

  const [addCategory, { isLoading: categoryLoading }] =
    useAddCategoryBannerMutation();

  const [addSubcategory, { isLoading: subLoading }] =
    useAddSubcategoryBannerMutation();

  const {
    data: categoryData,
    isLoading: categoryFetchLoading,
  } = useGetallcategoriesQuery();

  const {
    data: subcategoryData,
    isLoading: subcategoryFetchLoading,
  } = useGetallSubcategoriesQuery(undefined, {
    skip: activeTab !== "subcategory",
  });

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    isActive: true,
    displayOrder: 0,
    category: "",
    subcategory: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const BANNER_CONFIG = {
    main: {
      width: 1200,
      height: 675,
      label: "Main Banner",
      sample: "/samples/main-banner.jpg",
    },
    category: {
      width: 1200,
      height: 675,
      label: "Category Banner",
      sample: "/samples/category-banner.jpg",
    },
    mostselling: {
      width: 1200,
      height: 675,
      label: "Top Selling Banner",
      sample: "/samples/top-selling-banner.jpg",
    },
    subcategory: {
      width: 1200,
      height: 675,
      label: "Product Banner",
      sample: "/samples/product-banner.jpg",
    },
  };

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // File type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, JPEG and PNG images are allowed.");
      e.target.value = "";
      return;
    }

    // File size validation
    if (file.size > MAX_SIZE) {
      toast.error("Maximum allowed file size is 2 MB.");
      e.target.value = "";
      return;
    }

    const img = new Image();

    img.onload = () => {
      const config = BANNER_CONFIG[activeTab];

      if (
        img.width !== config.width ||
        img.height !== config.height
      ) {
        toast.error(
          `${config.label} must be ${config.width} × ${config.height}px`
        );

        e.target.value = "";
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
    };

    img.onerror = () => {
      toast.error("Invalid image.");
    };

    img.src = URL.createObjectURL(file);
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
      data.append("category", formData.category);


      // 🔥 Dynamic API call based on activeTab
      if (activeTab === "main") {
        await addNormal(data).unwrap();
      }
      else if (activeTab === "category") {
        await addCategory(data).unwrap();
      }
      else if (activeTab === "mostselling") {
        await addTopSelling(data).unwrap();
      }
      else if (activeTab === "subcategory") {
        data.append("subcategory", formData.subcategory);
        await addSubcategory(data).unwrap();
      }

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
          {/* <div>
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
        </div> */}

          {/* SUBTITLE */}
          {/* <div>
          <label className="text-sm font-medium text-gray-700">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
            placeholder="Don't miss these hot picks!"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </div> */}


          <div>
            <label className="text-sm font-medium text-gray-700">
              Select Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Select Category</option>

              {categoryData?.data?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {activeTab === "subcategory" && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">
                Select Subcategory
              </label>

              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value="">Select Subcategory</option>

                {subcategoryData?.data?.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}


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
                  className="absolute inset-0 w-full h-full object-contain"
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

          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>
              <strong>Supported:</strong> JPG, JPEG, PNG
            </p>

            <p>
              <strong>Maximum Size:</strong> 2 MB
            </p>

            <p>
              <strong>Required Dimensions:</strong>{" "}
              {BANNER_CONFIG[activeTab].width} ×{" "}
              {BANNER_CONFIG[activeTab].height}px
            </p>
          </div>

          {/* DISPLAY ORDER */}
          {/* <div>
          <label className="text-sm font-medium text-gray-700">
            Display Order
          </label>
          <input
            type="number"
            min="0"
            name="displayOrder"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
            value={formData.displayOrder}
            onChange={handleChange}
          />
        </div> */}

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
            disabled={topLoading || normalLoading || categoryLoading || subLoading}
            className="px-5 py-2 text-sm rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60"
          >
            {
              topLoading || normalLoading || categoryLoading || subLoading
                ? "Adding..."
                : "Add Banner"
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBanner;
