import api from "./api";

export const adminService = {
  getAnalytics:    ()            => api.get("/admin/analytics"),
  getUsers:        (params)      => api.get("/admin/users",              { params }),
  toggleUser:      (id)          => api.put(`/admin/users/${id}/toggle`),
  approveOrder:    (id)          => api.put(`/admin/orders/${id}/approve`),
};
