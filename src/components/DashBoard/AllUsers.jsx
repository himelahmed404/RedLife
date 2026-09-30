"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiMoreVertical, FiSlash, FiCheckCircle, FiShield, FiUserCheck } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import BloodToken from "@/components/DashBoard/BloodToken";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;
import toast from "react-hot-toast";
import Image from "next/image";

export default function AllUsers() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [pageInfo, setPageInfo] = useState({ total: 0, totalPages: 1, counts: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);

  const menuRef = useRef(null);

  // Close popup menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch one page of users (server filters by status) ──
  useEffect(() => {
    let ignore = false;

    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (activeFilter !== "all") params.set("status", activeFilter);

    apiFetch(`/api/admin/users?${params}`)
      .then((data) => {
        if (ignore) return;
        // Blocking the last user on a filtered page can empty it; step back
        if (data.items.length === 0 && page > data.totalPages) {
          setPage(data.totalPages);
          return;
        }
        setUsers(data.items);
        setPageInfo(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not load users.");
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [activeFilter, page, reloadKey]);

  const changeFilter = (key) => {
    setActiveFilter(key);
    setPage(1);
    setIsLoading(true);
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    setIsLoading(true);
  };

  const isBlocked = (user) => user.status === "blocked";

  const counts = pageInfo.counts;
  const filteredUsers = users;

  // Action: Toggle Active / Blocked
  const handleToggleStatus = async (userId, currentIsActive) => {
    const nextStatus = currentIsActive ? "blocked" : "active";
    try {
      await apiFetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        body: { status: nextStatus },
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
      );
      setOpenMenuId(null);
      toast.success(nextStatus === "active" ? "User unblocked." : "User blocked.");
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Action: Update Role
  const handleChangeRole = async (userId, nextRole) => {
    try {
      await apiFetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        body: { role: nextRole },
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: nextRole } : u
        )
      );
      setOpenMenuId(null);
      toast.success(`Role changed to ${nextRole}.`);
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-full max-w-[1180px] mx-auto">
      {/* Heading */}
      <div className="mb-[22px]">
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[6px]">
          ADMIN · PEOPLE
        </p>
        <h2 className="text-[clamp(24px,3vw,30px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
          All users
        </h2>
      </div>

      {/* Card Table */}
      <div className="bg-white border border-[#E4E8ED] rounded-[14px] overflow-visible">
        {/* Tabs: All / Active / Blocked */}
        <div className="flex items-center gap-[6px] p-[12px_16px] border-b border-[#E4E8ED]">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "active" },
            { key: "blocked", label: "blocked" },
          ].map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => changeFilter(tab.key)}
                className={`flex items-center gap-[6px] h-[32px] px-[12px] rounded-[9px] text-[13px] font-[600] capitalize transition-colors ${
                  isActive
                    ? "bg-[#FDF1F2] text-[#C1121F]"
                    : "text-[#5C6675] hover:bg-[#F5F7F9] hover:text-[#10141C]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono px-[5px] py-[1px] rounded-full ${
                    isActive ? "bg-[#C1121F] text-white" : "bg-[#F5F7F9] text-[#5C6675]"
                  }`}
                >
                  {counts[tab.key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-[#E4E8ED] font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#5C6675]">
                <th className="py-[12px] px-[16px] font-[500]">USER</th>
                <th className="py-[12px] px-[16px] font-[500]">EMAIL</th>
                <th className="py-[12px] px-[16px] font-[500]">GROUP</th>
                <th className="py-[12px] px-[16px] font-[500]">ROLE</th>
                <th className="py-[12px] px-[16px] font-[500]">STATUS</th>
                <th className="py-[12px] px-[16px] font-[500] text-right">MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-[40px] text-center text-[#5C6675] font-mono text-[13px]">
                    Loading user directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-[40px] text-center text-[#5C6675] text-[14px]">
                    No users found for this status.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isUserActive = !isBlocked(user);
                  const displayRole = (user.role || "donor").toUpperCase();
                  const isMenuOpen = openMenuId === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="border-b border-[#E4E8ED] hover:bg-[#F5F7F9] transition-colors last:border-b-0"
                    >
                      {/* Avatar & Name */}
                      <td className="py-[14px] px-[16px] align-middle">
                        <div className="flex items-center gap-[12px]">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={32}
                              height={32}
                              className="w-[32px] h-[32px] rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <span className="w-[32px] h-[32px] rounded-full bg-[#10141C] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                              {getInitials(user.name)}
                            </span>
                          )}
                          <span className="font-[600] text-[14px] text-[#10141C]">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-[14px] px-[16px] font-mono text-[13px] text-[#5C6675] align-middle">
                        {user.email}
                      </td>

                      {/* Blood Group */}
                      <td className="py-[14px] px-[16px] align-middle">
                        <BloodToken group={user.bloodGroup} />
                      </td>

                      {/* Role Pill */}
                      <td className="py-[14px] px-[16px] align-middle">
                        <span className="inline-flex items-center justify-center h-[24px] px-[10px] rounded-[6px] font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#10141C] bg-[#F5F7F9]">
                          {displayRole}
                        </span>
                      </td>

                      {/* Status Pill: ACTIVE vs BLOCKED */}
                      <td className="py-[14px] px-[16px] align-middle">
                        {isUserActive ? (
                          <span className="inline-flex items-center gap-[6px] h-[24px] px-[9px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#15803D] bg-[#EDF7F0]">
                            <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-[6px] h-[24px] px-[9px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#C1121F] bg-[#FDF1F2]">
                            <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                            BLOCKED
                          </span>
                        )}
                      </td>

                      {/* Dropdown Menu (not on your own row) */}
                      <td className="py-[14px] px-[16px] text-right align-middle relative">
                        {user._id === session?.user?.id ? (
                          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#A7B0BF]">you</span>
                        ) : (
                        <button
                          onClick={() => setOpenMenuId(isMenuOpen ? null : user._id)}
                          className="w-[32px] h-[32px] rounded-[8px] inline-flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#E4E8ED]/50 transition-colors"
                        >
                          <FiMoreVertical className="text-[17px]" />
                        </button>
                        )}

                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            className="absolute right-[16px] top-[48px] w-[180px] bg-white border border-[#E4E8ED] rounded-[12px] shadow-[0_12px_32px_rgba(16,20,28,0.13)] py-[6px] px-[6px] z-50 text-left"
                          >
                            {/* Block / Unblock button */}
                            <button
                              onClick={() => handleToggleStatus(user._id, isUserActive)}
                              className={`w-full flex items-center gap-[9px] px-[10px] py-[8px] rounded-[8px] text-[13px] font-[500] hover:bg-[#F5F7F9] transition-colors ${
                                !isUserActive ? "text-[#15803D]" : "text-[#C1121F]"
                              }`}
                            >
                              {!isUserActive ? (
                                <>
                                  <FiCheckCircle className="text-[15px]" /> Unblock user
                                </>
                              ) : (
                                <>
                                  <FiSlash className="text-[15px]" /> Block user
                                </>
                              )}
                            </button>

                            <hr className="border-t border-[#E4E8ED] my-[4px]" />

                            {/* Role switches */}
                            {displayRole !== "VOLUNTEER" && (
                              <button
                                onClick={() => handleChangeRole(user._id, "volunteer")}
                                className="w-full flex items-center gap-[9px] px-[10px] py-[8px] rounded-[8px] text-[13px] text-[#10141C] hover:bg-[#F5F7F9] transition-colors"
                              >
                                <FiUserCheck className="text-[15px] text-[#5C6675]" /> Make volunteer
                              </button>
                            )}

                            {displayRole !== "ADMIN" && (
                              <button
                                onClick={() => handleChangeRole(user._id, "admin")}
                                className="w-full flex items-center gap-[9px] px-[10px] py-[8px] rounded-[8px] text-[13px] text-[#10141C] hover:bg-[#F5F7F9] transition-colors"
                              >
                                <FiShield className="text-[15px] text-[#5C6675]" /> Make admin
                              </button>
                            )}

                            {displayRole !== "DONOR" && (
                              <button
                                onClick={() => handleChangeRole(user._id, "donor")}
                                className="w-full flex items-center gap-[9px] px-[10px] py-[8px] rounded-[8px] text-[13px] text-[#10141C] hover:bg-[#F5F7F9] transition-colors"
                              >
                                <FiUserCheck className="text-[15px] text-[#5C6675]" /> Make donor
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <Pagination
          page={page}
          totalPages={pageInfo.totalPages}
          onChange={changePage}
          summary={`showing ${filteredUsers.length} of ${pageInfo.total} users`}
          className="p-[12px_16px] border-t border-[#E4E8ED]"
        />
      </div>
    </div>
  );
}