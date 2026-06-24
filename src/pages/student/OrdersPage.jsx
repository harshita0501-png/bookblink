import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import Sidebar from "../../components/common/Sidebar";
import OrderCard from "../../components/common/OrderCard";
import { orderService } from "../../services/orderService";
import { orders as DUMMY_ORDERS } from "../../data/dummyData";

const TABS = ["All","Requested","Out for Delivery","Delivered","Returned"];

export default function OrdersPage() {
  const { user } = useApp();
  const [orders,  setOrders]  = useState([]);
  const [tab,     setTab]     = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (user?._id && !user._id.startsWith("demo-")) {
        try {
          const res = await orderService.getByUser(user._id);
          setOrders(res.data.orders || []);
        } catch { setOrders(DUMMY_ORDERS); }
      } else { setOrders(DUMMY_ORDERS); }
      setLoading(false);
    };
    load();
  }, [user]);

  // Normalise API orders so OrderCard can render them
  const normalise = (o) => ({
    ...o,
    id:          o._id   || o.id,
    bookTitle:   o.bookId?.title   || o.bookTitle,
    bookAuthor:  o.bookId?.author  || o.bookAuthor,
    price:       o.rentalAmount    || o.price,
    address:     o.deliveryAddress
      ? `${o.deliveryAddress.block}, Room ${o.deliveryAddress.room}`
      : o.address,
    deliverySlot: o.slot || o.deliverySlot,
    requestDate:  o.requestDate
      ? new Date(o.requestDate).toLocaleDateString("en-IN")
      : o.requestDate,
    deliveryDate: o.updatedAt
      ? new Date(o.updatedAt).toLocaleDateString("en-IN")
      : null,
  });

  const filtered = (tab === "All" ? orders : orders.filter(o => o.status === tab)).map(normalise);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">My Orders</h1>
            <p className="text-slate-400 mt-1">Track all your book rentals</p>
          </div>
          <div className="flex gap-2 flex-wrap mb-6">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${tab === t ? "bg-amber-500 text-slate-900 border-amber-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="space-y-4">{Array.from({length:3}).map((_,i) => <div key={i} className="bg-slate-800 rounded-2xl h-32 animate-pulse border border-slate-700/30" />)}</div>
          ) : filtered.length > 0 ? (
            <div className="space-y-4">{filtered.map((o) => <OrderCard key={o.id} order={o} />)}</div>
          ) : (
            <div className="text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-white font-bold text-xl mb-2">No orders found</h3>
              <p className="text-slate-400">No orders with status "{tab}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
