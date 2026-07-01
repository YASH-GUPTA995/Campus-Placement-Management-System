import React, { useState } from "react";
import { toast } from "react-toastify";
import { MdAdminPanelSettings, MdCheckCircle } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const CreateTPOAdmin = () => {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/tpo/admins", { email: form.email, password: form.password });
      setSuccess({ email: form.email, password: form.password });
      setForm({ email: "", password: "", confirmPassword: "" });
      toast.success("TPO Admin created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Create TPO Admin">
      <div className="max-w-md">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800 font-medium">⚠ Restricted Action</p>
          <p className="text-xs text-yellow-700 mt-1">
            Creating a TPO Admin grants full access to the placement portal including student data,
            company management, and result publishing. Share credentials securely.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center">
              <MdAdminPanelSettings size={22} className="text-blue-700" />
            </div>
            <div>
              <p className="font-bold text-gray-800">New TPO Admin Account</p>
              <p className="text-xs text-gray-500">Full portal access will be granted</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email *</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tpo2@nitdelhi.ac.in"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" required minLength={8} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input type="password" required value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-[#1E3A5F] py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60 transition-colors">
              {loading ? "Creating…" : "Create TPO Admin"}
            </button>
          </form>
        </div>

        {success && (
          <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <MdCheckCircle size={20} className="text-green-600" />
              <p className="font-semibold text-green-800">Admin Created Successfully</p>
            </div>
            <p className="text-sm text-green-700 mb-1">Share these credentials securely:</p>
            <div className="bg-white rounded-lg border border-green-200 p-3 mt-2 space-y-1">
              <p className="text-sm"><span className="font-medium text-gray-500">Email:</span> {success.email}</p>
              <p className="text-sm"><span className="font-medium text-gray-500">Password:</span> {success.password}</p>
              <p className="text-xs text-gray-400 mt-2">Portal: TPO Admin Login</p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default CreateTPOAdmin;
