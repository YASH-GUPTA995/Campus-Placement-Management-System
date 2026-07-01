import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { setUser, setProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ rollNumber: "", collegeEmail: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

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
      const { data } = await api.post("/auth/student/register", {
        rollNumber: form.rollNumber.trim().toUpperCase(),
        collegeEmail: form.collegeEmail.trim().toLowerCase(),
        password: form.password,
      });
      setUser(data.user);
      setProfile(data.profile);
      toast.success("Registration successful! Welcome.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mb-4">
            <span className="text-2xl font-bold text-blue-700">N</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A5F]">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">NIT Delhi Placement Portal — Student</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
            <input
              type="text" required
              value={form.rollNumber}
              onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
              placeholder="e.g. 2021CSE001"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
            <input
              type="email" required
              value={form.collegeEmail}
              onChange={(e) => setForm({ ...form, collegeEmail: e.target.value })}
              placeholder="yourname@nitdelhi.ac.in"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
            <input
              type="password" required minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 8 characters"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password" required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Re-enter password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Your Roll Number and College Email must exist in the TPO master database.
        </p>
        <p className="text-center text-sm text-gray-500 mt-3">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
