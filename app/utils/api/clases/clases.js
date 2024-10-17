export const getClasesBuscaCat = async (token, grupo) => {
    let url = `${process.env.DOMAIN_API}api/proceso/busca-cat`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            grupo: grupo
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};