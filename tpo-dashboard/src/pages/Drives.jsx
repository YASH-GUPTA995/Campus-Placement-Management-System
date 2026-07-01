import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdWork, MdAdd } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const STATUS_COLORS = { Open: "bg-green-100 text-green-700", Closed: "bg-gray-100 text-gray-600", Draft: "bg-yellow-100 text-yellow-700" };

const Drives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tpo/drives").then((r) => setDrives(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper title="Placement Drives">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{drives.length} drives total</p>
        <Link to="/drives/create"
          className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          <MdAdd size={18} /> Create Drive
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
      ) : !drives.length ? (
        <div className="text-center py-20 text-gray-400">
          <MdWork size={48} className="mx-auto mb-3 opacity-30" /><p>No drives yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drives.map((drive) => (
            <div key={drive._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {drive.company?.logo?.url ? (
                    <img src={drive.company.logo.url} alt="" className="h-11 w-11 rounded-xl object-contain border p-1" />
                  ) : (
                    <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {drive.company?.name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800">{drive.company?.name}</p>
                    <p className="text-xs text-gray-500">{drive.type} · {drive.academicYear}</p>
                  </div>
                </div>
                <Link to={`/drives/${drive._id}`}
                  className="rounded-lg border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors">
                  Manage Drive →
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {drive.roles.map((role) => (
                  <span key={role._id} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[role.applicationStatus]}`}>
                    {role.title} · {role.applicationStatus} · {role.totalApplicants} applied
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Drives;
