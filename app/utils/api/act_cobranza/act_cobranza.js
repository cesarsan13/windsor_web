export const getDocumentosAlumno = async (token, alumno_id) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/act-cobranza/doc-alumno`,
    {
      method: "post",
      body: JSON.stringify({
        alumno: alumno_id,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        xescuela: localStorage.getItem("xescuela"),
        "Content-Type": "application/json",
      }),
    }
  );
  const resJson = await res.json();
  return resJson.data;
};

export const guardarActCobranza = async (token,accion,data)=>{
  let url = "";
  if (accion==="Alta"){
    url = `${process.env.DOMAIN_API}api/act-cobranza/post`
  }
  if(accion==="Eliminar"||accion==="Editar"){
    if(accion==="Eliminar"){
      url = `${process.env.DOMAIN_API}api/act-cobranza/delete`
    } else{
      url = `${process.env.DOMAIN_API}api/act-cobranza/update`
    }
  }
  const res = await fetch(`${url}`,{
    method:"post",
    body:JSON.stringify({
      alumno:data.alumno,
      producto:data.producto,
      numero_doc:data.numero_doc,
      fecha:data.fecha,
      importe:data.importe,
      descuento:data.descuento
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson;
}