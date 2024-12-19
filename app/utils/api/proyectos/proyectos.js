    
export const guardaProyectos = async (data, accion) => {
    let url = "";

    if(accion === "Alta"){
        url = `${process.env.DOMAIN_API_PROYECTOS}api/basesDatos/post`;
    } else if (accion === "Editar"){
        url = `${process.env.DOMAIN_API_PROYECTOS}api/basesDatos/update`;
    }
    const res = await fetch(`${url}`,{
        method: "post",
        body: JSON.stringify({
            id:data.id,
            nombre:data.nombre,
            host:data.host,
            port:data.port,
            database:data.database,
            username:data.username,
            password:data.password,
            clave_propietario:data.clave_propietario,
            proyecto:data.proyecto,
        }),
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });
    const resJson = await res.json();
    return resJson;
}
export const getProyectos = async () => {
    let url = "";
    baja
      : (url = `${process.env.DOMAIN_API_PROYECTOS}api/basesDatos/`);
  
    const res = await fetch(url, {
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });
    const resJson = await res.json();
    return resJson.data;
  };
  export const siguiente = async () => {
    const res = await fetch(`${process.env.DOMAIN_API_PROYECTOS}api/basesDatos/siguiente`, {
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });
    const resJson = await res.json();
    return resJson.data;
  };