import RoleGuard from "@/components/DashBoard/RoleGuard";
import DonationRequestsCards from "@/components/DashBoard/DonationRequestsCards";

export default function AllBloodDonationRequests() {
  return (
    <RoleGuard allow={["admin", "volunteer"]}>
      <DonationRequestsCards
        scope="all"
        eyebrow="All requests"
        title="All blood donation requests"
      />
    </RoleGuard>
  );
}
