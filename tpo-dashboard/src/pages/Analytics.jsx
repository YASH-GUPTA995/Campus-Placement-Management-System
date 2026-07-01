import React, { useEffect, useState } from "react";
import { MdBarChart, MdTrendingUp, MdBusiness, MdPeople } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tpo/analytics")
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageWrapper title="Analytics">
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    </PageWrapper>
  );

  const ov = data?.overview || {};
  const placementRate = ov.registeredStudents
    ? ((ov.totalSelected / ov.registeredStudents) * 100).toFixed(1)
    : 0;

  return (
    <PageWrapper title="Placement Analytics">
      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Students", value: ov.totalStudents, icon: <MdPeople size={22} />, color: "bg-blue-50 text-blue-600" },
          { label: "Registered", value: ov.registeredStudents, icon: <MdPeople size={22} />, color: "bg-indigo-50 text-indigo-600" },
          { label: "Total Placed", value: ov.totalSelected, icon: <MdTrendingUp size={22} />, color: "bg-green-50 text-green-600" },
          { label: "Placement Rate", value: `${placementRate}%`, icon: <MdBarChart size={22} />, color: "bg-orange-50 text-orange-600" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${c.color}`}>{c.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{c.value}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch-wise placements */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <MdBarChart size={20} className="text-blue-600" />
            <h2 className="text-base font-bold text-[#1E3A5F]">Branch-wise Placements</h2>
          </div>
          {data?.branchStats?.length ? (
            <div className="space-y-4">
              {data.branchStats.map((b) => {
                const pct = ov.totalSelected
                  ? Math.round((b.count / ov.totalSelected) * 100)
                  : 0;
                const colors = {
                  CSE: "bg-blue-500", ECE: "bg-purple-500", EE: "bg-yellow-500",
                  ME: "bg-orange-500", CE: "bg-red-500", IT: "bg-green-500", PIE: "bg-pink-500",
                };
                return (
                  <div key={b._id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-gray-700">{b._id}</span>
                      <span className="text-sm text-gray-500">{b.count} placed ({pct}%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${colors[b._id] || "bg-blue-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">No placement data yet.</p>
          )}
        </div>

        {/* Top companies */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <MdBusiness size={20} className="text-blue-600" />
            <h2 className="text-base font-bold text-[#1E3A5F]">Top Recruiting Companies</h2>
          </div>
          {data?.companyStats?.length ? (
            <div className="space-y-3">
              {data.companyStats.map((c, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-500" : "bg-blue-200 text-blue-700"
                  }`}>
                    {i + 1}
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-800">{c.companyName}</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {c.count} offers
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">No company data yet.</p>
          )}
        </div>

        {/* Summary stats */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-base font-bold text-[#1E3A5F] mb-5">Overall Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Applications", value: ov.totalApplications },
              { label: "Total Companies", value: ov.totalCompanies },
              { label: "Total Drives", value: ov.totalDrives },
              { label: "Offers Made", value: ov.totalSelected },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-3xl font-bold text-[#1E3A5F]">{s.value ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Analytics;
