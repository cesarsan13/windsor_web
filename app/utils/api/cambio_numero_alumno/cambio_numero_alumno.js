export const cambiarIdAlumno = async (token, data) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/students-cambio-id`, {
    method: "PUT",
    body: JSON.stringify({
      numero_ant: data.numero_ant,
      numero_nuev: data.numero_nuevo,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson;
};
