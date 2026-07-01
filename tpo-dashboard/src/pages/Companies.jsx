import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdBusiness, MdAdd } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tpo/companies").then((r) => setCompanies(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper title="Companies">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{companies.length} companies registered</p>
        <Link to="/companies/create"
          className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          <MdAdd size={18} /> Add Company
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
      ) : !companies.length ? (
        <div className="text-center py-20 text-gray-400">
          <MdBusiness size={48} className="mx-auto mb-3 opacity-30" />
          <p>No companies added yet.</p>
          <Link to="/companies/create" className="mt-3 inline-block text-blue-600 hover:underline text-sm">Add your first company →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div key={c._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                {c.logo?.url ? (
                  <img src={c.logo.url} alt="" className="h-11 w-11 rounded-xl object-contain border p-1" />
                ) : (
                  <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {c.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.industry}</p>
                </div>
              </div>
              {c.hrName && <p className="text-xs text-gray-500 mb-1">HR: {c.hrName}</p>}
              {c.hrEmail && <p className="text-xs text-gray-500 mb-3">{c.hrEmail}</p>}
              {c.website && (
                <a href={c.website} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline block mb-3">{c.website}</a>
              )}
              <p className="text-xs text-gray-400">Added {new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Companies;
