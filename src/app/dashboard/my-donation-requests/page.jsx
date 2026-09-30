import DonationRequestsCards from "@/components/DashBoard/DonationRequestsCards";

export default function MyDonationRequests() {
  return (
    <DonationRequestsCards
      scope="mine"
      eyebrow="My requests"
      title="My donation requests"
    />
  );
}
