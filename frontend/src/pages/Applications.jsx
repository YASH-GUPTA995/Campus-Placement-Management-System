import React, { useEffect, useState } from "react";
import { MdAssignment, MdLink, MdCheckCircle, MdCancel, MdAccessTime, MdPending } from "react-icons/md";
import PageWrapper from "../components/layout/PageWrapper";
import api from "../api/axios";

const STATUS_STYLES = {
  Pending:     "bg-yellow-100 text-yellow-700",
  Shortlisted: "bg-blue-100 text-blue-700",
  Selected:    "bg-green-100 text-green-700",
  Rejected:    "bg-red-100 text-red-700",
  OnHold:      "bg-gray-100 text-gray-600",
};

const STATUS_ICONS = {
  Pending:     <MdPending size={14} />,
  Shortlisted: <MdAccessTime size={14} />,
  Selected:    <MdCheckCircle size={14} />,
  Rejected:    <MdCancel size={14} />,
  OnHold:      <MdAccessTime size={14} />,
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/student/applications")
      .then((r) => setApplications(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statuses = ["All", "Pending", "Shortlisted", "Selected", "Rejected", "OnHold"];
  const filtered = filter === "All" ? applications : applications.filter((a) => a.status === filter);

  const getRoleName = (app) => {
    const roles = app.driveId?.roles || [];
    const role = roles.find((r) => String(r._id) === String(app.roleId));
    return role?.title || "Role";
  };

  return (
    <PageWrapper title="My Applications">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              filter === s ? "bg-[#2563EB] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : !filtered.length ? (
        <div className="text-center py-20 text-gray-400">
          <MdAssignment size={48} className="mx-auto mb-3 opacity-30" />
          <p>{filter === "All" ? "You haven't applied to any drives yet." : `No ${filter} applications.`}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div key={app._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {app.company?.logo?.url ? (
                    <img src={app.company.logo.url} alt="" className="h-11 w-11 rounded-xl object-contain border p-1" />
                  ) : (
                    <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {app.company?.name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{app.company?.name}</p>
                    <p className="text-sm text-gray-500">{getRoleName(app)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Applied: {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[app.status]}`}>
                    {STATUS_ICONS[app.status]} {app.status}
                  </span>
                  {app.resumeLink && (
                    <a
                      href={app.resumeLink} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <MdLink size={13} /> View Resume
                    </a>
                  )}
                </div>
              </div>

              {/* Eligibility snapshot */}
              {app.eligibilitySnapshot?.ruleResults?.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600">
                    View eligibility check at time of application
                  </summary>
                  <div className="mt-2 space-y-1">
                    {app.eligibilitySnapshot.ruleResults.map((r, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded ${r.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {r.passed ? <MdCheckCircle size={12} /> : <MdCancel size={12} />}
                        {r.rule}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Applications;
