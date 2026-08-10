import api from "../api/axios";

export const registerUser = async (form) => {
    const response = await api.post("/auth/register", form);
    return response.data;
};

export const loginUser = async (form) => {
    const response = await api.post("/auth/login", form);
    return response.data;
};