import React, { useState } from "react";
import OfferTabs from "../components/Offers/OfferTabs";
import AddBanner from "../components/Offers/AddBanner";
import { Outlet } from "react-router-dom";

const Offers = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">Offers</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-[#1A2550] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#141C3A] transition"
        >
          + Add Banner
        </button>
      </div>

      <h3 className="text-[#9F9F9F] mb-6">Manage Offers</h3>
      
      <OfferTabs />

      {/* ================= MODAL OVERLAY ================= */}
    {openModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    
    {/* Modal Content */}
    <div className="relative">
      <AddBanner closeModal={() => setOpenModal(false)} />
    </div>

  </div>
)}
<Outlet/>

    </div>
  );
};

export default Offers;
