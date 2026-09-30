import Pageshell from "@/components/Pageshell";

// Login and register get the same navbar and footer as the rest of the site
export default function AuthLayout({ children }) {
  return <Pageshell>{children}</Pageshell>;
}
