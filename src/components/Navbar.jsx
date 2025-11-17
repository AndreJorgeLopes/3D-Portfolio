import React, { useState } from "react";
import Link from "next/link";
import { styles } from "../styles";
import { navLinks } from "../constants";

const Navbar = () => {
  const [active, setActive] = useState("");

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-[99999] bg-primary`}
    >
      <div className="w-full flex items-center max-w-7xl mx-auto md:justify-between xs:justify-center">
        <div className="flex items-center">
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
            <span className="whitespace-nowrap text-[#915eff]">
              André Lopes &nbsp; 》
            </span>
          </p>
          <Link
            href="https://www.linkedin.com/in/andrejorgelopes/"
            className="flex items-center gap-2"
          >
            <div className="flex items-center cursor-pointer">
              <span className="inline-flex items-center space-x-0.5">
                <span className="text-white-600 font-medium">Linked</span>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white font-bold text-xs rounded">
                  In
                </span>
              </span>
            </div>
          </Link>
        </div>
        <ul className="list-none hidden md:flex flex-row gap-10 sm:gap-5 xs:hidden">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`${
                active === link.title ? "text-white" : "text-secondary"
              } font-poppins font-medium cursor-pointer text-[16px]`}
              onClick={() => setActive(link.title)}
            >
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
