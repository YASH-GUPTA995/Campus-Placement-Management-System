import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdBusiness, MdAssignment, MdCheckCircle, MdCancel, MdNotifications, MdArrowForward } from "react-icons/md";
import PageWrapper from "../components/layout/PageWrapper";
import api from "../api/axios";

const StatCard = ({ icon, label, value, color }) => (
  <div className={`rounded-xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4`}>
    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/dashboard").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageWrapper><div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div></PageWrapper>;

  const { stats, upcomingDrives, student } = data || {};

  return (
    <PageWrapper title={`Welcome, ${student?.fullName?.split(" ")[0] || "Student"} 👋`}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<MdBusiness size={24} className="text-blue-600" />} label="Applied" value={stats?.applied} color="bg-blue-50" />
        <StatCard icon={<MdCheckCircle size={24} className="text-green-600" />} label="Selected" value={stats?.selected} color="bg-green-50" />
        <StatCard icon={<MdAssignment size={24} className="text-yellow-600" />} label="Shortlisted" value={stats?.shortlisted} color="bg-yellow-50" />
        <StatCard icon={<MdCancel size={24} className="text-red-600" />} label="Rejected" value={stats?.rejected} color="bg-red-50" />
      </div>

      {/* Upcoming Drives */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1E3A5F]">Open Drives</h2>
          <Link to="/drives" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            View all <MdArrowForward size={16} />
          </Link>
        </div>
        {!upcomingDrives?.length ? (
          <p className="text-gray-400 text-sm text-center py-8">No open drives right now. Check back soon!</p>
        ) : (
          <div className="space-y-3">
            {upcomingDrives.map((drive) => (
              <Link key={drive._id} to={`/drives/${drive._id}`}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3">
                  {drive.company?.logo?.url ? (
                    <img src={drive.company.logo.url} alt="" className="h-10 w-10 rounded-full object-contain border" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                      {drive.company?.name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{drive.company?.name}</p>
                    <p className="text-xs text-gray-500">{drive.type} · {drive.academicYear}</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Open</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Profile snapshot */}
      {student && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1E3A5F]">Your Profile</h2>
            <Link to="/profile" className="text-sm text-blue-600 hover:underline">View full profile</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Roll Number", value: student.rollNumber },
              { label: "Branch", value: student.branch },
              { label: "CGPA", value: student.cgpa },
              { label: "Backlogs", value: student.activeBacklogs },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Dashboard;
