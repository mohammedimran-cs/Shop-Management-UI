import api from "../api/api";

export const getAllCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export const addCategory = async (category) => {
  const res = await api.post("/categories", category);
  return res.data;
};

export const deleteCategory = async (category) => {
  const res = await api.delete(`/categories/${category.id}`);
  return res.data;
};
