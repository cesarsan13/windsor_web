export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/", "/windsor/formapago", "/windsor/productos"],
};
