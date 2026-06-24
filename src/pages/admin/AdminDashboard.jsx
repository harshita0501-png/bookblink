import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { orderService } from "../../services/orderService";
import { bookService } from "../../services/bookService";
import Sidebar from "../../components/common/Sidebar";

const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5">
    <div className="text-2xl mb-3">{icon}</div>
    <div className="text-3xl font-black text-white mb-1">{value ?? "—"}</div>
    <div className="text-slate-400 text-sm">{label}</div>
    {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [pending, setPending] = useState([]);
  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const res = await adminService.getAnalytics();
        setStats(res.data.stats || {});
      } catch {
        setStats({});
      }

      try {
        const res = await orderService.getAll({ status: "Requested", limit: 5 });
        setPending(res.data.orders || []);
      } catch {
        setPending([]);
      }

      try {
        const res = await bookService.getAll({ limit: 8 });
        setBooks(res.data.books || []);
      } catch {
        setBooks([]);
      }

      setLoading(false);
    };
    load();
  }, []);

  const approveOrder = async (id) => {
    try { await adminService.approveOrder(id); } catch { /* ignore */ }
    setPending((prev) => prev.filter((r) => (r._id || r.id) !== id));
    setStats((s) => s ? { ...s, pendingRequests: Math.max(0, (s.pendingRequests || 1) - 1) } : s);
  };

  const rejectOrder = (id) =>
    setPending((prev) => prev.filter((r) => (r._id || r.id) !== id));

  const categoryCounts = books.reduce((acc, b) => {
    const cat = b.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const categoryEntries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCat = categoryEntries[0]?.[1] || 1;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">BookBlink system overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard icon="📚" label="Total Books"      value={loading ? "…" : (stats?.totalBooks      ?? 0)} sub="In inventory" />
          <StatCard icon="📦" label="Active Rentals"   value={loading ? "…" : (stats?.activeRentals   ?? 0)} sub="Currently rented" />
          <StatCard icon="🔔" label="Pending Requests" value={loading ? "…" : (stats?.pendingRequests ?? pending.length)} sub="Awaiting approval" />
          <StatCard icon="👥" label="Total Students"   value={loading ? "…" : (stats?.totalStudents   ?? 0)} sub="Registered users" />
          <StatCard icon="💰" label="Total Revenue"    value={loading ? "…" : `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`} sub="All time" />
          <StatCard icon="🚴" label="Deliveries Today" value={loading ? "…" : (stats?.deliveriesToday ?? 0)} sub="Completed" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Pending Requests</h2>
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium px-2.5 py-1 rounded-full">
                {pending.length} pending
              </span>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-14 bg-slate-700/30 rounded-xl animate-pulse" />)}</div>
            ) : pending.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">✅ No pending requests</div>
            ) : (
              <div className="space-y-3">
                {pending.map((req) => {
                  const reqId = req._id || req.id;
                  const name  = req.userId?.name  || "Student";
                  const book  = req.bookId?.title || "Book";
                  const date  = (req.requestDate || req.createdAt)
                    ? new Date(req.requestDate || req.createdAt).toLocaleDateString("en-IN")
                    : "—";
                  const dept  = req.userId?.department || "BCA";
                  const sem   = req.userId?.semester   || "";
                  return (
                    <div key={reqId} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                      <div className="min-w-0 flex-1 mr-3">
                        <div className="text-white text-sm font-medium">{name}</div>
                        <div className="text-slate-400 text-xs truncate">
                          {book} · {dept}{sem ? ` Sem ${sem}` : ""} · {date}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => approveOrder(reqId)} className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs px-3 py-1.5 rounded-lg transition-colors">Approve</button>
                        <button onClick={() => rejectOrder(reqId)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-3 py-1.5 rounded-lg transition-colors">Reject</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-5">Book Categories</h2>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-6 bg-slate-700/30 rounded animate-pulse" />)}</div>
            ) : categoryEntries.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No books loaded</div>
            ) : (
              categoryEntries.map(([cat, count]) => (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{cat}</span>
                    <span className="text-slate-400">{count} books</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(count / maxCat) * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
            <h2 className="text-white font-bold text-lg">Book Inventory</h2>
            <a href="/admin/books" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-4 py-2 rounded-xl text-sm transition-all">
              Manage All Books
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/30">
                  {["Title","Author","Category","Price","Copies","Status"].map((h) => (
                    <th key={h} className="text-left text-slate-400 text-xs font-semibold uppercase px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3,4].map((i) => (
                    <tr key={i}><td colSpan={6} className="px-5 py-3"><div className="h-5 bg-slate-700/30 rounded animate-pulse" /></td></tr>
                  ))
                ) : books.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-sm">No books found</td></tr>
                ) : (
                  books.map((b) => (
                    <tr key={b._id} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-3 text-white text-sm font-medium max-w-xs"><div className="truncate">{b.title}</div></td>
                      <td className="px-5 py-3 text-slate-400 text-sm">{b.author?.split(",")[0]}</td>
                      <td className="px-5 py-3"><span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2 py-0.5 rounded-full">{b.category || "Other"}</span></td>
                      <td className="px-5 py-3 text-amber-400 font-bold text-sm">₹{b.rentalPrice}</td>
                      <td className="px-5 py-3 text-slate-300 text-sm">{b.availableCopies}/{b.totalCopies}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${b.availableCopies > 0 ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                          {b.availableCopies > 0 ? "Available" : "Rented Out"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
