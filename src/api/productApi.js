import api from "../api/api";

export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const addProduct = async (product) => {
  const res = await api.post("/products", product);
  return res.data;
};

export const updateProduct = async (id, product) => {
  const res = await api.put(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

export const searchProduct = async (name) => {
  const res = await api.get(`/products/search?name=${name}`);
  return res.data;
};
