import { Inter } from "next/font/google";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import NavBar from "@/app/components/NavBar";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";
import Menu from "./components/Menu";
export const metadata = {
  title: "Sistema de Control Escolar",
  description: "Desarrollado por Interaccion Operativa S.A. de C.V.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="">
        <SessionAuthProvider>
          <div className="bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh)]">
            <div className="drawer">
              <input
                id="my-drawer-3"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content flex flex-col">
                <div className="h-[calc(10%)]">
                  <NavBar></NavBar>
                </div>
                <div className="flex justify-center  h-[calc(90%)] ">
                  {children}
                </div>
              </div>
              <div className="drawer-side z-10">
                <label
                  htmlFor="my-drawer-3"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <Menu vertical={true}></Menu>
              </div>
            </div>
          </div>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
