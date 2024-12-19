    
export const guardaProyectos = async (data, accion) => {
    let url = "";

    if(accion === "Alta"){
        url = `${process.env.DOMAIN_API}api/basesDatos/post`;
    } else if (accion === "Editar"){
        url = `${process.env.DOMAIN_API}api/basesDatos/update`;
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