import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdAdd, MdDelete } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const BRANCHES = ["CSE", "ECE", "EE", "ME", "CE", "IT", "PIE"];

const defaultRole = () => ({
  title: "", description: "", location: "", ctcLPA: 0, stipendPerMonth: 0,
  jobType: "Full-time", applicationDeadline: "", applicationStatus: "Draft",
  eligibilityCriteria: {
    minCGPA: 0, allowedBranches: [], min10thPercent: 0, min12thPercent: 0,
    maxActiveBacklogs: 0, eligibleCTCRequired: false, pwdAllowed: true,
    graduationYearMin: 0, graduationYearMax: 9999,
  },
});

const CreateDrive = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ company: "", academicYear: "2024-25", type: "Full-time" });
  const [roles, setRoles] = useState([defaultRole()]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/tpo/companies").then((r) => setCompanies(r.data.data)).catch(console.error);
  }, []);

  const updateRole = (idx, key, value) => {
    const updated = [...roles];
    updated[idx] = { ...updated[idx], [key]: value };
    setRoles(updated);
  };

  const updateCriteria = (idx, key, value) => {
    const updated = [...roles];
    updated[idx].eligibilityCriteria = { ...updated[idx].eligibilityCriteria, [key]: value };
    setRoles(updated);
  };

  const toggleBranch = (idx, branch) => {
    const curr = roles[idx].eligibilityCriteria.allowedBranches;
    const next = curr.includes(branch) ? curr.filter((b) => b !== branch) : [...curr, branch];
    updateCriteria(idx, "allowedBranches", next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company) { toast.error("Please select a company."); return; }
    setLoading(true);
    try {
      await api.post("/tpo/drives", { ...form, roles });
      toast.success("Placement drive created successfully!");
      navigate("/drives");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create drive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Create Placement Drive">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Drive Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-[#1E3A5F] mb-4">Drive Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <select required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
                <option value="">Select company…</option>
                {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
              <input type="text" required value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                placeholder="2024-25"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drive Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
                <option>Full-time</option><option>Internship</option><option>Both</option>
              </select>
            </div>
          </div>
        </div>

        {/* Roles */}
        {roles.map((role, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#1E3A5F]">Role {idx + 1}</h2>
              {roles.length > 1 && (
                <button type="button" onClick={() => setRoles(roles.filter((_, i) => i !== idx))}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                  <MdDelete size={16} /> Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[["Role Title *", "title", "text"], ["Location", "location", "text"]].map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} required={key === "title"} value={role[key]} onChange={(e) => updateRole(idx, key, e.target.value)}
                    placeholder={label.replace(" *", "")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTC (LPA)</label>
                <input type="number" step="0.1" value={role.ctcLPA} onChange={(e) => updateRole(idx, "ctcLPA", parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stipend/Month (₹)</label>
                <input type="number" value={role.stipendPerMonth} onChange={(e) => updateRole(idx, "stipendPerMonth", parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select value={role.jobType} onChange={(e) => updateRole(idx, "jobType", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
                  <option>Full-time</option><option>Internship</option><option>Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input type="date" value={role.applicationDeadline} onChange={(e) => updateRole(idx, "applicationDeadline", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={role.applicationStatus} onChange={(e) => updateRole(idx, "applicationStatus", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
                  <option>Draft</option><option>Open</option><option>Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea rows={3} value={role.description} onChange={(e) => updateRole(idx, "description", e.target.value)}
                placeholder="Role responsibilities and requirements..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
            </div>

            {/* Eligibility Criteria */}
            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-sm font-bold text-gray-700 mb-3">Eligibility Criteria</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[["Min CGPA", "minCGPA", "number"], ["Min 10th %", "min10thPercent", "number"],
                  ["Min 12th %", "min12thPercent", "number"], ["Max Backlogs", "maxActiveBacklogs", "number"],
                  ["Grad Year Min", "graduationYearMin", "number"], ["Grad Year Max", "graduationYearMax", "number"]].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-500 mb-1">{label}</label>
                    <input type={type} step="0.1" value={role.eligibilityCriteria[key]}
                      onChange={(e) => updateCriteria(idx, key, parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={role.eligibilityCriteria.eligibleCTCRequired}
                    onChange={(e) => updateCriteria(idx, "eligibleCTCRequired", e.target.checked)}
                    className="rounded" />
                  Eligible for CTC Required
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={role.eligibilityCriteria.pwdAllowed}
                    onChange={(e) => updateCriteria(idx, "pwdAllowed", e.target.checked)}
                    className="rounded" />
                  PWD Allowed
                </label>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Allowed Branches (empty = all branches)</p>
                <div className="flex flex-wrap gap-2">
                  {BRANCHES.map((b) => (
                    <button key={b} type="button"
                      onClick={() => toggleBranch(idx, b)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                        role.eligibilityCriteria.allowedBranches.includes(b)
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
        ))}

        <button type="button" onClick={() => setRoles([...roles, defaultRole()])}
          className="flex items-center gap-2 rounded-xl border-2 border-dashed border-blue-300 px-6 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 w-full justify-center transition-colors">
          <MdAdd size={18} /> Add Another Role
        </button>

        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => navigate("/drives")}
            className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Creating…" : "Create Drive"}
          </button>
        </div>
      </form>
    </PageWrapper>
  );
};

export default CreateDrive;
