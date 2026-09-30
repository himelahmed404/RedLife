import RoleGuard from "@/components/DashBoard/RoleGuard";
import AllUsers from "@/components/DashBoard/AllUsers";

export default function AllUsersPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <AllUsers />
    </RoleGuard>
  );
}
