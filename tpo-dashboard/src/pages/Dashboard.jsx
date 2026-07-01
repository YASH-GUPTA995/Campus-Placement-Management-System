import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdPeople, MdBusiness, MdWork, MdAssignment, MdCheckCircle, MdBarChart } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const StatCard = ({ icon, label, value, color, to }) => {
  const card = (
    <div className={`rounded-xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4 ${to ? "hover:shadow-md transition-shadow cursor-pointer" : ""}`}>
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{card}</Link> : card;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tpo/analytics").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const ov = data?.overview;

  return (
    <PageWrapper title="TPO Dashboard">
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Stat grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard to="/students" icon={<MdPeople size={22} className="text-blue-600" />} label="Total Students" value={ov?.totalStudents} color="bg-blue-50" />
            <StatCard to="/students?registered=true" icon={<MdPeople size={22} className="text-indigo-600" />} label="Registered" value={ov?.registeredStudents} color="bg-indigo-50" />
            <StatCard to="/companies" icon={<MdBusiness size={22} className="text-purple-600" />} label="Companies" value={ov?.totalCompanies} color="bg-purple-50" />
            <StatCard to="/drives" icon={<MdWork size={22} className="text-orange-600" />} label="Drives" value={ov?.totalDrives} color="bg-orange-50" />
            <StatCard icon={<MdAssignment size={22} className="text-yellow-600" />} label="Applications" value={ov?.totalApplications} color="bg-yellow-50" />
            <StatCard icon={<MdCheckCircle size={22} className="text-green-600" />} label="Placed" value={ov?.totalSelected} color="bg-green-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branch-wise */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MdBarChart size={20} className="text-blue-600" />
                <h2 className="text-base font-bold text-[#1E3A5F]">Branch-wise Placements</h2>
              </div>
              {data?.branchStats?.length ? (
                <div className="space-y-3">
                  {data.branchStats.map((b) => {
                    const pct = Math.round((b.count / (ov?.totalSelected || 1)) * 100);
                    return (
                      <div key={b._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{b._id}</span>
                          <span className="text-gray-500">{b.count} placed</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-gray-400 text-sm">No placement data yet.</p>}
            </div>

            {/* Top companies */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-[#1E3A5F] mb-4">Top Companies by Placements</h2>
              {data?.companyStats?.length ? (
                <div className="space-y-3">
                  {data.companyStats.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                        <span className="text-sm font-medium text-gray-800">{c.companyName}</span>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{c.count} placed</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-400 text-sm">No data yet.</p>}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Import Students", to: "/import", color: "bg-blue-600" },
              { label: "Add Company", to: "/companies/create", color: "bg-purple-600" },
              { label: "Create Drive", to: "/drives/create", color: "bg-orange-600" },
              { label: "Export Data", to: "/export", color: "bg-green-600" },
            ].map((a) => (
              <Link key={a.to} to={a.to}
                className={`${a.color} text-white rounded-xl px-4 py-3 text-sm font-semibold text-center hover:opacity-90 transition-opacity`}>
                {a.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </PageWrapper>
  );
};

export default Dashboard;
