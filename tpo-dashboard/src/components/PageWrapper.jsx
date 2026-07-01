import React from "react";
import Sidebar from "./Sidebar";

const PageWrapper = ({ children, title }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 md:ml-64 p-6">
      {title && <h1 className="text-2xl font-bold text-[#1E3A5F] mb-6">{title}</h1>}
      {children}
    </main>
  </div>
);

export default PageWrapper;
