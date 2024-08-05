export const DocumentosCobranza = async (token, fecha1, fecha2) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/documentosCobranza`, {
    method:'post',
    body: JSON.stringify({
      fecha_ini: fecha1,
      fecha_fin: fecha2,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
