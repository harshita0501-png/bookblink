import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { bookService } from "../services/bookService";
import { reviewService } from "../services/reviewService";
import { books as DUMMY_BOOKS } from "../data/dummyData";

const StarIcon = ({ filled }) => (
  <svg className={`w-5 h-5 ${filled ? "text-amber-400" : "text-slate-600"}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function BookDetailsPage() {
  const { id } = useParams();
  const { role, addToCart, cart } = useApp();
  const [book, setBook]       = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [bRes, rRes] = await Promise.all([
          bookService.getById(id),
          reviewService.getByBook(id),
        ]);
        setBook(bRes.data.book);
        setReviews(rRes.data.reviews || []);
      } catch {
        // Fallback to dummy data
        const found = DUMMY_BOOKS.find((b) => String(b.id) === id || b._id === id);
        setBook(found || null);
        setReviews([
          { _id: "r1", userId: { name: "Priya P." }, rating: 5, createdAt: "2024-11-01", comment: "Excellent book! Great for exam preparation." },
          { _id: "r2", userId: { name: "Amit V."  }, rating: 4, createdAt: "2024-10-20", comment: "Good content, delivery was on time." },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  if (!book) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">📚</div>
        <h2 className="text-white text-2xl font-bold mb-3">Book not found</h2>
        <Link to="/books" className="text-amber-400 hover:text-amber-300">← Back to Books</Link>
      </div>
    </div>
  );

  const bookId    = book._id || book.id;
  const available = book.availableCopies > 0 || book.available;
  const price     = book.rentalPrice || book.price;
  const inCart    = !!cart.find((b) => (b._id || b.id) === bookId);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/books" className="text-slate-400 hover:text-amber-400 text-sm flex items-center gap-2 mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Books
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl overflow-hidden h-80 flex items-center justify-center border border-slate-700/50">
              <img src={book.imageUrl || book.cover} alt={book.title} className="h-full w-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }} />
            </div>
            <div className={`mt-4 rounded-xl p-3 text-center text-sm font-medium border ${available ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
              {available ? `✓ ${book.availableCopies ?? ""} Copies Available` : "✗ Currently Unavailable"}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex gap-2 flex-wrap mb-3">
              {book.category && <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium px-3 py-1 rounded-full">{book.category}</span>}
              {book.semester && <span className="bg-slate-700/50 text-slate-400 border border-slate-600 text-xs font-medium px-3 py-1 rounded-full">Sem {book.semester}</span>}
              {book.department && <span className="bg-slate-700/50 text-slate-400 border border-slate-600 text-xs font-medium px-3 py-1 rounded-full">{book.department}</span>}
            </div>
            <h1 className="text-3xl font-black text-white mb-2">{book.title}</h1>
            <p className="text-slate-400 text-lg mb-4">by {book.author}</p>
            <div className="flex items-center gap-2 mb-6">
              {[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= Math.floor(book.rating || 0)} />)}
              <span className="text-white font-bold">{book.rating || 0}</span>
              <span className="text-slate-400 text-sm">({book.reviewCount || book.reviews || 0} reviews)</span>
            </div>
            {book.description && <p className="text-slate-300 leading-relaxed mb-8">{book.description}</p>}

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-3xl font-black text-amber-400">₹{price}</div>
                  <div className="text-slate-400 text-sm">per rental (15–20 days)</div>
                </div>
                <div className="text-right text-sm text-slate-400 space-y-0.5">
                  <div>Late fee: ₹5/day</div><div>Max fine: ₹100</div>
                </div>
              </div>
              {role === "student" && available && (
                <div className="flex gap-3">
                  <button onClick={() => addToCart(book)} disabled={inCart}
                    className={`flex-1 font-bold py-3 rounded-xl transition-all text-sm ${inCart ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-400 text-slate-900"}`}>
                    {inCart ? "✓ Added to Cart" : "Add to Cart"}
                  </button>
                  {inCart && <Link to="/cart" className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl text-sm text-center">View Cart →</Link>}
                </div>
              )}
              {!role && <Link to="/login" className="block text-center bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all text-sm">Login to Rent this Book</Link>}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              {[["15–20 days","Rental period"],["Same day","Delivery"],["3 slots","Daily options"]].map(([v,l]) => (
                <div key={l} className="bg-slate-800/40 rounded-xl p-3 text-center border border-slate-700/30">
                  <div className="text-white font-bold">{v}</div>
                  <div className="text-slate-400 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-bold text-white mb-5">Student Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <p className="text-slate-400">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {reviews.map((r) => (
                <div key={r._id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">
                        {(r.userId?.name || "U")[0]}
                      </div>
                      <span className="text-white font-medium text-sm">{r.userId?.name || "Student"}</span>
                    </div>
                    <span className="text-slate-500 text-xs">{new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= r.rating} />)}</div>
                  <p className="text-slate-400 text-sm leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
