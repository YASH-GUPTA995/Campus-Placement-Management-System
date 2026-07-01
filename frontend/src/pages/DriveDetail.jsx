import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdLocationOn, MdAccessTime, MdWork, MdCheckCircle, MdCancel, MdLink } from "react-icons/md";
import PageWrapper from "../components/layout/PageWrapper";
import EligibilityBadge from "../components/student/EligibilityBadge";
import api from "../api/axios";

/* ── Apply Modal ── */
const ApplyModal = ({ role, driveId, onClose, onSuccess }) => {
  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeLink.startsWith("http")) {
      toast.error("Please provide a valid Google Drive link.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/student/apply", {
        driveId,
        roleId: role._id,
        resumeLink,
      });
      toast.success("Application submitted successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
        <h2 className="text-lg font-bold text-[#1E3A5F] mb-1">Apply for {role.title}</h2>
        <p className="text-sm text-gray-500 mb-5">
          Paste your Google Drive resume link. Make sure sharing is set to <strong>Anyone with link</strong>.
        </p>

        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdLink className="inline mr-1" size={16} />
              Google Drive Resume Link
            </label>
            <input
              type="url" required
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800">
            ⚠ Once submitted, your application <strong>cannot be edited</strong>. Make sure your resume is up to date.
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const DriveDetail = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingRole, setApplyingRole] = useState(null);

  const fetchDrive = () => {
    api.get(`/student/drives/${driveId}`)
      .then((r) => setDrive(r.data.data))
      .catch(() => navigate("/drives"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrive(); }, [driveId]);

  if (loading) return (
    <PageWrapper>
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    </PageWrapper>
  );

  if (!drive) return null;

  return (
    <PageWrapper>
      {/* Company Banner */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-5">
          {drive.company?.logo?.url ? (
            <img src={drive.company.logo.url} alt="" className="h-16 w-16 rounded-xl object-contain border p-1" />
          ) : (
            <div className="h-16 w-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
              {drive.company?.name?.[0]}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1E3A5F]">{drive.company?.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{drive.company?.industry}</p>
            {drive.company?.website && (
              <a href={drive.company.website} target="_blank" rel="noreferrer"
                className="text-sm text-blue-600 hover:underline">{drive.company.website}</a>
            )}
            {drive.company?.description && (
              <p className="text-gray-600 text-sm mt-3">{drive.company.description}</p>
            )}
            {drive.company?.hrName && (
              <p className="text-xs text-gray-400 mt-2">HR: {drive.company.hrName} · {drive.company.hrEmail}</p>
            )}
          </div>
        </div>
      </div>

      {/* Roles */}
      <h2 className="text-lg font-bold text-[#1E3A5F] mb-4">Available Roles</h2>
      <div className="space-y-6">
        {drive.roles.map((role) => {
          const criteria = role.eligibilityCriteria;
          return (
            <div key={role._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              {/* Role header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{role.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MdWork size={15} />{role.jobType}</span>
                    {role.location && <span className="flex items-center gap-1"><MdLocationOn size={15} />{role.location}</span>}
                    {role.ctcLPA > 0 && <span className="font-semibold text-green-700">₹{role.ctcLPA} LPA</span>}
                    {role.stipendPerMonth > 0 && <span className="font-semibold text-green-700">₹{role.stipendPerMonth}/mo stipend</span>}
                    {role.applicationDeadline && (
                      <span className="flex items-center gap-1 text-orange-600">
                        <MdAccessTime size={15} />
                        Deadline: {new Date(role.applicationDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <EligibilityBadge eligibility={role.eligibility} />
              </div>

              {/* Description */}
              {role.description && (
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{role.description}</p>
              )}

              {/* Eligibility breakdown */}
              {role.eligibility?.ruleResults?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Eligibility Criteria</p>
                  <div className="space-y-1.5">
                    {role.eligibility.ruleResults.map((r, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${r.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {r.passed ? <MdCheckCircle size={14} /> : <MdCancel size={14} />}
                        <span>{r.rule}</span>
                        {!r.passed && <span className="ml-auto opacity-80">{r.reason}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply button */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                {role.applied ? (
                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                    ✓ Applied · Status: {role.appliedStatus}
                  </span>
                ) : role.applicationStatus !== "Open" ? (
                  <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-500">Applications Closed</span>
                ) : !role.eligibility?.isEligible ? (
                  <span className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-600">Not eligible to apply</span>
                ) : (
                  <button
                    onClick={() => setApplyingRole(role)}
                    className="rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {applyingRole && (
        <ApplyModal
          role={applyingRole}
          driveId={drive._id}
          onClose={() => setApplyingRole(null)}
          onSuccess={fetchDrive}
        />
      )}
    </PageWrapper>
  );
};

export default DriveDetail;
