"use client";

import React, { useState } from "react";
import NavbarLeft from "../NavbarLeft/NavbarLeft";

export default function Menu() {
  // Estado para controlar la visibilidad del menú
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para alternar la visibilidad del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Botón de menú */}
      <div className="flex items-center space-x-4">
        <button
          className="rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#F2D335", width: "3rem", height: "3rem" }}
          onClick={toggleMenu} // Al hacer clic, se alterna la visibilidad del menú
        >
          <img
            src="/menu.png"
            alt="Menu"
            className="w-8 h-8"
            style={{ width: "50%", height: "50%" }}
          />
        </button>
        <h1 className="text-shadow-heavy font-Bebas-Neue text-black text-lg">Menu</h1>
      </div>

      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-white z-50 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
        style={{ marginTop: "4rem" }} 
      >
        <NavbarLeft />
      </div>
    </div>
  );
}
