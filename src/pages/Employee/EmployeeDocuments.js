import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

const EmployeeDocuments = () => {
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    try {
      const { data } = await api.get("/documents/my");
      setDocuments(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) return alert("Select files");
    if (files.length > 6) return alert("Max 6 files allowed");

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setLoading(true);

      await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Uploaded Successfully");
      setFiles([]);
      fetchDocs();
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/documents/${id}`);
    fetchDocs();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar/>
      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          📄 My Documents
        </h2>
        {/* Upload Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>

          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="mb-4 block w-full text-sm text-gray-600"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
        {/* Documents List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>

          {documents.length === 0 ? (
            <p className="text-gray-500">No documents uploaded</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {doc.name}
                  </a>

                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocuments;
