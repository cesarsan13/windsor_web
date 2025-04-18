"use client";
import React from "react";
import Link from "next/link";
import Menu from "@/app/components/Menu";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import SistemaInfo from "@/app/components/SistemaInfo";

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
    <>
      <div className="navbar sticky top-0 h-full max-h-7 bg-base-200 dark:bg-slate-700 lg:z-50 z-[5]">
        <div className="navbar-start">
          <div className="drawer pr-5 lg:hidden">
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
              <Menu vertical={true} toogle={toogle}></Menu>
            </div>
          </div>
          <Link
            className="btn btn-ghost text-xl text-black dark:text-white"
            href="/"
          >
            <h1>Sistema Escolar</h1>
          </Link>
          <div className="navbar-center hidden lg:flex">
            <Menu vertical={false}></Menu>
          </div>
          <div className="navbar-end absolute top-0 right-0 mr-4 mt-2 flex items-center">
            <div className="tooltip tooltip-left" data-tip="Cerrar Sesion">
              <button className="btn btn-circle btn-sm" onClick={handleSingOut}>
                <i className="fas fa-x"></i>
              </button>
            </div>
            <label className="btn btn-circle btn-sm swap swap-rotate ml-2">
              <input
                type="checkbox"
                onClick={handleChangeTheme}
                defaultChecked={tema}
              />
              <svg
                className="swap-on h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
              <svg
                className="swap-off h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </div>
        </div>         
      </div>
      <SistemaInfo />
    </>
  );
}

export default NavBar;
