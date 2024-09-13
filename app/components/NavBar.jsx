"use client";
import React from "react";
import Link from "next/link";
import Menu from "@/app/components/Menu";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

function NavBar() {
  const { data: session, status } = useSession();

  const [tema, setTema] = useState(true); // Valor por defecto
  const [theme, setTheme] = useState("light"); // Valor por defecto
  const [isDrawerOpen, setDraweOpen] = useState(false);
  const toogle = () => setDraweOpen(!isDrawerOpen);

  useEffect(() => {
    const temaInicial = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? false
      : true;
    setTema(temaInicial);

    const themeInicial = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme(themeInicial);
  }, []);


  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark");
      document.querySelector("html").setAttribute("data-theme", "dark");
      setTema(false);
    } else {
      document.querySelector("html").classList.remove("dark");
      document.querySelector("html").setAttribute("data-theme", "light");
      setTema(true);
    }
  }, [theme]);

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  if (!session) {
    return <></>;
  }
  const handleSingOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/control_escolar" });
  };
  return (
    <div className="navbar sticky top-0 h-full max-h-7 bg-[#1f2a30] z-[2]">
      <div className="navbar-start">
        <div className="drawer">
          <input
            type="checkbox"
            id="my-drawer"
            className="drawer-toggle"
            checked={isDrawerOpen}
            onChange={toogle}
          />
          <div className="drawer-content">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer"
                className="btn btn-square btn-ghost text-black dark:text-white"
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
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <Menu
              vertical={true}
              toogle={toogle}
            ></Menu>
          </div>
        </div>
        <Link className="btn btn-ghost text-xl text-white" href="/">
          Control Escolar
        </Link>
        <div className="hidden lg:flex lg:flex-row">
          <Menu vertical={false}></Menu>
        </div>
      </div>
      <div className="navbar-end ">
        <div className="tooltip tooltip-left" data-tip="Cerrar Sesion">
          <button
            className="btn btn-circle bg-[#2c3941] border-none text-white"
            onClick={handleSingOut}
          >
            <i className="fas fa-x"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
