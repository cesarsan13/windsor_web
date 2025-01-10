export const getGrupos = async (token, baja) => {
    let url = "";
    baja
        ? (url = `${process.env.DOMAIN_API}api/grupos/index-baja`)
        : (url = `${process.env.DOMAIN_API}api/grupos/index`);
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
};