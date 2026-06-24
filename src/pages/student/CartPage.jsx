import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Sidebar from "../../components/common/Sidebar";

export default function CartPage() {
  const { cart, removeFromCart } = useApp();
  const total = cart.reduce((s, b) => s + b.price, 0);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">My Cart</h1>
            <p className="text-slate-400 mt-1">{cart.length} {cart.length === 1 ? "book" : "books"} selected</p>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-24 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-white font-bold text-xl mb-2">Your cart is empty</h3>
              <p className="text-slate-400 mb-6">Browse our collection and add books to rent</p>
              <Link to="/books" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all inline-block">
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items */}
              <div className="lg:col-span-2 space-y-3">
                {cart.map((book) => (
                  <div key={book.id} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-16 h-20 bg-slate-700 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-slate-400 text-xs mb-2">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2 py-0.5 rounded-full">{book.category}</span>
                        <span className="text-slate-400 text-xs">Sem {book.semester}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-amber-400 font-bold">₹{book.price}</span>
                      <button onClick={() => removeFromCart(book.id)}
                        className="text-red-400 hover:text-red-300 text-xs border border-red-500/20 hover:border-red-500/40 px-2 py-1 rounded-lg transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 h-fit sticky top-24">
                <h2 className="text-white font-bold text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  {cart.map((b) => (
                    <div key={b.id} className="flex justify-between text-sm">
                      <span className="text-slate-400 truncate mr-2">{b.title.substring(0, 18)}…</span>
                      <span className="text-slate-300 flex-shrink-0">₹{b.price}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-700/50 pt-4 mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Delivery fee</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between font-bold mt-3">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400 text-lg">₹{total}</span>
                  </div>
                </div>
                <Link to="/checkout"
                  className="block text-center bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all text-sm">
                  Proceed to Checkout →
                </Link>
                <Link to="/books"
                  className="block text-center text-slate-400 hover:text-white text-sm mt-3 transition-colors">
                  Continue browsing
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
