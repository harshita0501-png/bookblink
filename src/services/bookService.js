import api from "./api";

export const bookService = {
  getAll:   (params) => api.get("/books",    { params }),
  getById:  (id)     => api.get(`/books/${id}`),
  create:   (data)   => api.post("/books",   data),
  update:   (id, data) => api.put(`/books/${id}`, data),
  remove:   (id)     => api.delete(`/books/${id}`),
};
