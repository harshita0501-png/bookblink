import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Sidebar from "../../components/common/Sidebar";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";

const SLOTS   = ["Morning (9AM-12PM)", "Afternoon (1PM-4PM)", "Evening (4PM-7PM)"];
const METHODS = [
  { id: "upi",        label: "UPI",             icon: "📱", desc: "GPay, PhonePe, Paytm" },
  { id: "netbanking", label: "Net Banking",      icon: "🏦", desc: "All major banks" },
  { id: "cod",        label: "Cash on Delivery", icon: "💵", desc: "Pay when book arrives" },
];

export default function CheckoutPage() {
  const { cart, clearCart, user } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "", block: "Hostel Block A", room: "",
    phone: user?.phone || "", slot: SLOTS[0], payment: "upi", upiId: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");
  const total = cart.reduce((s, b) => s + (b.rentalPrice || b.price || 0), 0);
  const up = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setStatus("loading");
    setErrMsg("");
    try {
      for (const book of cart) {
        const bookId = book._id || book.id;
        const orderRes = await orderService.create({
          bookId,
          deliveryAddress: { block: form.block, room: form.room, phone: form.phone },
          slot: form.slot,
        });
        const orderId = orderRes.data.order._id;
        await paymentService.create({
          orderId,
          amount: book.rentalPrice || book.price,
          method: form.payment,
          type:   "rental",
        });
      }
      setStatus("success");
      setTimeout(() => { clearCart(); navigate("/student/orders"); }, 1800);
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
        <h2 className="text-3xl font-black text-white mb-2">Order Placed!</h2>
        <p className="text-slate-400">Redirecting to your orders…</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Link to="/cart" className="text-slate-400 hover:text-amber-400 text-sm flex items-center gap-2 mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Back to Cart
          </Link>
          <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>
          {errMsg && <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{errMsg}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Address */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                  <span className="bg-amber-500/10 text-amber-400 w-7 h-7 rounded-lg flex items-center justify-center text-sm border border-amber-500/20">1</span>
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                    <input required type="text" placeholder="Your full name" value={form.name} onChange={up("name")}
                      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Hostel Block</label>
                      <select value={form.block} onChange={up("block")}
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50">
                        {["Hostel Block A","Hostel Block B","Hostel Block C","Day Scholar Area"].map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Room Number</label>
                      <input required type="text" placeholder="e.g. 204" value={form.room} onChange={up("room")}
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
                    <input required type="tel" placeholder="10-digit mobile" value={form.phone} onChange={up("phone")}
                      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Slot */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                  <span className="bg-amber-500/10 text-amber-400 w-7 h-7 rounded-lg flex items-center justify-center text-sm border border-amber-500/20">2</span>
                  Delivery Slot
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SLOTS.map((s) => (
                    <label key={s} className={`cursor-pointer border rounded-xl p-3 text-center text-sm transition-all ${form.slot === s ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-slate-600 text-slate-400 hover:border-slate-500"}`}>
                      <input type="radio" name="slot" value={s} checked={form.slot === s} onChange={up("slot")} className="sr-only" />
                      <div className="font-semibold">{s.split(" (")[0]}</div>
                      <div className="text-xs mt-1 opacity-70">{s.match(/\((.*?)\)/)?.[1]}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                  <span className="bg-amber-500/10 text-amber-400 w-7 h-7 rounded-lg flex items-center justify-center text-sm border border-amber-500/20">3</span>
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {METHODS.map((p) => (
                    <label key={p.id} className={`flex items-center gap-4 cursor-pointer border rounded-xl p-4 transition-all ${form.payment === p.id ? "border-amber-500 bg-amber-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                      <input type="radio" name="payment" value={p.id} checked={form.payment === p.id} onChange={up("payment")} className="sr-only" />
                      <span className="text-2xl">{p.icon}</span>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${form.payment === p.id ? "text-amber-400" : "text-white"}`}>{p.label}</div>
                        <div className="text-slate-400 text-xs">{p.desc}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.payment === p.id ? "border-amber-500 bg-amber-500" : "border-slate-500"}`} />
                    </label>
                  ))}
                  {form.payment === "upi" && (
                    <input type="text" placeholder="UPI ID (e.g. name@upi)" value={form.upiId} onChange={up("upiId")}
                      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 sticky top-24">
                <h3 className="text-white font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {cart.map((b) => (
                    <div key={b._id || b.id} className="flex justify-between text-xs">
                      <span className="text-slate-400 truncate mr-2">{(b.title || "").substring(0, 18)}…</span>
                      <span className="text-slate-300 flex-shrink-0">₹{b.rentalPrice || b.price}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-700/50 pt-3 mb-4 space-y-1.5">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Subtotal</span><span className="text-white">₹{total}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Delivery</span><span className="text-green-400">Free</span></div>
                  <div className="flex justify-between font-bold pt-1"><span className="text-white">Total</span><span className="text-amber-400 text-lg">₹{total}</span></div>
                </div>
                <button type="submit" disabled={status === "loading" || cart.length === 0}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {status === "loading"
                    ? <><span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"/>Placing…</>
                    : `Place Order ₹${total}`
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
