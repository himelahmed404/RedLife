"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function DeleteRequestModal({ isOpen, onClose, request, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!request?._id) return;
    setIsDeleting(true);
    try {
      await onDelete(request._id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && request && (
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
            className="relative bg-white rounded-[16px] w-full max-w-[420px] shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#E4E8ED]">
              <h3 className="text-[17px] font-[700] text-[#10141C]">Delete this request?</h3>
              <button onClick={onClose} className="text-[#5C6675] hover:text-[#10141C]">
                <FiX className="text-[18px]" />
              </button>
            </div>
            <div className="p-[20px]">
              <p className="text-[13.5px] text-[#5C6675]">
                The request for <strong className="text-[#10141C]">{request.recipientName}</strong> will be permanently removed. This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-[8px] px-[20px] py-[14px] bg-[#F5F7F9] border-t border-[#E4E8ED]">
              <button
                onClick={onClose}
                className="h-[38px] px-[16px] rounded-[9px] border border-[#E4E8ED] bg-white font-[600] text-[13.5px] text-[#10141C] hover:bg-[#F5F7F9]"
              >
                Keep it
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-[38px] px-[16px] rounded-[9px] bg-[#C1121F] hover:bg-[#7A0A12] font-[600] text-[13.5px] text-white transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete request"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}