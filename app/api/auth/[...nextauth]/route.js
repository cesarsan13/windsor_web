import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        name: { label: "Usuario", type: "text", placeholder: "usuario123" },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "*****",
        },
      },

      async authorize(credentials, request) {
        const { csrfToken, ...data } = credentials;
        const res = await fetch(`${process.env.DOMAIN_API}api/login`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: new Headers({ "Content-Type": "application/json" }),
        });
        const resjson = await res.json();
        const { status,message } = resjson;        
        if (!status) throw new Error(message.errorInfo ? message.errorInfo : message);

        resjson.data.token = resjson.token;
        
        resjson.data.xescuela = credentials.xescuela;

        return resjson.data;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/control_escolar/auth/login",
    signOut: "/control_escolar",
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: "next-auth.session-tokenw",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/control_escolar",
      },
    },
    csrfToken: {
      name: "next-auth.csrf-tokenw",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/control_escolar",
      },
    },
    callbackUrl: {
      name: "next-auth.callback-urlw",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/control_escolar",
      },
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
