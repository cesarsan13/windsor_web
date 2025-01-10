export const recuperaContra = async (data) => {
    let url = "";
    url = `${process.env.DOMAIN_API}api/recuperacion`;
    const formData = new FormData();
      formData.append("email", data.username || "");

    const res = await fetch(`${url}`, {
        method: "POST",
        body: formData,
        headers: new Headers({
            xescuela: data.xEscuela,
        }),
    });
    const resJson = await res.json();
    return resJson;
  };