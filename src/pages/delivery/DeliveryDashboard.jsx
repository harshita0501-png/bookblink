import { useState, useEffect, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import Sidebar from "../../components/common/Sidebar";
import { deliveryService } from "../../services/deliveryService";

const STATUS_FLOW = { "Assigned": "Picked Up", "Picked Up": "Delivered" };
const STATUS_CFG  = {
  "Assigned":  { color: "bg-blue-500/10 text-blue-400 border-blue-500/20",   dot: "bg-blue-400" },
  "Picked Up": { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  "Delivered": { color: "bg-green-500/10 text-green-400 border-green-500/20", dot: "bg-green-400" },
};

export default function DeliveryDashboard() {
  const { user } = useApp();
  const [tasks,    setTasks]   = useState([]);
  const [loading,  setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await deliveryService.getAll();
      const raw = res.data.deliveries || [];
      setTasks(raw.map((d) => ({
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
      })));
    } catch {
      setTasks([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const updateStatus = async (task) => {
    const next = STATUS_FLOW[task.status];
    if (!next) return;
    setUpdating(task._id);
    try {
      await deliveryService.updateStatus(task._id, { status: next });
      await fetchTasks();
    } catch { /* silent */ }
    setUpdating(null);
  };

  const stats = {
    total:     tasks.length,
    assigned:  tasks.filter((t) => t.status === "Assigned").length,
    picked:    tasks.filter((t) => t.status === "Picked Up").length,
    delivered: tasks.filter((t) => t.status === "Delivered").length,
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Delivery Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome, {user?.name}! Your tasks for today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[["Total Tasks",stats.total,"text-white"],["Assigned",stats.assigned,"text-blue-400"],["Picked Up",stats.picked,"text-amber-400"],["Delivered",stats.delivered,"text-green-400"]].map(([l,v,c]) => (
            <div key={l} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5">
              <div className={`text-3xl font-black mb-1 ${c}`}>{v}</div>
              <div className="text-slate-400 text-sm">{l}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3].map((i) => <div key={i} className="bg-slate-800 rounded-2xl h-48 animate-pulse border border-slate-700/30" />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-white font-bold text-xl mb-2">No deliveries assigned</h3>
            <p className="text-slate-400">The admin will assign deliveries to you once orders are approved.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task) => {
              const cfg  = STATUS_CFG[task.status] || STATUS_CFG["Assigned"];
              const next = STATUS_FLOW[task.status];
              const busy = updating === task._id;
              return (
                <div key={task._id} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-slate-400 text-xs font-mono">{task._id.slice(-8).toUpperCase()}</span>
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {task.status}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-3">{task.bookTitle}</h3>
                  <div className="space-y-1.5 mb-4 text-xs">
                    {[["👤", task.studentName], ["📍", task.address], ["🕐", task.slot], ["📞", task.phone]].map(([ic, val]) => (
                      <div key={ic} className="flex items-start gap-2">
                        <span className="flex-shrink-0">{ic}</span>
                        <span className="text-slate-400">{val}</span>
                      </div>
                    ))}
                  </div>
                  {next ? (
                    <button onClick={() => updateStatus(task)} disabled={busy}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {busy
                        ? <><span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />Updating…</>
                        : `Mark as ${next} →`
                      }
                    </button>
                  ) : (
                    <div className="w-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold py-2.5 rounded-xl text-sm text-center">
                      ✓ Delivered
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
