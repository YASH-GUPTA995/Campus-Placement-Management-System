import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDownload, MdFilterList } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const ALL_COLUMNS = [
  { key: "name", label: "Full Name" },
  { key: "rollNumber", label: "Roll Number" },
  { key: "branch", label: "Branch" },
  { key: "cgpa", label: "CGPA" },
  { key: "collegeEmail", label: "College Email" },
  { key: "personalEmail", label: "Personal Email" },
  { key: "contactNumber", label: "Contact Number" },
  { key: "gender", label: "Gender" },
  { key: "tenth", label: "10th %" },
  { key: "twelfth", label: "12th %" },
  { key: "activeBacklogs", label: "Active Backlogs" },
  { key: "resumeLink", label: "Resume Link" },
  { key: "status", label: "Application Status" },
  { key: "submittedAt", label: "Applied Date" },
];

const BRANCHES = ["CSE", "ECE", "EE", "ME", "CE", "IT", "PIE"];
const STATUSES = ["Pending", "Shortlisted", "Selected", "Rejected", "OnHold"];

const Export = () => {
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCols, setSelectedCols] = useState(ALL_COLUMNS.map((c) => c.key));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/tpo/drives").then((r) => setDrives(r.data.data)).catch(console.error);
  }, []);

  const currentDrive = drives.find((d) => d._id === selectedDrive);

  const toggleBranch = (b) =>
    setSelectedBranches((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const toggleCol = (key) =>
    setSelectedCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const handleExport = async () => {
    if (!selectedCols.length) { toast.error("Select at least one column."); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDrive) params.append("driveId", selectedDrive);
      if (selectedRole) params.append("roleId", selectedRole);
      if (selectedBranches.length) params.append("branches", selectedBranches.join(","));
      if (selectedStatus) params.append("status", selectedStatus);
      params.append("columns", selectedCols.join(","));

      const response = await api.get(`/tpo/export?${params}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "placement_export.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export downloaded!");
    } catch {
      toast.error("Export failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Export Applicant Data">
      <div className="max-w-3xl space-y-5">

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <MdFilterList size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-[#1E3A5F]">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drive</label>
              <select value={selectedDrive} onChange={(e) => { setSelectedDrive(e.target.value); setSelectedRole(""); }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
                <option value="">All Drives</option>
                {drives.map((d) => (
                  <option key={d._id} value={d._id}>{d.company?.name} — {d.academicYear}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                disabled={!currentDrive}>
                <option value="">All Roles</option>
                {currentDrive?.roles?.map((r) => (
                  <option key={r._id} value={r._id}>{r.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Branch</label>
              <div className="flex flex-wrap gap-2">
                {BRANCHES.map((b) => (
                  <button key={b} type="button" onClick={() => toggleBranch(b)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                      selectedBranches.includes(b)
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column selector */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#1E3A5F]">Select Columns</h2>
            <div className="flex gap-2">
              <button type="button" onClick={() => setSelectedCols(ALL_COLUMNS.map((c) => c.key))}
                className="text-xs text-blue-600 hover:underline">Select All</button>
              <span className="text-gray-300">|</span>
              <button type="button" onClick={() => setSelectedCols([])}
                className="text-xs text-gray-500 hover:underline">Clear</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ALL_COLUMNS.map((col) => (
              <label key={col.key} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                selectedCols.includes(col.key) ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}>
                <input type="checkbox" checked={selectedCols.includes(col.key)}
                  onChange={() => toggleCol(col.key)}
                  className="rounded text-blue-600" />
                <span className="text-sm text-gray-700">{col.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Export button */}
        <button onClick={handleExport} disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-md">
          <MdDownload size={20} />
          {loading ? "Generating Excel…" : "Download Excel Export"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Resume links in the export point to students' Google Drive links submitted at the time of application.
        </p>
      </div>
    </PageWrapper>
  );
};

export default Export;
