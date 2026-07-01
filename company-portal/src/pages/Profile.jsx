import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const Field = ({ label, value }) => (
  <div className="rounded-lg bg-gray-50 p-3">
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);

const Profile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/company/profile")
      .then((r) => setCompany(r.data.data))
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

  return (
    <PageWrapper title="Company Profile">
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center gap-4 mb-5">
            {company?.logo?.url ? (
              <img src={company.logo.url} alt="" className="h-16 w-16 rounded-xl object-contain border p-1" />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
                {company?.name?.[0]}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800">{company?.name}</h2>
              <p className="text-sm text-gray-500">{company?.industry}</p>
              {company?.website && (
                <a href={company.website} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                  {company.website}
                </a>
              )}
            </div>
          </div>
          {company?.description && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{company.description}</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="HR Name" value={company?.hrName} />
            <Field label="HR Email" value={company?.hrEmail} />
            <Field label="Industry" value={company?.industry} />
            <Field label="Added on" value={company?.createdAt ? new Date(company.createdAt).toLocaleDateString() : "—"} />
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center">
          To update company details, contact NIT Delhi TPO.
        </p>
      </div>
    </PageWrapper>
  );
};

export default Profile;
