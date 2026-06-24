import { useState, useEffect, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import Sidebar from "../../components/common/Sidebar";
import { deliveryService } from "../../services/deliveryService";

const STATUS_CFG = {
  "Assigned":  { color: "bg-blue-500/10 text-blue-400 border-blue-500/20",   dot: "bg-blue-400",   icon: "📦" },
  "Picked Up": { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400",  icon: "🚴" },
  "Delivered": { color: "bg-green-500/10 text-green-400 border-green-500/20", dot: "bg-green-400",  icon: "✅" },
  "Failed":    { color: "bg-red-500/10 text-red-400 border-red-500/20",       dot: "bg-red-400",    icon: "❌" },
};
const STATUS_FLOW = { "Assigned": "Picked Up", "Picked Up": "Delivered" };
const FILTERS = ["All", "Assigned", "Picked Up", "Delivered"];

export default function DeliveryTasksPage() {
  const { user } = useApp();
  const [deliveries, setDeliveries] = useState([]);
  const [filter,     setFilter]     = useState("All");
  const [loading,    setLoading]    = useState(true);
  const [updating,   setUpdating]   = useState(null); // id being updated

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await deliveryService.getAll();
      setDeliveries(res.data.deliveries || []);
    } catch {
      setDeliveries([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDeliveries(); }, [fetchDeliveries]);

  const updateStatus = async (delivery) => {
    const next = STATUS_FLOW[delivery.status];
    if (!next) return;
    setUpdating(delivery._id);
    try {
      await deliveryService.updateStatus(delivery._id, { status: next });
      await fetchDeliveries(); // re-fetch for fresh data
    } catch (err) {
      alert(err.response?.data?.message || "Update failed.");
    }
    setUpdating(null);
  };

  const normalise = (d) => ({
    _id:         d._id,
    status:      d.status,
    qrCode:      d.qrCode,
    slot:        d.deliverySlot || d.orderId?.slot || "—",
    bookTitle:   d.orderId?.bookId?.title  || "Book",
    studentName: d.orderId?.userId?.name   || "Student",
    phone:       d.orderId?.userId?.phone  || "—",
    address:     d.orderId?.deliveryAddress
      ? `${d.orderId.deliveryAddress.block}, Room ${d.orderId.deliveryAddress.room}`
      : "—",
    orderId:     d.orderId?._id || "—",
  });

  const filtered = deliveries
    .map(normalise)
    .filter((d) => filter === "All" || d.status === filter);

  const counts = {
    total:     deliveries.length,
    assigned:  deliveries.filter((d) => d.status === "Assigned").length,
    picked:    deliveries.filter((d) => d.status === "Picked Up").length,
    delivered: deliveries.filter((d) => d.status === "Delivered").length,
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">My Tasks</h1>
            <p className="text-slate-400 mt-1">Welcome, {user?.name}! All your delivery assignments.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              ["Total",     counts.total,     "text-white"],
              ["Assigned",  counts.assigned,  "text-blue-400"],
              ["Picked Up", counts.picked,    "text-amber-400"],
              ["Delivered", counts.delivered, "text-green-400"],
            ].map(([l, v, c]) => (
              <div key={l} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-4">
                <div className={`text-2xl font-black ${c}`}>{v}</div>
                <div className="text-slate-400 text-sm">{l}</div>
              </div>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  filter === f ? "bg-amber-500 text-slate-900 border-amber-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                }`}>
                {f}
                <span className="ml-1.5 opacity-60 text-xs">
                  {f === "All" ? deliveries.length : deliveries.filter((d) => d.status === f).length}
                </span>
              </button>
            ))}
          </div>

          {/* Tasks */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-24 bg-slate-800 rounded-2xl animate-pulse border border-slate-700/30" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-white font-bold text-xl mb-2">No tasks</h3>
              <p className="text-slate-400">
                {filter === "All" ? "No deliveries assigned to you yet." : `No tasks with status "${filter}"`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((task) => {
                const cfg  = STATUS_CFG[task.status] || STATUS_CFG["Assigned"];
                const next = STATUS_FLOW[task.status];
                const isUpdating = updating === task._id;
                return (
                  <div key={task._id} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {cfg.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-white font-semibold text-sm">{task.bookTitle}</span>
                          <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {task.status}
                          </span>
                        </div>
                        <div className="text-slate-300 text-xs">👤 {task.studentName}</div>
                        <div className="text-slate-400 text-xs mt-0.5">📍 {task.address}</div>
                        <div className="text-slate-400 text-xs mt-0.5">🕐 {task.slot} &nbsp;|&nbsp; 📞 {task.phone}</div>
                        {task.qrCode && (
                          <div className="text-slate-500 text-xs mt-0.5 font-mono">QR: {task.qrCode}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {next ? (
                        <button
                          onClick={() => updateStatus(task)}
                          disabled={isUpdating}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-60 whitespace-nowrap flex items-center gap-1"
                        >
                          {isUpdating
                            ? <><span className="w-3 h-3 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />Updating…</>
                            : `→ ${next}`
                          }
                        </button>
                      ) : (
                        <span className="text-green-400 text-xs font-medium">✓ Done</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
