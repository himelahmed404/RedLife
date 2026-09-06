import React from "react";
import DashboardLayout from "@/components/DashBoard/DashboardLayout";

export default function Layout({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}