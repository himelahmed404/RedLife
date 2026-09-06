import Hero from "@/components/Home/Hero";
import FourState from "@/components/Home/FourState";
import DonorsOnCall from "@/components/Home/DonorsOnCall";
import ContactHome from "@/components/Home/ContactHome";
import Pageshell from "@/components/Pageshell";

export default function Home() {
  return (
    <>
    <Pageshell>
    <Hero></Hero>
    <FourState></FourState>
    <DonorsOnCall></DonorsOnCall>
    <ContactHome></ContactHome>
    </Pageshell>
    </>
  );
}
