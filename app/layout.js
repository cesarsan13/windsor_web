import { Inter } from "next/font/google";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistema de Control Escolar",
  description: "Desarrollado por Interaccion Operativa S.A. de C.V.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="">
        <SessionAuthProvider>
          <div className="flex flex-col h-screen w-full lg:flex-row  bg-slate-100 ">
            {children}
          </div>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
