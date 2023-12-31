import { getToken } from "./token";

export const loginUser = async (username, password) => {
  const res = await fetch("/api/login", {
    body: JSON.stringify({ username, password }),
    method: "POST",
  });
  const data = await res.json();
  console.log(JSON.stringify(data));
  return data;
};
// ------------------------------------------------------------*
export const registerUser = async (payload) => {
  const res = await fetch("/api/register", {
    body: JSON.stringify(payload),
    method: "POST",
  });
  const data = await res.json();
  return data;
};
// ------------------------------------------------------------*
export const whoAmI = async () => {
  console.log('first hit');
  const res = await fetch("/api/profile", {
    headers: {
      authorization: getToken(),
    },
    method: "GET",
  });
  const data = await res.json();
  console.log(data);
  return data;
};
