import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="" className="uppercase text-2xl flex items-center text-grid gap-2 mb-8 h-16">
      <img src="/volleyball.png" alt="" className="w-10" />
      <h1 className="text-shadow-heavy font-Bebas-Neue">Phaqchas</h1>
    </Link>
  );
}