import { useSession } from "next-auth/react";

export const guardaRegistro = async (data) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/register`, {
    method: "post",
    body: JSON.stringify({
      name: data.username,
      nombre: data.nombre,
      email: data.email,
      password: data.password
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson;
};

