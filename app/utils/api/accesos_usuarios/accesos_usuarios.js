export const getAccesosUsuarios = async (token,data) =>{
    let url = ""
    url =`${process.env.DOMAIN_API}api/accesoUsuario`
    const res = await fetch(url, {
        method:"post",
        body:JSON.stringify({
            id_usuario:data.id
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }),
    });
    const resJson = await res.json();
    return resJson.data;
}
export const guardaAccesosUsuarios = async (token,data) =>{
    let url = ""
    url =`${process.env.DOMAIN_API}api/accesoUsuario/update`
    const res = await fetch(url, {
        method:"post",
        body:JSON.stringify({
            id_usuario:data.id_usuario,
            id_punto_menu:data.id_punto_menu,
            t_a:data.t_a,
            altas:data.altas,
            bajas:data.bajas,
            cambios:data.cambios,
            impresion:data.impresion
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }),
    });
    const resJson = await res.json();
    return resJson;
}