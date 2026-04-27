'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DashboardButton = ({icon, name, path}: {icon: React.ReactNode; name: string; path: string}) => {
 const params = usePathname().split("/")

    return (
    <Link
      href={`${path}`}
      className={`group ${params[params.length-1] === path ? 'bg-gradient-to-r from-blue-400 to-blue-600': ''} flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 font-medium`}
    >
      <span className={`${icon} text-xl`} ></span>
      <span>{name}</span>
    </Link>
  );
};

export default DashboardButton;
