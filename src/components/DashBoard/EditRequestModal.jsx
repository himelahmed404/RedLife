"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function EditRequestModal({ isOpen, onClose, request, onSave, isAdmin }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (request) {
      setFormData({
        recipientName: request.recipientName || "",
        bloodGroup: request.bloodGroup || "A+",
        hospitalName: request.hospitalName || "",
        districtName: request.districtName || "",
        upazilaName: request.upazilaName || "",
        address: request.address || "",
        donationDate: request.donationDate || "",
        donationTime: request.donationTime || "",
        message: request.message || "",
        status: request.status || "pending",
      });
    }
  }, [request]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(request._id, formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#10141C]/55 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-[16px] w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col z-10"
          >
            <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#E4E8ED] shrink-0">
              <h3 className="text-[17px] font-[700] text-[#10141C]">Edit Donation Request</h3>
              <button onClick={onClose} className="text-[#5C6675] hover:text-[#10141C]">
                <FiX className="text-[18px]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-[20px] grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-[600] text-[#10141C] mb-1">Recipient Name</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName || ""}
                  onChange={handleChange}
                  required
                  className="w-full h-[40px] border border-[#E4E8ED] rounded-[9px] px-[12px] text-[14px] outline-none focus:border-[#C1121F]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-[600] text-[#10141C] mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup || ""}
                  onChange={handleChange}
                  className="w-full h-[40px] border border-[#E4E8ED] rounded-[9px] px-[12px] text-[14px] outline-none focus:border-[#C1121F]"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {isAdmin && (
                <div>
                  <label className="block text-[12px] font-[600] text-[#10141C] mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status || "pending"}
                    onChange={handleChange}
                    className="w-full h-[40px] border border-[#E4E8ED] rounded-[9px] px-[12px] text-[14px] outline-none focus:border-[#C1121F]"
                  >
                    {["pending", "inprogress", "done", "canceled"].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[12px] font-[600] text-[#10141C] mb-1">Donation Date</label>
                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate || ""}
                  onChange={handleChange}
                  required
                  className="w-full h-[40px] border border-[#E4E8ED] rounded-[9px] px-[12px] text-[14px] outline-none focus:border-[#C1121F]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-[600] text-[#10141C] mb-1">Donation Time</label>
                <input
                  type="time"
                  name="donationTime"
                  value={formData.donationTime || ""}
                  onChange={handleChange}
                  required
                  className="w-full h-[40px] border border-[#E4E8ED] rounded-[9px] px-[12px] text-[14px] outline-none focus:border-[#C1121F]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[12px] font-[600] text-[#10141C] mb-1">Hospital Name</label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName || ""}
                  onChange={handleChange}
                  required
                  className="w-full h-[40px] border border-[#E4E8ED] rounded-[9px] px-[12px] text-[14px] outline-none focus:border-[#C1121F]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[12px] font-[600] text-[#10141C] mb-1">Full Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  required
                  className="w-full h-[40px] border border-[#E4E8ED] rounded-[9px] px-[12px] text-[14px] outline-none focus:border-[#C1121F]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[12px] font-[600] text-[#10141C] mb-1">Request Message</label>
                <textarea
                  rows="3"
                  name="message"
                  value={formData.message || ""}
                  onChange={handleChange}
                  className="w-full border border-[#E4E8ED] rounded-[9px] p-[10px] text-[14px] outline-none focus:border-[#C1121F]"
                ></textarea>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-[8px] pt-[10px] border-t border-[#E4E8ED] mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-[38px] px-[16px] rounded-[9px] border border-[#E4E8ED] text-[13.5px] font-[600] hover:bg-[#F5F7F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[38px] px-[18px] rounded-[9px] bg-[#C1121F] text-white text-[13.5px] font-[600] hover:bg-[#7A0A12] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}