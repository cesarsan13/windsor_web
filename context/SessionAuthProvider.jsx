"use client";
import { SessionProvider } from "next-auth/react";
const SessionAuthProvider = ({ children }) => {
  return (
    <SessionProvider basePath="/control_escolar/api/auth">
      {children}
    </SessionProvider>
  );
};
export default SessionAuthProvider;
