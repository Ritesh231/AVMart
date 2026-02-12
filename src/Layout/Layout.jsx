import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Fixed Header */}
      <header className="sticky top-0 z-50">
        <Header />
      </header>
     
      {/* Page Content */}
      <main className="pt-2">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;
