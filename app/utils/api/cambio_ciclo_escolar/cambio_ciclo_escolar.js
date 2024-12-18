export const cambiarCicloEscolar = async (token, data) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/students/cambio-ciclo`,
    {
      method: "PUT",
      body: JSON.stringify({
        ciclo_escolar: data.nuevo_ciclo,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        xescuela: localStorage.getItem("xescuela"),
      }),
    }
  );
  const resJson = await res.json();
  return resJson;
};
export const getCicloEscolar = async (token) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/students/cicloEscolar`,
    {
      headers: new Headers({
        Authorization: "Bearer " + token,
        xescuela: localStorage.getItem("xescuela"),
      }),
    }
  );
  const resJson = await res.json();
  return resJson.data;
};
