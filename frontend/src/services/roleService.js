import api from "./api";

export const getAllRoles = async () => {
  const response = await api.get("/roles");

  return response.data;
};
