"use client";
import { SessionProvider } from "next-auth/react";
const SessionAuthProvider = ({ children }) => {
  return (
    <SessionProvider basePath="/windsor/api/auth">{children}</SessionProvider>
  );
};
export default SessionAuthProvider;
