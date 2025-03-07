
export const guardaRegistro = async (data) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/register`, {
    method: "post",
    body: JSON.stringify({
      name: data.name,
      nombre: data.nombre,
      email: data.email,
      password: data.password,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson;
};

