import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const Input = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  value,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && " *"}
    </label>

    <input
      type={type}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
  </div>
);

const CreateCompany = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    industry: "Technology",
    website: "",
    description: "",
    hrName: "",
    hrEmail: "",
    companyEmail: "",
    companyPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/tpo/companies", form);
      toast.success(data.message);
      navigate("/companies");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Add New Company">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-[#1E3A5F] mb-4">
              Company Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Microsoft India"
              />

              <Input
                label="Industry"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="Technology"
              />

              <Input
                label="Website"
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                placeholder="https://company.com"
              />

              <Input
                label="HR Name"
                name="hrName"
                value={form.hrName}
                onChange={handleChange}
                placeholder="Recruiter Name"
              />

              <Input
                label="HR Email"
                name="hrEmail"
                type="email"
                value={form.hrEmail}
                onChange={handleChange}
                placeholder="hr@company.com"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>

              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Brief company description..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-[#1E3A5F] mb-2">
              Company Portal Login Credentials
            </h2>

            <p className="text-xs text-gray-400 mb-4">
              These credentials will be shared with the company.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Login Email"
                name="companyEmail"
                type="email"
                value={form.companyEmail}
                onChange={handleChange}
                required
                placeholder="company@example.com"
              />

              <Input
                label="Company Password"
                name="companyPassword"
                type="password"
                value={form.companyPassword}
                onChange={handleChange}
                required
                placeholder="Min 8 characters"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/companies")}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create Company & Account"}
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default CreateCompany;