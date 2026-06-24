import api from "./api";

export const orderService = {
  create:        (data)          => api.post("/orders",                   data),
  getByUser:     (userId)        => api.get(`/orders/user/${userId}`),
  getAll:        (params)        => api.get("/orders",                    { params }),
  getById:       (id)            => api.get(`/orders/${id}`),
  updateStatus:  (id, status)    => api.put(`/orders/${id}/status`,       { status }),
};
