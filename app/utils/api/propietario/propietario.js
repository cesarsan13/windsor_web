
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