"use client";
import React from "react";
import Link from "next/link";
import Menu from "@/app/components/Menu";
import { useSession, signOut } from "next-auth/react";
function NavBar() {
  const { data: session, status } = useSession();
  if (!session) {
    return <></>;
  }
  const handleSingOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };
  return (
    <div className="navbar sticky top-0 h-full max-h-7 bg-slate-100 z-[2]">
      <div className="navbar-start">
        <div className="dropdown">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
          </div>

          <Menu vertical={true}></Menu>
        </div>
        <Link className="btn btn-ghost text-xl" href="/">
          Sistema Escolar
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <Menu vertical={false}></Menu>
      </div>
      <div className="navbar-end ">
        <div className="tooltip tooltip-left" data-tip="Cerrar Sesion">
          <button className="btn btn-circle" onClick={handleSingOut}>
            <i className="fas fa-x"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
