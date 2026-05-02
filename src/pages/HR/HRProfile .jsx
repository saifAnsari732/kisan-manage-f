import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { format } from "date-fns";

import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaIdBadge,
  FaCalendarAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaUniversity,
  FaCreditCard,
  FaIdCard,
  FaMobileAlt,
  FaHome,
} from "react-icons/fa";

import { MdEmail } from "react-icons/md";
import Navbar from "../../components/Navbar";

const HRProfile = () => {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    address: "",
    mobileNumber: "",
    bankName: "",
    accountNo: "",
    ifsc: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/hr/profile");

      setProfile(data);

      setFormData({
        address: data.address || "",
        mobileNumber: data.mobileNumber || "",
        bankName: data.bankName || "",
        accountNo: data.accountNo || "",
        ifsc: data.ifsc || "",
      });
    } catch (error) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("address", formData.address);
      formDataToSend.append("mobileNumber", formData.mobileNumber);
      formDataToSend.append("bankName", formData.bankName);
      formDataToSend.append("accountNo", formData.accountNo);
      formDataToSend.append("ifsc", formData.ifsc);

      if (image) {
        formDataToSend.append("profileImage", image);
      }

      const { data } = await api.put(
        "/hr/update/profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(data);
      updateUser({ hr: data });

      setPreview(null);
      setEditing(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      address: profile.address || "",
      mobileNumber: profile.mobileNumber || "",
      bankName: profile.bankName || "",
      accountNo: profile.accountNo || "",
      ifsc: profile.ifsc || "",
    });

    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600">Lodding Hr profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-10">
        <Navbar/>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:hidden">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              HR Profile
            </h1>
            <p className="text-xs text-gray-500">
              Manage HR information
            </p>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              HR Profile
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your HR account details
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <FaEdit />
              Edit Profile
            </button>
          )}
        </div>

        {/* Mobile Edit Button */}
        {!editing && (
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Top Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white bg-white/20">
                  {preview ? (
                    <img
                      src={preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold">
                      {profile?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>

                {editing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-lg">
                    📷
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];

                        if (file) {
                          setImage(file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                )}

                <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-white">
                  <FaCheckCircle className="text-white text-xs" />
                </div>
              </div>

              {/* Details */}
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold">
                  {profile?.name}
                </h2>

                <p className="text-blue-100 mt-1">
                  Human Resource Manager
                </p>

                <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                  <div className="bg-white/20 px-4 py-2 rounded-xl text-sm">
                    HR ID: {profile?.employeeId || "N/A"}
                  </div>

                  <div className="bg-white/20 px-4 py-2 rounded-xl text-sm">
                    {profile?.department || "HR Department"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <FaUserTie className="text-blue-600" />
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Full Name
                    </label>

                    <p className="text-gray-900 font-medium mt-1">
                      {profile?.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <FaCalendarAlt />
                      Date of Joining
                    </label>

                    <p className="text-gray-900 mt-1">
                      {profile?.dateOfJoining
                        ? format(
                            new Date(profile.dateOfJoining),
                            "dd MMM yyyy"
                          )
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <FaIdBadge />
                      Employee ID
                    </label>

                    <p className="text-gray-900 mt-1">
                      {profile?.employeeId || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <FaBuilding />
                      Department
                    </label>

                    <p className="text-gray-900 mt-1">
                      {profile?.department || "Human Resources"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <FaPhone className="text-green-600" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {/* Mobile */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <FaMobileAlt />
                      Mobile Number
                    </label>

                    {editing ? (
                      <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">
                        {profile?.mobileNumber || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <MdEmail />
                      Email Address
                    </label>

                    <p className="text-gray-900 mt-1 break-all">
                      {profile?.emailId}
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <FaHome />
                      Address
                    </label>

                    {editing ? (
                      <textarea
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">
                        {profile?.address || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank */}
              <div className="bg-gray-50 rounded-2xl p-5 lg:col-span-2">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <FaUniversity className="text-indigo-600" />
                  Bank Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Bank Name */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Bank Name
                    </label>

                    {editing ? (
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-xl"
                      />
                    ) : (
                      <p className="mt-2 text-gray-900">
                        {profile?.bankName || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Account No */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <FaCreditCard />
                      Account Number
                    </label>

                    {editing ? (
                      <input
                        type="text"
                        name="accountNo"
                        value={formData.accountNo}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-xl"
                      />
                    ) : (
                      <p className="mt-2 text-gray-900">
                        {profile?.accountNo
                          ? `XXXX XXXX ${profile.accountNo.slice(-4)}`
                          : "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* IFSC */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <FaIdCard />
                      IFSC Code
                    </label>

                    {editing ? (
                      <input
                        type="text"
                        name="ifsc"
                        value={formData.ifsc}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-xl uppercase"
                      />
                    ) : (
                      <p className="mt-2 text-gray-900 uppercase">
                        {profile?.ifsc || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            {editing && (
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaTimes />
                    Cancel
                  </div>
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaSave />
                    Save Changes
                  </div>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HRProfile;