export const getMenus = async (token, baja) => {
    let url = "";
    baja
        ? (url = `${process.env.DOMAIN_API}api/menu/baja`)
        : (url = `${process.env.DOMAIN_API}api/menu/get`);
    const res = await fetch(url, {
        headers: new Headers({
            Authorization: "Bearer " + token,
        }),
    });
    const resJson = await res.json();
    return resJson.data;
};
export const siguiente = async (token) => {
    const res = await fetch(
        `${process.env.DOMAIN_API}api/menu/siguiente`, {
        headers: new Headers({
            Authorization: "Bearer " + token,
        }),
    }
    );
    const resJson = await res.json();
    return resJson.data;
};
export const guardarMenus = async (token, accion, data) => {
    let url = "";
    let method = '';
    if (accion === "Alta") {
        url = `${process.env.DOMAIN_API}api/menu/save`;
        method = 'POST';
        data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar") {
        if (accion === "Eliminar") {
            data.baja = "*";
        } else {
            data.baja = "";
        }
        url = `${process.env.DOMAIN_API}api/menu/update`;
        method = 'PUT'
    }
    console.log('URL', url);
    console.log('metodo', method);
    const res = await fetch(`${url}`, {
        method: method,
        body: JSON.stringify({
            numero: data.numero,
            nombre: data.nombre,
            baja: data.baja,
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }),
    });
    const resJson = await res.json();
    return resJson;
};