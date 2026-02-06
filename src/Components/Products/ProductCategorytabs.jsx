import React, { useState, useEffect } from "react";
import { BiCategory } from "react-icons/bi";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { BsStar } from "react-icons/bs";

const tabs = [
  { name: "Categories", icon: <BiCategory /> },
  { name: "Sub Categories", icon: <MdSubdirectoryArrowRight /> },
  { name: "Products", icon: <AiOutlineProduct /> },
  { name: "Brands", icon: <BsStar /> },
];

export default function CategoryTabs({ defaultActive = "Categories" }) {
  const [activeTab, setActiveTab] = useState(defaultActive);

  useEffect(() => {
    setActiveTab(defaultActive);
  }, [defaultActive]);

  return (
    <div className="inline-flex bg-[#1E2A5A] rounded-xl p-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              activeTab === tab.name
                ? "bg-[#2EE6C5] text-[#0F172A]"
                : "text-white hover:bg-white/10"
            }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </div>
  );
}
