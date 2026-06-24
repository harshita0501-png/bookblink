import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Sidebar from "../../components/common/Sidebar";
import BookCard from "../../components/common/BookCard";
import { bookService } from "../../services/bookService";
import { orderService } from "../../services/orderService";

const statusStyle = (s) => {
  if (s === "Delivered") return "bg-green-500/10 text-green-400 border-green-500/20";
  if (s === "Returned")  return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  if (s === "Requested") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  return "bg-amber-500/10 text-amber-400 border-amber-500/20";
};

export default function StudentDashboard() {
  const { user } = useApp();
  const [books,  setBooks]  = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    bookService.getAll({ available: "true", limit: 4 })
      .then((r) => setBooks(r.data.books || []))
      .catch(() => {});

    if (user?._id) {
      orderService.getByUser(user._id)
        .then((r) => setOrders(r.data.orders || []))
        .catch(() => {});
    }
  }, [user]);

  const active   = orders.filter(o => ["Requested","Approved","Assigned","Out for Delivery"].includes(o.status)).length;
  const returned = orders.filter(o => o.status === "Returned").length;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              Welcome back, <span className="text-amber-400">{user?.name?.split(" ")[0]}!</span> 👋
            </h1>
            <p className="text-slate-400 mt-1">Here's what's happening with your BookBlink account</p>
          </div>
          <Link to="/books" className="hidden sm:block bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-all text-sm">
            Browse Books →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            ["📚", "Books Rented",  orders.length],
            ["📦", "Active Orders", active],
            ["✅", "Returned",      returned],
            ["⭐", "Reviews Left",  returned],
          ].map(([icon, label, value]) => (
            <div key={label} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
              <div className="text-3xl">{icon}</div>
              <div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Category links */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {["All Books","Core CS","Programming","Database","Networking","Web Dev","AI/ML"].map((c) => (
              <Link key={c} to="/books"
                className="bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 hover:text-amber-400 text-slate-300 rounded-xl px-3 py-2.5 text-center text-xs font-medium transition-all">
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Available Books</h2>
            <Link to="/books" className="text-amber-400 text-sm hover:text-amber-300">View all →</Link>
          </div>
          {books.length === 0 ? (
            <p className="text-slate-400 text-sm">Loading books…</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {books.map((book) => <BookCard key={book._id} book={book} />)}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <Link to="/student/orders" className="text-amber-400 text-sm hover:text-amber-300">View all →</Link>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/30">
                  {["Order","Book","Date","Status"].map((h) => (
                    <th key={h} className={`text-left text-slate-400 text-xs font-semibold uppercase px-5 py-3 ${h === "Date" ? "hidden sm:table-cell" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">
                    No orders yet. <Link to="/books" className="text-amber-400 hover:underline">Browse books</Link> to get started.
                  </td></tr>
                )}
                {orders.slice(0, 4).map((o) => (
                  <tr key={o._id} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4 text-slate-400 text-sm font-mono">{o._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-4 text-white text-sm font-medium">{(o.bookId?.title || "").substring(0, 22)}</td>
                    <td className="px-5 py-4 text-slate-400 text-sm hidden sm:table-cell">
                      {new Date(o.requestDate || o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle(o.status)}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
