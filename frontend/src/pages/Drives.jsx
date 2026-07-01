import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdSearch, MdBusiness, MdLocationOn, MdAccessTime } from "react-icons/md";
import PageWrapper from "../components/layout/PageWrapper";
import EligibilityBadge from "../components/student/EligibilityBadge";
import api from "../api/axios";

const Drives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/student/drives")
      .then((r) => setDrives(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = drives.filter((d) =>
    d.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper title="Placement Drives">
      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : !filtered.length ? (
        <div className="text-center py-20 text-gray-400">
          <MdBusiness size={48} className="mx-auto mb-3 opacity-30" />
          <p>No open drives found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((drive) => (
            <div key={drive._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              {/* Company header */}
              <div className="flex items-center gap-4 mb-4">
                {drive.company?.logo?.url ? (
                  <img src={drive.company.logo.url} alt="" className="h-12 w-12 rounded-xl object-contain border p-1" />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {drive.company?.name?.[0]}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-[#1E3A5F]">{drive.company?.name}</h2>
                  <p className="text-sm text-gray-500">{drive.company?.industry} · {drive.type} · {drive.academicYear}</p>
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-3">
                {drive.roles.map((role) => (
                  <div key={role._id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">{role.title}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                          {role.location && (
                            <span className="flex items-center gap-1"><MdLocationOn size={13} />{role.location}</span>
                          )}
                          {role.ctcLPA > 0 && (
                            <span className="font-medium text-green-700">₹{role.ctcLPA} LPA</span>
                          )}
                          {role.stipendPerMonth > 0 && (
                            <span className="font-medium text-green-700">₹{role.stipendPerMonth}/mo</span>
                          )}
                          {role.applicationDeadline && (
                            <span className="flex items-center gap-1 text-orange-600">
                              <MdAccessTime size={13} />
                              Deadline: {new Date(role.applicationDeadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <EligibilityBadge eligibility={role.eligibility} />
                        {role.applied ? (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            Applied · {role.appliedStatus}
                          </span>
                        ) : (
                          <Link
                            to={`/drives/${drive._id}`}
                            className="rounded-lg bg-[#2563EB] px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                          >
                            View & Apply
                          </Link>
                        )}
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

export default Drives;
