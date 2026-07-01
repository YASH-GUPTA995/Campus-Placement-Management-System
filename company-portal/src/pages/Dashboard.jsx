import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdPeople, MdWork, MdCheckCircle, MdArrowForward, MdDownload, MdPublish } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const STATUS_COLORS = {
  Open: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-600",
  Draft: "bg-yellow-100 text-yellow-700",
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/company/dashboard")
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageWrapper>
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper title={`${data?.company?.name || "Company"} — Workspace`}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Drives", value: data?.totalDrives, icon: <MdWork size={22} />, color: "bg-blue-50 text-blue-600" },
          { label: "Total Applicants", value: data?.totalApplicants, icon: <MdPeople size={22} />, color: "bg-purple-50 text-purple-600" },
          { label: "Total Selected", value: data?.totalSelected, icon: <MdCheckCircle size={22} />, color: "bg-green-50 text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value ?? 0}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Drives & Roles */}
      <h2 className="text-lg font-bold text-[#1E3A5F] mb-4">Your Placement Drives</h2>
      {!data?.drives?.length ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          <MdWork size={40} className="mx-auto mb-2 opacity-30" />
          <p>No drives assigned yet. Contact TPO.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {data.drives.map((drive) => (
            <div key={drive._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-800 text-lg">{drive.type} Drive</p>
                  <p className="text-sm text-gray-500">Academic Year: {drive.academicYear}</p>
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-3">
                {drive.roles.map((role) => (
                  <div key={role._id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800">{role.title}</p>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[role.applicationStatus]}`}>
                            {role.applicationStatus}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {role.jobType} · {role.location || "India"}
                          {role.ctcLPA > 0 && ` · ₹${role.ctcLPA} LPA`}
                          {role.stipendPerMonth > 0 && ` · ₹${role.stipendPerMonth}/mo`}
                          {` · ${role.totalApplicants} applicants`}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Link
                          to={`/drives/${drive._id}/roles/${role._id}/applicants`}
                          className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors">
                          <MdPeople size={14} /> View Applicants
                        </Link>
                        <Link
                          to={`/drives/${drive._id}/roles/${role._id}/results`}
                          className="flex items-center gap-1.5 rounded-lg bg-[#1E3A5F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-900 transition-colors">
                          <MdPublish size={14} /> Publish Results
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Dashboard;
