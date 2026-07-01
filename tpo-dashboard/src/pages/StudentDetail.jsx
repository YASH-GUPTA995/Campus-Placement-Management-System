import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdEdit, MdSave, MdClose, MdLockOpen } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const Field = ({ label, value, editing, name, onChange, type = "text" }) => (
  <div className="rounded-lg bg-gray-50 p-3">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    {editing ? (
      <input type={type} name={name} defaultValue={value ?? ""}
        onChange={onChange}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none" />
    ) : (
      <p className="text-sm font-medium text-gray-800">{value ?? "—"}</p>
    )}
  </div>
);

const StudentDetail = () => {
  const { rollNumber } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchStudent = () => {
    api.get(`/tpo/students/${rollNumber}`)
      .then((r) => { setData(r.data.data); setForm(r.data.data.student); })
      .catch(() => navigate("/students"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudent(); }, [rollNumber]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/tpo/students/${rollNumber}`, {
        cgpa: parseFloat(form.cgpa),
        activeBacklogs: parseInt(form.activeBacklogs),
        contactNumber: form.contactNumber,
        personalEmail: form.personalEmail,
        permanentAddress: form.permanentAddress,
        eligibleForCTC: form.eligibleForCTC === "true" || form.eligibleForCTC === true,
        isPWD: form.isPWD === "true" || form.isPWD === true,
        graduationYear: parseInt(form.graduationYear),
      });
      toast.success("Student record updated successfully!");
      setEditing(false);
      fetchStudent();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const unlockApplication = async () => {
    try {
      await api.put(`/tpo/students/${rollNumber}/unlock-application`, {});
      toast.success("Application portal unlocked for this student.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to unlock");
    }
  };

  if (loading) return <PageWrapper><div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div></PageWrapper>;
  if (!data) return null;

  const { student, applications } = data;

  return (
    <PageWrapper title={`Student: ${student.fullName}`}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{student.rollNumber}</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">{student.branch}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${student.isRegistered ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {student.isRegistered ? "Registered" : "Not Registered"}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={unlockApplication}
            className="flex items-center gap-1.5 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors">
            <MdLockOpen size={16} /> Unlock Application Portal
          </button>
          {editing ? (
            <>
              <button onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                <MdClose size={16} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                <MdSave size={16} /> {saving ? "Saving…" : "Save"}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900">
              <MdEdit size={16} /> Edit Record
            </button>
          )}
        </div>
      </div>

      {/* Academic (editable) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
        <h2 className="text-base font-bold text-[#1E3A5F] mb-4">Academic Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="CGPA" name="cgpa" value={student.cgpa} editing={editing} onChange={handleChange} type="number" />
          <Field label="Active Backlogs" name="activeBacklogs" value={student.activeBacklogs} editing={editing} onChange={handleChange} type="number" />
          <Field label="Graduation Year" name="graduationYear" value={student.graduationYear} editing={editing} onChange={handleChange} type="number" />
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-400 mb-1">Eligible for CTC</p>
            {editing ? (
              <select name="eligibleForCTC" defaultValue={String(student.eligibleForCTC)} onChange={handleChange}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : <p className="text-sm font-medium text-gray-800">{student.eligibleForCTC ? "Yes" : "No"}</p>}
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-400 mb-1">PWD Category</p>
            {editing ? (
              <select name="isPWD" defaultValue={String(student.isPWD)} onChange={handleChange}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            ) : <p className="text-sm font-medium text-gray-800">{student.isPWD ? "Yes" : "No"}</p>}
          </div>
        </div>
      </div>

      {/* Personal (editable) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
        <h2 className="text-base font-bold text-[#1E3A5F] mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="Full Name" value={student.fullName} />
          <Field label="College Email" value={student.collegeEmail} />
          <Field label="Personal Email" name="personalEmail" value={student.personalEmail} editing={editing} onChange={handleChange} />
          <Field label="Contact Number" name="contactNumber" value={student.contactNumber} editing={editing} onChange={handleChange} />
          <Field label="Gender" value={student.gender} />
          <Field label="DOB" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "—"} />
          <div className="col-span-2 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-400 mb-1">Permanent Address</p>
            {editing ? (
              <input type="text" name="permanentAddress" defaultValue={student.permanentAddress}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none" />
            ) : <p className="text-sm font-medium text-gray-800">{student.permanentAddress || "—"}</p>}
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-[#1E3A5F] mb-4">Applications ({applications?.length || 0})</h2>
        {!applications?.length ? (
          <p className="text-gray-400 text-sm">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 text-xs text-gray-400">
                <th className="pb-2 text-left font-medium">Company</th>
                <th className="pb-2 text-left font-medium">Role</th>
                <th className="pb-2 text-left font-medium">Status</th>
                <th className="pb-2 text-left font-medium">Applied</th>
                <th className="pb-2 text-left font-medium">Resume</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => {
                  const role = app.driveId?.roles?.find((r) => String(r._id) === String(app.roleId));
                  return (
                    <tr key={app._id}>
                      <td className="py-2 font-medium text-gray-800">{app.company?.name}</td>
                      <td className="py-2 text-gray-600">{role?.title || "—"}</td>
                      <td className="py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          app.status === "Selected" ? "bg-green-100 text-green-700"
                            : app.status === "Rejected" ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>{app.status}</span>
                      </td>
                      <td className="py-2 text-gray-400 text-xs">{new Date(app.submittedAt).toLocaleDateString()}</td>
                      <td className="py-2">
                        {app.resumeLink && <a href={app.resumeLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">View</a>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default StudentDetail;
