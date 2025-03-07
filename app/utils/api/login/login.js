export const loginApi = async (data) => {
  const url = `${process.env.DOMAIN_API}api/login`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({ "Content-Type": "application/json" }),
  });
  const resJson = res.json();
  return resJson;
};
