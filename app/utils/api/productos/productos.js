export const getProductos = async (baja) => {
    let url = ""
    baja
        ? (url = `http://127.0.0.1:8000/api/product/bajas`)
        : (url = `http://127.0.0.1:8000/api/product`)
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    const resJson = await res.json();
    return resJson.data;
}

export const getLastProduct = async () => {
    let url = `http://127.0.0.1:8000/api/product/last`
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    const resJson = await res.json();
    return resJson.data
}

export const guardarProductos = async (data, accion) => {
    console.log('data desde modal si no', data);
    let url = ""
    let met = ""
    if (accion === "Alta") {
        url = `http://127.0.0.1:8000/api/product/save`;
        data.baja = "n";
        met = "post";
    }
    if (accion === "Eliminar" || accion === "Editar") {
        if (accion === "Eliminar") {
            data.baja = "*";
        } else {
            data.baja = "n";
        }
        url = `http://127.0.0.1:8000/api/product/update/${data.id}`;
        met = "put";
    }
    const res = await fetch(`${url}`, {
        method: met,
        body: JSON.stringify({
            id: data.id,
            descripcion: data.descripcion,
            costo: data.costo,
            frecuencia: data.frecuencia,
            pro_recargo: data.pro_recargo,
            aplicacion: data.aplicacion,
            iva: data.iva,
            cond_1: data.cond_1,
            cam_precio: data.cam_precio,
            precio: data.precio,
            ref: data.ref,
            baja: data.baja,
        }),
        headers: new Headers({
            // Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }),
    })
    const resJson = await res.json();
    return resJson;
}