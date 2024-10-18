import { useSession } from "next-auth/react";

export const guardaRegistro = async (data) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/register`, {
    method: "post",
    body: JSON.stringify({
      name: data.name,
      nombre: data.nombre,
      email: data.email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson;
};

