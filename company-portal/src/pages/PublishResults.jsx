import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdArrowBack, MdCheckCircle, MdPublish, MdSearch } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const PublishResults = () => {
  const { driveId, roleId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get(`/company/drives/${driveId}/roles/${roleId}/applicants`)
      .then((r) => setApplicants(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [driveId, roleId]);

  const toggleSelect = (rollNumber) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(rollNumber) ? next.delete(rollNumber) : next.add(rollNumber);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(filtered.map((a) => a.student?.rollNumber)));
  const clearAll = () => setSelected(new Set());

  const handlePublish = async () => {
    if (selected.size === 0) {
      toast.error("Select at least one student to mark as selected.");
      return;
    }
    const confirm = window.confirm(
      `You are about to publish results:\n✅ ${selected.size} student(s) SELECTED\n❌ ${applicants.length - selected.size} student(s) REJECTED\n\nThis will notify all students immediately. Continue?`
    );
    if (!confirm) return;
    setPublishing(true);
    try {
      const { data } = await api.post(`/company/drives/${driveId}/roles/${roleId}/results`, {
        selectedRollNumbers: Array.from(selected),
      });
      toast.success(data.message);
      setPublished(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Publishing failed.");
    } finally {
      setPublishing(false);
    }
  };

  const filtered = applicants.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return a.student?.fullName?.toLowerCase().includes(s) ||
           a.student?.rollNumber?.toLowerCase().includes(s);
  });

  if (published) return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <MdCheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Results Published!</h2>
        <p className="text-gray-500 mb-2">{selected.size} student(s) selected. All applicants have been notified.</p>
        <p className="text-sm text-gray-400 mb-8">Students can view their result status in their portal.</p>
        <Link to="/" className="rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          Back to Dashboard
        </Link>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
          <MdArrowBack size={16} /> Back to Dashboard
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-[#1E3A5F]">Publish Results</h1>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-yellow-800">⚠ Important</p>
        <p className="text-xs text-yellow-700 mt-1">
          Selecting students and clicking "Publish Results" will immediately notify ALL applicants of their outcome.
          Selected students will be marked <strong>Selected</strong>, all others <strong>Rejected</strong>.
          This action directly updates student dashboards.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search applicant…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={selectAll} className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100">
            Select All
          </button>
          <button onClick={clearAll} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
            Clear
          </button>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-600">
            <strong>{selected.size}</strong> selected / {applicants.length} total
          </span>
          <button onClick={handlePublish} disabled={publishing || selected.size === 0}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors">
            <MdPublish size={18} /> {publishing ? "Publishing…" : "Publish Results"}
          </button>
        </div>
      </div>

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
                  <th className="px-4 py-3 text-left w-10">
                    <input type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={() => selected.size === filtered.length ? clearAll() : selectAll()}
                      className="rounded" />
                  </th>
                  {["Name", "Roll No.", "Branch", "CGPA", "Backlogs", "Resume", "Mark"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((app, i) => {
                  const roll = app.student?.rollNumber;
                  const isSelected = selected.has(roll);
                  return (
                    <tr key={app._id}
                      className={`cursor-pointer transition-colors ${isSelected ? "bg-green-50" : i % 2 === 1 ? "bg-gray-50/40" : ""}`}
                      onClick={() => toggleSelect(roll)}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(roll)}
                          className="rounded text-green-600" onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{app.student?.fullName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-blue-700 whitespace-nowrap">{roll}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{app.student?.branch}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{app.student?.cgpa}</td>
                      <td className="px-4 py-3 text-center">{app.student?.activeBacklogs}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        {app.resumeLink ? (
                          <a href={app.resumeLink} target="_blank" rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline">View</a>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isSelected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {isSelected ? "✓ Selected" : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="text-center py-12 text-gray-400 text-sm">No applicants found.</div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default PublishResults;
