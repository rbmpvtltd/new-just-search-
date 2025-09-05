"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline, IoLogInOutline, IoMenu } from "react-icons/io5";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMenuOpen(false); // set false on resize
    };

    window.addEventListener("resize", handleResize);

    // cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="px-4 md:px-16 py-3 md:py-6 flex justify-between sm:items-center items-baseline md:shadow-[2px_3px_4px_rgba(0,0,0,0.197)] z-50">
      <nav className="flex items-center gap-2 md:gap-12">
        <IoMenu className="text-3xl md:hidden" onClick={toggleMenu} />
        <div className="">
          <Image
            src="/images/logo-v2.png"
            alt="logo image"
            width={200}
            height={10}
          />
        </div>
        <div
          className={`fixed top-0 left-0 h-full w-[70%] sm:w-[50%] bg-white shadow-lg transform z-50 transition-transform duration-500 ease-in-out md:static md:h-auto  md:bg-transparent md:shadow-none flex flex-col pt-10  px-8 py-12 md:px-0 md:py-0 gap-10 md:gap-8 md:font-semibold md:text-amber-600 md:flex-row ${
            isMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0 shadow-background"
          }`}
        >
          <IoCloseCircleOutline
            className="absolute top-10 block md:hidden right-5 font-bold"
            onClick={toggleMenu}
          />
          <Link
            href="#"
            className="hover:text-black transition-colors duration-300 text-amber-600"
          >
            Home
          </Link>
          <Link
            href="#"
            className="hover:text-black transition-colors duration-300 text-amber-600"
          >
            Hire
          </Link>
          <Link
            href="#"
            className="hover:text-black transition-colors duration-300 text-amber-600"
          >
            Offer
          </Link>
          <Link
            href="#"
            className="hover:text-black transition-colors duration-300 text-amber-600"
          >
            Favourite
          </Link>
        </div>
      </nav>
      <div className="flex items-center gap-2">
        <IoLogInOutline className="text-amber-600 text-3xl font-bold" />
        <p className="text-amber-600  font-bold hover:text-black transition-colors duration-300">
          Sign In
        </p>
      </div>
    </div>
  );
}

export default Navbar;
