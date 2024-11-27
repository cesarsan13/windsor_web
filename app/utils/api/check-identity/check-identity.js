export const recuperaContra = async (formData) => {
    let url = "";
    url = `${process.env.DOMAIN_API}api/recuperacion`;
    const res = await fetch(`${url}`, {
        method: "POST",
        body: formData,
        // headers: new Headers({
        // Authorization: "Bearer " + token,
        // }),
    });
    
    // let url = "";
    // if (accion === "Alta") {
    //   url = `${process.env.DOMAIN_API}api/students/save`;
    //   formData.append("baja", "n");
    // }
    // if (accion === "Eliminar" || accion === "Editar") {
    //   if (accion === "Eliminar") {
    //     formData.append("baja", "*");
    //   } else {
    //     formData.append("baja", "n");
    //   }
    //   url = `${process.env.DOMAIN_API}api/students/update/${numero}`;
    // }
    // const res = await fetch(`${url}`, {
    //   method: "POST",
    //   body: formData,
    //   headers: new Headers({
    //     Authorization: "Bearer " + token,
    //   }),
    // });
    const resJson = await res.json();
    return resJson;
  };