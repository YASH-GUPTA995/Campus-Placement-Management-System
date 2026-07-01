import React, { useState } from "react";
import { toast } from "react-toastify";
import { MdUploadFile, MdCheckCircle, MdError, MdDownload } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

const ImportExcel = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Please select an Excel file."); return; }
    const formData = new FormData();
    formData.append("excel", file);
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/tpo/excel/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Import Student Excel">
      <div className="max-w-2xl">
        {/* Template note */}
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-5 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Required Excel Columns</h3>
          <div className="grid grid-cols-2 gap-1 text-xs text-blue-700">
            {["Roll Number","College Email ID","Full Name","Branch","CGPA","Gender","Date of Birth",
              "Personal Email ID","Contact Number","Nationality","Permanent Address",
              "10th Year","10th Percentage","10th Board","12th Year","12th Percentage","12th Board",
              "Active Backlog","Eligible for CTC","PWD","Graduation Year"].map((col) => (
              <span key={col} className="flex items-center gap-1">• {col}</span>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-3">
            ⚡ Import uses <strong>Roll Number</strong> as unique key. Existing records are updated, not deleted.
            Student accounts and applications remain intact.
          </p>
        </div>

        {/* Upload form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${file ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
              <MdUploadFile size={48} className={`mx-auto mb-3 ${file ? "text-blue-500" : "text-gray-300"}`} />
              {file ? (
                <p className="font-medium text-blue-700">{file.name}</p>
              ) : (
                <p className="text-gray-400 text-sm">Click to select or drag & drop your Excel file</p>
              )}
              <input type="file" accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-4 block mx-auto text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 cursor-pointer" />
            </div>

            <button type="submit" disabled={loading || !file}
              className="mt-5 w-full rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors">
              {loading ? "Importing…" : "Import & Update Master Database"}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1E3A5F] mb-4">Import Result</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{result.data?.imported}</p>
                <p className="text-xs text-green-600">New Students</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">{result.data?.updated}</p>
                <p className="text-xs text-blue-600">Updated</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3 text-center">
                <p className="text-2xl font-bold text-red-700">{result.data?.errors?.length}</p>
                <p className="text-xs text-red-600">Skipped (Errors)</p>
              </div>
            </div>

            {result.data?.errors?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-red-700 mb-2">Skipped Rows:</p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {result.data.errors.map((e, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-red-600 bg-red-50 rounded p-2">
                      <MdError size={14} className="mt-0.5 shrink-0" />
                      Row {e.row}: {e.reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ImportExcel;
