export const getAlumnos = async (token, baja) => {
    let url = ""
    baja
        ? (url = `http://127.0.0.1:8000/api/students/bajas`)
        : (url = `http://127.0.0.1:8000/api/students`)
    const res = await fetch(url, {
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    const resJson = await res.json();
    return resJson.data;
}

export const getFotoAlumno = async (token, imagen) => {
    let url = `http://127.0.0.1:8000/api/students/imagen/${imagen}`
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const blob = await res.blob();
    return URL.createObjectURL(blob);
}

export const getLastAlumnos = async (token) => {
    let url = `http://127.0.0.1:8000/api/students/last`
    const res = await fetch(url, {
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    const resJson = await res.json();
    return resJson.data
}

export const guardarAlumnos = async (token, formData, accion, id) => {
    let url = ""
    if (accion === "Alta") {
        url = `http://127.0.0.1:8000/api/students/save`;
        formData.append('baja', "n");
    }
    if (accion === "Eliminar" || accion === "Editar") {
        if (accion === "Eliminar") {
            formData.append('baja', "*");
        } else {
            formData.append('baja', "n");
        }
        url = `http://127.0.0.1:8000/api/students/update/${id}`;
    }
    const res = await fetch(`${url}`, {
        method: 'POST',
        body: formData,
        headers: new Headers({
            Authorization: "Bearer " + token,
        }),
    })
    const resJson = await res.json();
    return resJson;
}