export const getMenus = async (token, baja) => {
    let url = "";
    baja
        ? (url = `${process.env.DOMAIN_API}api/menu/baja`)
        : (url = `${process.env.DOMAIN_API}api/menu/get`);
    const res = await fetch(url, {
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
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
            xescuela: localStorage.getItem("xescuela"),
        }),
    }
    );
    const resJson = await res.json();
    return resJson.data;
};
export const guardarMenus = async (token, data, accion) => {
    let url = "";
    let method = '';
    if (accion === "Alta") {
        url = `${process.env.DOMAIN_API}api/menu/save`;
        method = 'POST';
        data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar" || accion ===  "Reactivar") {
        if (accion === "Eliminar") {
            data.baja = "*";
        } else {
            data.baja = "";
        }
        url = `${process.env.DOMAIN_API}api/menu/update`;
        method = 'POST'
    }

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
            xescuela: localStorage.getItem("xescuela"),
        }),
    });
    const resJson = await res.json();
    return resJson;
};