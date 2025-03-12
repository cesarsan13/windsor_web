export const getPropietario = async (token) => {
    let url = `${process.env.DOMAIN_API}api/propietario`;
    const res = await fetch(url, {
        method: "get", 
        headers:{
            'Authorization': `Bearer ${token}`,
            xescuela: localStorage.getItem("xescuela"),
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
            xescuela: localStorage.getItem("xescuela"),
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
            xescuela: localStorage.getItem("xescuela"),
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson;
};


export const siguienteConfiguracion = async (token) => {
    let url = `${process.env.DOMAIN_API}api/propietario/configuracion/siguiente`;
    const res = await fetch(url, {
        headers:{
            'Authorization': `Bearer ${token}`,
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const updateConfiguracion = async (token, data) => {
    let url = `${process.env.DOMAIN_API}api/propietario/configuracion/update`;
    const res = await fetch(url, {
        method: "put", 
        body: JSON.stringify({
            numero_configuracion: data.numero_configuracion,
            descripcion_configuracion: data.descripcion_configuracion,
            valor_configuracion: data.valor_configuracion,
            texto_configuracion: data.texto_configuracion,
        }),
        headers:{
            'Authorization': `Bearer ${token}`,
            xescuela: localStorage.getItem("xescuela"),
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson;
};

export const createConfiguracion = async (token, data) => {
    let url = `${process.env.DOMAIN_API}api/propietario/configuracion/create`;
    const res = await fetch(url, {
        method: "post", 
        body: JSON.stringify({
            numero_configuracion: data.numero_configuracion,
            descripcion_configuracion: data.descripcion_configuracion,
            valor_configuracion: data.valor_configuracion,
            texto_configuracion: data.texto_configuracion,
        }),
        headers:new Headers({
            'Authorization': `Bearer ${token}`,
            xescuela: localStorage.getItem("xescuela"),
            'Content-Type': "application/json",
        }),
    });
    const resJson = await res.json();
    return resJson;
};



