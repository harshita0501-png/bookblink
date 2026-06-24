import api from "./api";

export const deliveryService = {
  getAll:       (params)    => api.get("/delivery",         { params }),
  getById:      (id)        => api.get(`/delivery/${id}`),
  assign:       (data)      => api.post("/delivery",        data),
  updateStatus: (id, data)  => api.put(`/delivery/${id}`,   data),
};
