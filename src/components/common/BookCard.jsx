import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const StarIcon = ({ filled }) => (
  <svg className={`w-3.5 h-3.5 ${filled ? "text-amber-400" : "text-slate-600"}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CATEGORY_COLORS = {
  "Core CS":    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Programming":"bg-green-500/10 text-green-400 border-green-500/20",
  "Database":   "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Networking": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Web Dev":    "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Mathematics":"bg-red-500/10 text-red-400 border-red-500/20",
  "AI/ML":      "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function BookCard({ book }) {
  const { role, addToCart, cart } = useApp();

  // Normalise: support both API shape (_id, rentalPrice, availableCopies)
  // and dummy-data shape (id, price, available)
  const bookId    = book._id  || book.id;
  const price     = book.rentalPrice ?? book.price ?? 0;
  const available = book.availableCopies > 0 || book.available === true;
  const cover     = book.imageUrl || book.cover || "";
  const inCart    = !!cart.find((b) => (b._id || b.id) === bookId);
  const colorClass = CATEGORY_COLORS[book.category] || "bg-slate-600/50 text-slate-300 border-slate-600";

  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all group">
      <Link to={`/books/${bookId}`}>
        <div className="relative h-48 bg-slate-700/50 overflow-hidden">
          {cover ? (
            <img src={cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          {!available && (
            <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
              <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">Unavailable</span>
            </div>
          )}
          {book.category && (
            <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}>
              {book.category}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/books/${bookId}`}>
          <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2 hover:text-amber-400 transition-colors">{book.title}</h3>
        </Link>
        <p className="text-slate-400 text-xs mb-2">{book.author}</p>
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= Math.floor(book.rating || 0)} />)}
          <span className="text-slate-400 text-xs ml-1">{book.rating || 0} ({book.reviewCount || book.reviews || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-amber-400 font-bold text-lg">₹{price}</span>
            <span className="text-slate-500 text-xs">/rental</span>
          </div>
          {role === "student" && available && (
            <button onClick={() => addToCart(book)} disabled={inCart}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                inCart ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed"
                       : "bg-amber-500 hover:bg-amber-400 text-slate-900"
              }`}>
              {inCart ? "In Cart ✓" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
