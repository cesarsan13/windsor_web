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

        // resjson.data.user_data =
        //   resjson.data.rol_id === "2"
        //     ? resjson.data.paciente
        //     : resjson.data.rol_id === "3"
        //     ? resjson.data.medico
        //     : [];
        resjson.data.token = resjson.token;

        // const accesos_rol = await getAccesosRol(
        //   resjson.token,
        //   resjson.data.rol_id
        // );
        // if (accesos_rol.status) {
        //   resjson.data.permisos = accesos_rol.data;
        // }

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
      name: "next-auth.session-token-escolar",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/windsor",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
