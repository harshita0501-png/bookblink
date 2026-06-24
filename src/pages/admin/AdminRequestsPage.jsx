import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/common/Sidebar";
import { orderService } from "../../services/orderService";
import { adminService } from "../../services/adminService";
import { deliveryService } from "../../services/deliveryService";

const STATUS_COLOR = {
  Requested:        "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Approved:         "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Assigned:         "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Out for Delivery":"bg-amber-500/10 text-amber-400 border-amber-500/20",
  Delivered:        "bg-green-500/10 text-green-400 border-green-500/20",
  Returned:         "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Cancelled:        "bg-red-500/10 text-red-400 border-red-500/20",
};

const TABS = ["Requested","Approved","Out for Delivery","Delivered","Returned","All"];

export default function AdminRequestsPage() {
  const [tab,     setTab]     = useState("Requested");
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState("");

  /* ── delivery staff list for assignment ── */
  const [staffList,      setStaffList]      = useState([]);
  const [assignOrderId,  setAssignOrderId]  = useState(null);
  const [selectedStaff,  setSelectedStaff]  = useState("");
  const [assigning,      setAssigning]      = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = tab !== "All" ? { status: tab, limit: 50 } : { limit: 50 };
      const res = await orderService.getAll(params);
      setOrders(res.data.orders || []);
    } catch { setOrders([]); }
    setLoading(false);
  }, [tab]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* fetch delivery staff once */
  useEffect(() => {
    adminService.getUsers({ role: "delivery" })
      .then((res) => setStaffList(res.data.users || []))
      .catch(() => {});
  }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  /* approve */
  const approve = async (id) => {
    try {
      await adminService.approveOrder(id);
      flash("Order approved.");
      fetchOrders();
    } catch { flash("Approval failed."); }
  };

  /* cancel */
  const cancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await orderService.updateStatus(id, "Cancelled");
      flash("Order cancelled.");
      fetchOrders();
    } catch { flash("Cancellation failed."); }
  };

  /* assign delivery */
  const confirmAssign = async () => {
    if (!selectedStaff) return;
    setAssigning(true);
    try {
      await deliveryService.assign({ orderId: assignOrderId, staffId: selectedStaff });
      flash("Delivery assigned.");
      setAssignOrderId(null);
      fetchOrders();
    } catch (err) {
      flash(err.response?.data?.message || "Assignment failed.");
    }
    setAssigning(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">Rental Requests</h1>
            <p className="text-slate-400 mt-1">Manage student book rental orders</p>
          </div>

          {msg && (
            <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl">
              {msg}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  tab === t ? "bg-amber-500 text-slate-900 border-amber-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* Orders list */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-20 bg-slate-800 rounded-2xl animate-pulse border border-slate-700/30" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-white font-bold text-xl mb-2">No orders</h3>
              <p className="text-slate-400">No orders with status "{tab}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const student  = o.userId?.name  || "Student";
                const bookName = o.bookId?.title || "Book";
                const date     = new Date(o.requestDate || o.createdAt).toLocaleDateString("en-IN");
                const addr     = o.deliveryAddress
                  ? `${o.deliveryAddress.block}, Room ${o.deliveryAddress.room}`
                  : "—";
                return (
                  <div key={o._id} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
                          {student[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-white font-semibold text-sm">{student}</span>
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${STATUS_COLOR[o.status] || STATUS_COLOR.Requested}`}>
                              {o.status}
                            </span>
                          </div>
                          <div className="text-slate-300 text-sm">{bookName}</div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {o.userId?.department || "BCA"} • Sem {o.userId?.semester || "—"} • {date} • {addr} • ₹{o.rentalAmount}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            Slot: {o.slot || "—"} • Payment: {o.paymentStatus}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {o.status === "Requested" && (
                          <>
                            <button onClick={() => approve(o._id)}
                              className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                              ✓ Approve
                            </button>
                            <button onClick={() => cancel(o._id)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                              ✗ Cancel
                            </button>
                          </>
                        )}
                        {o.status === "Approved" && (
                          <button onClick={() => { setAssignOrderId(o._id); setSelectedStaff(staffList[0]?._id || ""); }}
                            className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                            🚴 Assign Delivery
                          </button>
                        )}
                        {o.status === "Delivered" && (
                          <button onClick={async () => { await orderService.updateStatus(o._id, "Returned"); fetchOrders(); }}
                            className="bg-slate-600/30 hover:bg-slate-600/50 text-slate-300 border border-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                            Mark Returned
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Assign delivery modal */}
      {assignOrderId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-white font-bold text-lg mb-4">Assign Delivery Staff</h2>
            {staffList.length === 0 ? (
              <p className="text-slate-400 text-sm mb-4">No delivery staff found. Add a delivery account first.</p>
            ) : (
              <div className="mb-4">
                <label className="block text-slate-300 text-sm font-medium mb-2">Select Staff Member</label>
                <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50">
                  {staffList.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} — {s.phone || s.email}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setAssignOrderId(null)}
                className="flex-1 border border-slate-600 text-slate-300 py-2.5 rounded-xl text-sm">
                Cancel
              </button>
              {staffList.length > 0 && (
                <button onClick={confirmAssign} disabled={assigning}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">
                  {assigning ? "Assigning…" : "Confirm"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
