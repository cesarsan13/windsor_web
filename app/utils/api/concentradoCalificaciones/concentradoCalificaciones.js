
export const getMateriasPorGrupo = async (token, $idHorario) => {
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/materiasGrupo/` + $idHorario;
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


export const getInfoActividadesXGrupo = async (token, idHorario, idBimestre) => {
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
};

export const getActividadesXHorarioXAlumnoXMateriaXBimestre = async (token, idHorario, idAlumno, idMateria, idBimestre) => {
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
};

export const getMateriasReg = async (token) => {
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/MateriasReg`;
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
};