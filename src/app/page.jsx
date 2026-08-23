import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Home/Hero";
import FourState from "@/components/Home/FourState";
import DonorsOnCall from "@/components/Home/DonorsOnCall";

export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero></Hero>
    <FourState></FourState>
    <DonorsOnCall></DonorsOnCall>
    <Footer></Footer>
    </>
  );
}
