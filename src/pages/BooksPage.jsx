import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/common/Sidebar";
import BookCard from "../components/common/BookCard";
import { bookService } from "../services/bookService";
import { books as DUMMY_BOOKS, categories, departments, semesters } from "../data/dummyData";

export default function BooksPage() {
  const { role } = useApp();
  const [books, setBooks]   = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dept, setDept]     = useState("All");
  const [sem, setSem]       = useState("All");
  const [cat, setCat]       = useState("All");

  const fetchBooks = useCallback(async () => {
    setApiLoading(true);
    try {
      const params = {};
      if (search && search.trim()) params.search = search.trim();
      if (dept !== "All") params.department = dept;
      if (sem  !== "All") params.semester   = sem;
      if (cat  !== "All") params.category   = cat;
      const res = await bookService.getAll(params);
      setBooks(res.data.books || []);
    } catch {
      // Fallback to dummy data when API is offline
      let filtered = DUMMY_BOOKS;
      if (search) filtered = filtered.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));
      if (dept !== "All") filtered = filtered.filter(b => b.department === dept);
      if (sem  !== "All") filtered = filtered.filter(b => String(b.semester) === sem);
      if (cat  !== "All") filtered = filtered.filter(b => b.category === cat);
      setBooks(filtered);
    } finally {
      setApiLoading(false);
    }
  }, [search, dept, sem, cat]);

  useEffect(() => {
    const t = setTimeout(fetchBooks, 300);
    return () => clearTimeout(t);
  }, [fetchBooks]);

  const content = (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-white">Browse Books</h1>
          <p className="text-slate-400 mt-1">{apiLoading ? "Loading…" : `${books.length} books found`}</p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by title or author…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
          </div>
          <select value={dept} onChange={(e) => setDept(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50">
            {departments.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={sem} onChange={(e) => setSem(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50">
            {semesters.map((s) => <option key={s} value={s}>{s === "All" ? "All Semesters" : `Semester ${s}`}</option>)}
          </select>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${cat === c ? "bg-amber-500 text-slate-900 border-amber-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:border-amber-500/30 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {apiLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl h-64 animate-pulse border border-slate-700/30" />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {books.map((book) => <BookCard key={book._id || book.id} book={book} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-white font-bold text-xl mb-2">No books found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </main>
  );

  if (role) {
    return <div className="flex min-h-screen bg-slate-950"><Sidebar />{content}</div>;
  }
  return <div className="min-h-screen bg-slate-950">{content}</div>;
}
