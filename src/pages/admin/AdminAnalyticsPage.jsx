import { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import { adminService } from "../../services/adminService";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminAnalyticsPage() {
  const [stats,       setStats]       = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topBooks,    setTopBooks]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAnalytics();
        const d   = res.data;
        setStats(d.stats || {});
        setMonthlyData(
          (d.monthlyOrders || []).map((m) => ({
            month:   MONTH_NAMES[(m._id.month || 1) - 1],
            rentals: m.count   || 0,
            revenue: m.revenue || 0,
          }))
        );
        setTopBooks(d.topBooks || []);
      } catch {
        setStats({});
        setMonthlyData([]);
        setTopBooks([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const totalRevenue  = stats?.totalRevenue  || 0;
  const totalRentals  = stats?.totalOrders   || 0;
  const avgRental     = totalRentals > 0 ? (totalRevenue / totalRentals).toFixed(1) : "0";
  const activeRentals = stats?.activeRentals || 0;
  const activeRate    = totalRentals > 0 ? ((activeRentals / totalRentals) * 100).toFixed(1) : "0";

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);
  const maxRentals = Math.max(...monthlyData.map((d) => d.rentals), 1);
  const maxTopBook = Math.max(...topBooks.map((b) => b.rentals), 1);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">Analytics</h1>
            <p className="text-slate-400 mt-1">BookBlink real-time performance overview</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue",    value: loading ? "…" : `₹${totalRevenue.toLocaleString("en-IN")}` },
              { label: "Total Rentals",    value: loading ? "…" : totalRentals.toString() },
              { label: "Avg Rental Value", value: loading ? "…" : `₹${avgRental}` },
              { label: "Active Rate",      value: loading ? "…" : `${activeRate}%` },
            ].map((s) => (
              <div key={s.label} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5">
                <div className="text-slate-400 text-xs font-medium mb-2">{s.label}</div>
                <div className="text-2xl font-black text-white mb-1">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-6">Monthly Revenue</h2>
            {loading ? (
              <div className="flex items-end gap-3 h-40">
                {[1,2,3,4,5,6].map((i) => <div key={i} className="flex-1 bg-slate-700/30 rounded-t-lg animate-pulse" style={{ height: "60%" }} />)}
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">No rental data yet</div>
            ) : (
              <div className="flex items-end gap-3 h-40">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-slate-400 text-xs">₹{(d.revenue / 1000).toFixed(1)}k</div>
                    <div className="w-full relative group" style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 4)}px` }}>
                      <div className="w-full h-full bg-amber-500/30 hover:bg-amber-500/50 rounded-t-lg transition-colors border border-amber-500/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/60 to-amber-500/20 group-hover:from-amber-500/80 transition-all" />
                      </div>
                    </div>
                    <div className="text-slate-400 text-xs">{d.month}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5">Most Rented Books</h2>
              {loading ? (
                <div className="space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-8 bg-slate-700/30 rounded animate-pulse" />)}</div>
              ) : topBooks.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">No rental data yet</div>
              ) : (
                <div className="space-y-3">
                  {topBooks.map((b, i) => (
                    <div key={b._id || b.title} className="flex items-center gap-3">
                      <span className="text-amber-500/60 font-black text-lg w-6">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{b.title}</div>
                        <div className="h-1.5 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(b.rentals / maxTopBook) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm flex-shrink-0">{b.rentals}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5">Monthly Rentals</h2>
              {loading ? (
                <div className="space-y-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-6 bg-slate-700/30 rounded animate-pulse" />)}</div>
              ) : monthlyData.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">No rental data yet</div>
              ) : (
                <div className="space-y-3">
                  {monthlyData.map((d) => (
                    <div key={d.month} className="flex items-center gap-3">
                      <span className="text-slate-400 text-sm w-8">{d.month}</span>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.max((d.rentals / maxRentals) * 100, 2)}%` }} />
                      </div>
                      <span className="text-slate-300 text-sm w-8 text-right">{d.rentals}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-slate-700/50">
                <h3 className="text-white font-semibold text-sm mb-3">Current Snapshot</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Active Rentals",   loading ? "…" : (stats?.activeRentals   ?? 0)],
                    ["Pending Requests", loading ? "…" : (stats?.pendingRequests ?? 0)],
                    ["Total Students",   loading ? "…" : (stats?.totalStudents   ?? 0)],
                    ["Deliveries Today", loading ? "…" : (stats?.deliveriesToday ?? 0)],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-slate-700/40 rounded-xl p-3 text-center">
                      <div className="text-white font-bold">{val}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
