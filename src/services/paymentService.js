import api from "./api";

export const paymentService = {
  create:    (data)   => api.post("/payments",           data),
  getByUser: (userId) => api.get(`/payments/${userId}`),
  getAll:    (params) => api.get("/payments",            { params }),
};
