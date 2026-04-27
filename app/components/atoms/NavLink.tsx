"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { NavItem } from "@/app/types/ui";

/**
 * Atom Component: NavLink
 * Represents a navigation link in the dashboard.
 */
const NavLink = ({ icon, name, path }: NavItem) => {
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <Link
      href={path}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : 'text-white/50 hover:bg-white/5 hover:text-white'
        }
      `}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="text-sm tracking-wide">{name}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
      )}
    </Link>
  );
};

export default NavLink;
