import React, { useEffect, useState } from "react";
import { MdPerson, MdSchool, MdContactPhone } from "react-icons/md";
import PageWrapper from "../components/layout/PageWrapper";
import api from "../api/axios";

const Field = ({ label, value }) => (
  <div className="rounded-lg bg-gray-50 p-3">
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);

const Section = ({ icon, title, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
    <div className="flex items-center gap-2 mb-4">
      <div className="text-[#2563EB]">{icon}</div>
      <h2 className="text-base font-bold text-[#1E3A5F]">{title}</h2>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{children}</div>
  </div>
);

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/profile")
      .then((r) => setStudent(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageWrapper>
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    </PageWrapper>
  );

  if (!student) return <PageWrapper><p className="text-gray-400">Profile not found.</p></PageWrapper>;

  return (
    <PageWrapper title="My Profile">
      <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-2.5 text-xs text-blue-700 mb-6">
        ℹ Academic fields (CGPA, Branch, Roll Number) are read-only. Contact TPO to update them.
      </div>

      <Section icon={<MdPerson size={20} />} title="Personal Information">
        <Field label="Full Name" value={student.fullName} />
        <Field label="Roll Number" value={student.rollNumber} />
        <Field label="Branch" value={student.branch} />
        <Field label="Gender" value={student.gender} />
        <Field label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "—"} />
        <Field label="Nationality" value={student.nationality} />
        <Field label="Permanent Address" value={student.permanentAddress} />
      </Section>

      <Section icon={<MdContactPhone size={20} />} title="Contact Details">
        <Field label="College Email" value={student.collegeEmail} />
        <Field label="Personal Email" value={student.personalEmail} />
        <Field label="Contact Number" value={student.contactNumber} />
      </Section>

      <Section icon={<MdSchool size={20} />} title="Academic Information">
        <Field label="CGPA" value={student.cgpa} />
        <Field label="Graduation Year" value={student.graduationYear} />
        <Field label="Active Backlogs" value={student.activeBacklogs} />
        <Field label="Eligible for CTC" value={student.eligibleForCTC ? "Yes" : "No"} />
        <Field label="PWD Category" value={student.isPWD ? "Yes" : "No"} />
      </Section>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-[#2563EB]"><MdSchool size={20} /></div>
          <h2 className="text-base font-bold text-[#1E3A5F]">Academic Records</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">10th Standard</p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Year" value={student.tenth?.year} />
              <Field label="Percentage" value={student.tenth?.percentage ? `${student.tenth.percentage}%` : "—"} />
              <Field label="Board" value={student.tenth?.board} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">12th Standard</p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Year" value={student.twelfth?.year} />
              <Field label="Percentage" value={student.twelfth?.percentage ? `${student.twelfth.percentage}%` : "—"} />
              <Field label="Board" value={student.twelfth?.board} />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;
