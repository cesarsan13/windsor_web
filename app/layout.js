import { Inter } from "next/font/google";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import NavBar from "@/app/components/NavBar";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] });

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
          <div className="bg-gray-100 dark:bg-slate-900 flex flex-col h-[calc(100vh)]">
            <div className="h-[calc(10%)]">
              <NavBar></NavBar>
            </div>
            <div className="flex justify-center  h-[calc(90%)]">{children}</div>
          </div>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
