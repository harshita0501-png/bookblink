import api from "./api";

export const reviewService = {
  create:    (data)   => api.post("/reviews",            data),
  getByBook: (bookId, params) => api.get(`/reviews/${bookId}`, { params }),
  remove:    (id)     => api.delete(`/reviews/${id}`),
};
