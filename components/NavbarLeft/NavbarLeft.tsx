import React, { useState } from "react";
import {
  FaCalendarCheck,
  FaBullhorn,
  FaUser,
  FaUserShield,
  FaFileAlt,
  FaChevronDown,
} from "react-icons/fa";
import Link from "next/link";

export default function NavbarLeft() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };
  return (
    <nav className="fixed top-0 -mt-4 sm:mt-0 left-0 h-screen w-75 bg-white text-[#191D23] p-6 z-50 shadow-md">
    <div className="text-gray-500 text-sm mb-4">Menú</div>
    <ul className="space-y-3">
      <li className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full">
        <Link href="/AdminGestion/Reserva" className="flex items-center space-x-2 w-full">
          <FaCalendarCheck className="sm:text-xl" />
          <span>Reserva</span>
        </Link>
      </li>

      <li className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full">
        <Link href="/AdminGestion/Anuncio" className="flex items-center space-x-2 w-full">
          <FaBullhorn className="sm:text-xl" />
          <span>Anuncio web</span>
        </Link>
      </li>

      {/* Mantenimiento Local */}
      <li className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
        onClick={() => toggleMenu("mantenimiento")}>
        <FaUser className="sm:text-xl" />
        <span>Mantenimiento Local</span>
        <FaChevronDown className={`ml-auto transition-transform duration-300 ${openMenu === "mantenimiento" ? "rotate-180" : ""}`} />
      </li>
      {openMenu === "mantenimiento" && (
        <ul className="space-y-2 pl-6 border-l-2 border-gray-300 w-full">
          <li>
            <Link href="/AdminGestion/Deportes" className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md w-full">
              Deportes
            </Link>
          </li>
          <li>
            <Link href="/AdminGestion/Canchas" className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md w-full">
              Canchas
            </Link>
          </li>
        </ul>
      )}

      {/* Cliente */}
      <li className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
        onClick={() => toggleMenu("cliente")}>
        <FaUser className="sm:text-xl" />
        <span>Cliente</span>
        <FaChevronDown className={`ml-auto transition-transform duration-300 ${openMenu === "cliente" ? "rotate-180" : ""}`} />
      </li>
      {openMenu === "cliente" && (
        <ul className="space-y-2 pl-6 border-l-2 border-gray-300 w-full">
          <li>
            <Link href="/Mantenimiento-cliente" className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md w-full">
              Lista Cliente
            </Link>
          </li>
          <li>
            <Link href="/AdminGestion/Historial-cliente" className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md w-full">
              Lista suspendidos...
            </Link>
          </li>
        </ul>
      )}

      {/* Administradores */}
      <li className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
        onClick={() => toggleMenu("admin")}>
        <FaUserShield className="sm:text-xl" />
        <span>Administradores</span>
        <FaChevronDown className={`ml-auto transition-transform duration-300 ${openMenu === "admin" ? "rotate-180" : ""}`} />
      </li>
      {openMenu === "admin" && (
        <ul className="space-y-2 pl-6 border-l-2 border-gray-300 w-full">
          <li>
            <Link href="/AdminGestion/Mantenimiento-rol" className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md w-full">
              Mantenimiento roles
            </Link>
          </li>
        </ul>
      )}

      {/* Reportes */}
      <li className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
        onClick={() => toggleMenu("reporte")}>
        <FaFileAlt className="sm:text-xl" />
        <span>Reporte</span>
        <FaChevronDown className={`ml-auto transition-transform duration-300 ${openMenu === "reporte" ? "rotate-180" : ""}`} />
      </li>
      {openMenu === "reporte" && (
        <ul className="space-y-2 pl-6 border-l-2 border-gray-300 w-full">
          <li>
            <Link href="/AdminGestion/Report-mes" className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md w-full">
              Mes
            </Link>
          </li>
        </ul>
      )}
    </ul>
  </nav>
  );
}
