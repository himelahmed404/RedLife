import Link from "next/link";
import { FiArrowLeft, FiList } from "react-icons/fi";
import Pageshell from "@/components/Pageshell";
import StatusScreen, { primaryButtonClass, secondaryButtonClass } from "@/components/StatusScreen";

export const metadata = {
  title: "Page not found · RedLife",
};

export default function NotFound() {
  return (
    <Pageshell>
      <StatusScreen
        code="404"
        eyebrow="Error · 404 · page not found"
        title="No match for this page in the register."
        description="The page you are looking for was moved, removed, or never existed. Donors are still on call though. Head back and keep searching."
      >
        <Link href="/" className={primaryButtonClass}>
          <FiArrowLeft className="text-lg" /> Back to home
        </Link>
        <Link href="/donation-requests" className={secondaryButtonClass}>
          <FiList className="text-lg" /> Donation board
        </Link>
      </StatusScreen>
    </Pageshell>
  );
}
