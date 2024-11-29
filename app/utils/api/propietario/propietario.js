
export const getPropietario = async (token) => {
    let url = `${process.env.DOMAIN_API}api/propietario`;
    const res = await fetch(url, {
        method: "get", 
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getConfiguracion = async (token) => {
    let url = `${process.env.DOMAIN_API}api/propietario/configuracion`;
    const res = await fetch(url, {
        method: "get", 
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const updatePropietario = async (token, data) => {
    let url = `${process.env.DOMAIN_API}api/propietario/update`;
    const res = await fetch(url, {
        method: "put", 
        body: JSON.stringify({
            nombre: data.nombre_I,
            clave_seguridad: data.cve_Seguridad_I,
            busqueda_max: data.max_Busqueda_I,
            con_recibos: data.numero_Recibo_I,
            con_facturas: data.numero_Factura_I, 
            clave_bonificacion: data.cve_Bonificacion_I,
        }),
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson;
};