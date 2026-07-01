import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdSearch, MdPeople } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const BRANCHES = ["CSE", "ECE", "EE", "ME", "CE", "IT", "PIE"];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [registered, setRegistered] = useState("");
  const [page, setPage] = useState(1);

  const fetchStudents = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 50 });
    if (search) params.append("search", search);
    if (branch) params.append("branch", branch);
    if (registered) params.append("registered", registered);
    api.get(`/tpo/students?${params}`)
      .then((r) => { setStudents(r.data.data); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [page, branch, registered]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchStudents(); };

  return (
    <PageWrapper title="Student Management">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search name, roll, email..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Search</button>
        </form>
        <select value={branch} onChange={(e) => { setBranch(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none">
          <option value="">All Branches</option>
          {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={registered} onChange={(e) => { setRegistered(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none">
          <option value="">All Status</option>
          <option value="true">Registered</option>
          <option value="false">Not Registered</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-3">{total} students found</p>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#1E3A5F] text-white">
                <tr>
                  {["Roll Number","Name","Branch","CGPA","Backlogs","Status","Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((s, i) => (
                  <tr key={s._id} className={i % 2 === 1 ? "bg-gray-50/50" : ""}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{s.rollNumber}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{s.fullName}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{s.branch}</span></td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{s.cgpa}</td>
                    <td className="px-4 py-3 text-center">{s.activeBacklogs}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.isRegistered ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {s.isRegistered ? "Registered" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/students/${s.rollNumber}`} className="text-blue-600 hover:underline text-xs font-medium">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!students.length && (
            <div className="text-center py-12 text-gray-400">
              <MdPeople size={40} className="mx-auto mb-2 opacity-30" />
              <p>No students found.</p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default Students;
