import Image from "next/image";
import NavbarTop from "@/components/NavbarTop/NavbarTop";
import Booking from "@/components/Booking/Booking";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Booking></Booking>
    </div>
  );
}
