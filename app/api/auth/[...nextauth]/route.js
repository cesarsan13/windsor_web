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
          headers: { "Content-Type": "application/json" },
        });
        const resjson = await res.json();
        const { status } = resjson;
        if (!status) throw new Error("Credenciales Incorrectas");

        resjson.data.token = resjson.token;

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
    signIn: "/windsor/auth/login",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: "next-auth.session-tokenw",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/windsor",
      },
    },
    csrfToken: {
      name: "next-auth.csrf-tokenw",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/windsor",
      },
    },
    callbackUrl: {
      name: "next-auth.callback-urlw",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/windsor",
      },
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
