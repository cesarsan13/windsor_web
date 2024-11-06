
export const getMateriasPorGrupo = async (token, idHorario) => {
    if(idHorario > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/materiasGrupo/${idHorario}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};


export const getInfoActividadesXGrupo = async (token, idHorario, idBimestre) => {
    if(idHorario > 0 && idBimestre > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/detallesGrupoGeneral/${idHorario}/${idBimestre}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};

export const getActividadesXHorarioXAlumnoXMateriaXBimestre = async (token, idHorario, idAlumno, idMateria, idBimestre) => {
    if(idHorario > 0 && idBimestre > 0 && idAlumno > 0 && idMateria >0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/detalles/${idHorario}/${idAlumno}/${idMateria}/${idBimestre}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};

export const getMateriasReg = async (token, idHorario) => {
    if(idHorario > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/MateriasReg/${idHorario}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
}
};

export const getActividadesReg = async (token) => {
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/ActividadesReg`;
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

export const getAlumno = async (token, idHorario) => {
    if(idHorario > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/Alumno/${idHorario}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};

export const getActividadesDetalles = async (token, idMateria) => {
    if(idMateria > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/actividadesMateria/${idMateria}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};