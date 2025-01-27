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
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white text-[#191D23] p-4 z-50 shadow-lg">
      <ul className="space-y-2">
    
        <li className="flex items-center space-x-2 font-medium text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md transition-colors duration-300 ease-in-out cursor-pointer">
          <Link href="/AdminGestion/Reserva" className="flex items-center space-x-2">
            <FaCalendarCheck />
            <span>Reserva</span>
          </Link>
        </li>
        <li className="flex items-center space-x-2 font-medium text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md transition-colors duration-300 ease-in-out cursor-pointer">
          <Link href="/AdminGestion/Anuncio" className="flex items-center space-x-2">
            <FaBullhorn />
            <span>Anuncio web</span>
          </Link>
        </li>

        <li
          className="flex items-center space-x-2 font-medium text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
          onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
        >
          <FaUser />
          <span>Cliente</span>
          <span
            className={`ml-auto transition-transform duration-300 ${
              isClientMenuOpen ? "rotate-180" : ""
            }`}
          >
            <FaChevronDown />
          </span>
        </li>
        {isClientMenuOpen && (
          <ul className="space-y-2 pl-6">
            <li>
              <Link
                href="/Mantenimiento-cliente"
                className="text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              >
                Mantenimiento
              </Link>
            </li>
            <li>
              <Link
                href="/AdminGestion/Historial-cliente"
                className="text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              >
                Historial
              </Link>
            </li>
           
          </ul>
        )}

      
        <li
          className="flex items-center space-x-2 font-medium text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
          onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
        >
          <FaUserShield />
          <span>Administradores</span>
          <span
            className={`ml-auto transition-transform duration-300 ${
              isAdminMenuOpen ? "rotate-180" : ""
            }`}
          >
            <FaChevronDown />
          </span>
        </li>
        {isAdminMenuOpen && (
          <ul className="space-y-2 pl-6">
            <li>
              <Link
                href="/AdminGestion/Mantenimiento-rol"
                className="text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              >
                Mantenimiento roles
              </Link>
            </li>
          </ul>
        )}

      
        <li
          className="flex items-center space-x-2 font-medium text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
          onClick={() => setIsReportMenuOpen(!isReportMenuOpen)}
        >
          <FaFileAlt />
          <span>Reporte</span>
          <span
            className={`ml-auto transition-transform duration-300 ${
              isReportMenuOpen ? "rotate-180" : ""
            }`}
          >
            <FaChevronDown />
          </span>
        </li>
        {isReportMenuOpen && (
          <ul className="space-y-2 pl-6">
            <li>
              <Link
                href="/AdminGestion/Report-semana"
                className="text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              >
                Semana
              </Link>
            </li>
            <li>
              <Link
                href="/AdminGestion/Report-semana"
                className="text-lg text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              >
                Mes
              </Link>
            </li>
          </ul>
        )}

       
      </ul>
    </nav>
  );
}
