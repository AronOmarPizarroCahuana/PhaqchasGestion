
import React from "react";
import Logo from "../logo/logo";
import Menu from "../Menu/Menu";
export default function NavbarTop() {

    return (
        <nav className="fixed top-0 left-0 w-screen h-16 flex items-center px-4 z-50 bg-white">
        <div className="flex items-center">
            <Menu />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-6">
            <Logo />
        </div>
    </nav>
    );
}