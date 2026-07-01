import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MdPeople, MdLock, MdLockOpen, MdLink } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const STATUS_COLORS = { Open: "bg-green-100 text-green-700", Closed: "bg-gray-100 text-gray-600", Draft: "bg-yellow-100 text-yellow-700" };
const APP_STATUS_COLORS = { Pending: "bg-yellow-100 text-yellow-700", Shortlisted: "bg-blue-100 text-blue-700", Selected: "bg-green-100 text-green-700", Rejected: "bg-red-100 text-red-700", OnHold: "bg-gray-100 text-gray-500" };

const DriveDetail = () => {
  const { driveId } = useParams();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [appLoading, setAppLoading] = useState(false);

  const fetchDrive = () => {
    api.get(`/tpo/drives/${driveId}`)
      .then((r) => { setDrive(r.data.data); if (r.data.data.roles?.[0]) setActiveRole(r.data.data.roles[0]); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrive(); }, [driveId]);

  useEffect(() => {
    if (!activeRole) return;
    setAppLoading(true);
    api.get(`/tpo/drives/${driveId}/roles/${activeRole._id}/applicants`)
      .then((r) => setApplicants(r.data.data))
      .catch(console.error)
      .finally(() => setAppLoading(false));
  }, [activeRole]);

  const changeStatus = async (roleId, status) => {
    try {
      await api.put(`/tpo/drives/${driveId}/roles/${roleId}/status`, { status });
      toast.success(`Role status set to ${status}`);
      fetchDrive();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const changeAppStatus = async (appId, status) => {
    try {
      await api.put(`/tpo/applications/${appId}`, { status });
      setApplicants((prev) => prev.map((a) => a._id === appId ? { ...a, status } : a));
      toast.success("Application status updated.");
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  if (loading) return <PageWrapper><div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div></PageWrapper>;
  if (!drive) return null;

  return (
    <PageWrapper title={`${drive.company?.name} — Drive Management`}>
      {/* Role tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {drive.roles.map((role) => (
          <button key={role._id}
            onClick={() => setActiveRole(role)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeRole?._id === role._id ? "bg-[#1E3A5F] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {role.title}
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[role.applicationStatus]}`}>
              {role.applicationStatus}
            </span>
          </button>
        ))}
      </div>

      {activeRole && (
        <>
          {/* Role controls */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">{activeRole.title}</h2>
              <p className="text-sm text-gray-500">
                {activeRole.jobType} · {activeRole.location} ·{" "}
                {activeRole.ctcLPA > 0 ? `₹${activeRole.ctcLPA} LPA` : activeRole.stipendPerMonth > 0 ? `₹${activeRole.stipendPerMonth}/mo` : "CTC TBD"}
                {activeRole.applicationDeadline && ` · Deadline: ${new Date(activeRole.applicationDeadline).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex gap-2">
              {activeRole.applicationStatus !== "Open" && (
                <button onClick={() => changeStatus(activeRole._id, "Open")}
                  className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                  <MdLockOpen size={16} /> Open Applications
                </button>
              )}
              {activeRole.applicationStatus === "Open" && (
                <button onClick={() => changeStatus(activeRole._id, "Closed")}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                  <MdLock size={16} /> Close Applications
                </button>
              )}
            </div>
          </div>

          {/* Applicants table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-100">
              <MdPeople size={18} className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">Applicants ({applicants.length})</h3>
            </div>
            {appLoading ? (
              <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
            ) : !applicants.length ? (
              <div className="text-center py-12 text-gray-400 text-sm">No applicants for this role yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Name","Roll No.","Branch","CGPA","Backlogs","Resume","Status","Override"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applicants.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-800">{app.student?.fullName}</td>
                        <td className="px-4 py-3 font-mono text-xs text-blue-700">{app.student?.rollNumber}</td>
                        <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{app.student?.branch}</span></td>
                        <td className="px-4 py-3 font-semibold">{app.student?.cgpa}</td>
                        <td className="px-4 py-3 text-center">{app.student?.activeBacklogs}</td>
                        <td className="px-4 py-3">
                          {app.resumeLink && (
                            <a href={app.resumeLink} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                              <MdLink size={13} /> View
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${APP_STATUS_COLORS[app.status]}`}>{app.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select value={app.status}
                            onChange={(e) => changeAppStatus(app._id, e.target.value)}
                            className="rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                            {["Pending","Shortlisted","Selected","Rejected","OnHold"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </PageWrapper>
  );
};

export default DriveDetail;
