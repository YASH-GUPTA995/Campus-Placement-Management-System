import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdSearch, MdDownload, MdLink, MdArrowBack, MdFilterList } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const BRANCHES = ["CSE", "ECE", "EE", "ME", "CE", "IT", "PIE"];
const STATUSES = ["Pending", "Shortlisted", "Selected", "Rejected", "OnHold"];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Shortlisted: "bg-blue-100 text-blue-700",
  Selected: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  OnHold: "bg-gray-100 text-gray-600",
};

const Applicants = () => {
  const { driveId, roleId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.get(`/company/drives/${driveId}/roles/${roleId}/applicants`)
      .then((r) => { setApplicants(r.data.data); setFiltered(r.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [driveId, roleId]);

  useEffect(() => {
    let result = [...applicants];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (a) => a.student?.fullName?.toLowerCase().includes(s) ||
               a.student?.rollNumber?.toLowerCase().includes(s)
      );
    }
    if (branch) result = result.filter((a) => a.student?.branch === branch);
    if (status) result = result.filter((a) => a.status === status);
    setFiltered(result);
  }, [search, branch, status, applicants]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await api.get(
        `/company/drives/${driveId}/roles/${roleId}/export`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `applicants_${roleId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Excel downloaded!");
    } catch {
      toast.error("Export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
          <MdArrowBack size={16} /> Back to Dashboard
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-[#1E3A5F]">Applicants</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search name or roll number…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <select value={branch} onChange={(e) => setBranch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none">
            <option value="">All Branches</option>
            {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors ml-auto">
            <MdDownload size={16} /> {exporting ? "Exporting…" : "Download Excel"}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Showing {filtered.length} of {applicants.length} applicants
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#1E3A5F] text-white">
                <tr>
                  {["#", "Name", "Roll No.", "Branch", "CGPA", "10th %", "12th %", "Backlogs", "Resume", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((app, i) => (
                  <tr key={app._id} className={i % 2 === 1 ? "bg-gray-50/40" : ""}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{app.student?.fullName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-700 whitespace-nowrap">{app.student?.rollNumber}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{app.student?.branch}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{app.student?.cgpa}</td>
                    <td className="px-4 py-3 text-gray-600">{app.student?.tenth?.percentage}%</td>
                    <td className="px-4 py-3 text-gray-600">{app.student?.twelfth?.percentage}%</td>
                    <td className="px-4 py-3 text-center text-gray-600">{app.student?.activeBacklogs}</td>
                    <td className="px-4 py-3">
                      {app.resumeLink ? (
                        <a href={app.resumeLink} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline whitespace-nowrap">
                          <MdLink size={13} /> View Resume
                        </a>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="text-center py-12 text-gray-400 text-sm">No applicants match your filters.</div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Applicants;
