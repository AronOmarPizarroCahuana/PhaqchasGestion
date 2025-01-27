import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="" className="uppercase text-2xl flex items-center text-grid gap-2 mb-8 h-16">
<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
  <image href="/volleyball.png" x="0" y="0" height="40" width="40" />
</svg>
      <h1 className="text-shadow-heavy font-Bebas-Neue">Phaqchas</h1>
    </Link>
  );
}