import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://password-manager-backend-n6jx.onrender.com";

const instance = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// AUTH
export const loginUser       = (data) => instance.post("/auth/login", data);
export const signupUser      = (data) => instance.post("/auth/register", data);
export const logoutUser      = ()    => instance.post("/auth/logout");

// USER
export const checkAuthenticated = ()        => instance.get("/api/authenticate");

// VAULT
export const saveNewPassword = (data)       => instance.post("/api/vault", data);
export const deleteAPassword = (id)         => instance.delete(`/api/vault/${id}`);

// DECRYPT
export const decryptThePass   = (data)      => instance.post("/api/decrypt", data);
