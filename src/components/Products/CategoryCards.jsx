import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useEditCategoryMutation,useDeleteCategoryMutation } from "../../Redux/apis/productsApi";
import {EditCategoryModal} from "../../components/Products/EditCategoryModal"
import toast from "react-hot-toast";
import { IdCard } from "lucide-react";

export default function CategoryCard({ category }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateCategory, { isLoading }] = useEditCategoryMutation();
  const[deleteCategory,{isLoading:deleted}]=useDeleteCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    HscCode: "",
    GstRate: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        HscCode: category.HscCode || "",
        GstRate: category.GstRate || "",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await updateCategory({
        id: category._id,
        ...formData,
      }).unwrap();

      toast.success("Category Updated Successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  const handleDelete=async(id)=>{
     const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) return;
    try{
      await deleteCategory(id).unwrap();
      toast.success("Category Deleted Successfully");
    }catch(err){
      toast.error("Error to delete Category",err);
    }
  }

  return (
    <>
      <div
        className="flex md:h-32 flex-col sm:flex-row sm:items-center justify-between
        p-4 rounded-xl border border-teal-200 bg-white
        hover:shadow-md transition gap-4"
      >
        {/* Left section */}
        <div className="flex justify-between gap-4">
          <img
            src={category.image}
            alt="category"
            className="w-10 h-10 object-contain"
          />

          <div>
            <h3 className="font-semibold text-gray-800">{category.name}</h3>
            <p className="text-xs text-gray-500">Subcategories:{category.subcategoryCount}</p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex md:flex-col flex-row sm:items-start gap-2">
          <span className="text-xs text-gray-400">Products:{category.productCount}</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
            >
              <FiEdit size={14} />
            </button>

            <button className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition" 
            onClick={()=>handleDelete(category._id)}>
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      </div>
        <EditCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productData={category}
      />
    </>
  );
}
