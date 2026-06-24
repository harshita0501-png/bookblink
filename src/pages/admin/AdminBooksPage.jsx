import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/common/Sidebar";
import { bookService } from "../../services/bookService";

const EMPTY_FORM = {
  title: "", author: "", subject: "", description: "", ISBN: "",
  department: "BCA", semester: "1", category: "Core CS",
  rentalPrice: "", totalCopies: "1", imageUrl: "",
};

const CATEGORY_OPTIONS = ["Core CS","Programming","Database","Networking","Web Dev","Mathematics","AI/ML","Other"];

export default function AdminBooksPage() {
  const [books,       setBooks]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [showModal,   setShowModal]   = useState(false);
  const [editBook,    setEditBook]    = useState(null); // null = add, object = edit
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [saveError,   setSaveError]   = useState("");

  /* ── Fetch books from the real API ── */
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookService.getAll({ limit: 100 });
      setBooks(res.data.books || []);
    } catch (err) {
      console.error("Failed to load books:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Open Add modal ── */
  const openAdd = () => {
    setEditBook(null);
    setForm(EMPTY_FORM);
    setSaveError("");
    setShowModal(true);
  };

  /* ── Open Edit modal ── */
  const openEdit = (book) => {
    setEditBook(book);
    setForm({
      title:       book.title        || "",
      author:      book.author       || "",
      subject:     book.subject      || "",
      description: book.description  || "",
      ISBN:        book.ISBN         || "",
      department:  book.department   || "BCA",
      semester:    String(book.semester || "1"),
      category:    book.category     || "Core CS",
      rentalPrice: String(book.rentalPrice || ""),
      totalCopies: String(book.totalCopies || "1"),
      imageUrl:    book.imageUrl     || "",
    });
    setSaveError("");
    setShowModal(true);
  };

  /* ── Save (create or update) ── */
  const handleSave = async () => {
    if (!form.title.trim() || !form.author.trim() || !form.rentalPrice) {
      setSaveError("Title, Author and Rental Price are required.");
      return;
    }
    setSaving(true);
    setSaveError("");
    const payload = {
      ...form,
      semester:        Number(form.semester),
      rentalPrice:     Number(form.rentalPrice),
      totalCopies:     Number(form.totalCopies),
      availableCopies: editBook
        ? editBook.availableCopies + (Number(form.totalCopies) - editBook.totalCopies)
        : Number(form.totalCopies),
    };
    try {
      if (editBook) {
        await bookService.update(editBook._id, payload);
      } else {
        await bookService.create(payload);
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save book.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete (soft) ── */
  const handleDelete = async (bookId) => {
    if (!window.confirm("Remove this book from the catalog?")) return;
    try {
      await bookService.remove(bookId);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const up = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-white">Manage Books</h1>
              <p className="text-slate-400 mt-1">{books.length} books in inventory</p>
            </div>
            <button onClick={openAdd}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-all text-sm">
              + Add New Book
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search books by title or author..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
          </div>

          {/* Table */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-slate-700 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading books…</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-900/30">
                      {["#","Title","Author","Category","Dept","Sem","Price","Copies","Status","Actions"].map((h) => (
                        <th key={h} className="text-left text-slate-400 text-xs font-semibold uppercase px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={10} className="px-4 py-10 text-center text-slate-400 text-sm">
                          No books found.
                        </td>
                      </tr>
                    )}
                    {filtered.map((b, i) => (
                      <tr key={b._id} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors">
                        <td className="px-4 py-3 text-slate-500 text-sm">{i + 1}</td>
                        <td className="px-4 py-3 text-white text-sm font-medium max-w-xs">
                          <div className="truncate">{b.title}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-sm">{(b.author || "").split(",")[0]}</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                            {b.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-sm">{b.department}</td>
                        <td className="px-4 py-3 text-slate-400 text-sm text-center">{b.semester}</td>
                        <td className="px-4 py-3 text-amber-400 font-bold text-sm">₹{b.rentalPrice}</td>
                        <td className="px-4 py-3 text-slate-300 text-sm text-center">
                          {b.availableCopies}/{b.totalCopies}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${
                            b.availableCopies > 0
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {b.availableCopies > 0 ? "Available" : "Rented Out"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(b)}
                              className="text-blue-400 hover:text-blue-300 text-xs border border-blue-500/20 hover:border-blue-500/40 px-2 py-1 rounded-lg transition-colors">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(b._id)}
                              className="text-red-400 hover:text-red-300 text-xs border border-red-500/20 hover:border-red-500/40 px-2 py-1 rounded-lg transition-colors">
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">
                {editBook ? "Edit Book" : "Add New Book"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {saveError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {saveError}
              </div>
            )}

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* Title */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Book Title <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. Data Structures & Algorithms" value={form.title} onChange={up("title")}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
              {/* Author */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Author <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. Narasimha Karumanchi" value={form.author} onChange={up("author")}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
              {/* Subject + ISBN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Subject</label>
                  <input type="text" placeholder="e.g. Data Structures" value={form.subject} onChange={up("subject")}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">ISBN</label>
                  <input type="text" placeholder="978-..." value={form.ISBN} onChange={up("ISBN")}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
              </div>
              {/* Price + Copies */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Rental Price (₹) <span className="text-red-400">*</span></label>
                  <input type="number" min="0" placeholder="e.g. 30" value={form.rentalPrice} onChange={up("rentalPrice")}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Total Copies</label>
                  <input type="number" min="1" value={form.totalCopies} onChange={up("totalCopies")}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
              </div>
              {/* Dept + Sem + Category */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Department</label>
                  <select value={form.department} onChange={up("department")}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50">
                    {["BCA","BBA","B.Com","BSc IT"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Semester</label>
                  <select value={form.semester} onChange={up("semester")}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50">
                    {["1","2","3","4","5","6"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Category</label>
                  <select value={form.category} onChange={up("category")}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50">
                    {CATEGORY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              {/* Image URL */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Cover Image URL</label>
                <input type="url" placeholder="https://…" value={form.imageUrl} onChange={up("imageUrl")}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
              {/* Description */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Description</label>
                <textarea rows={3} placeholder="Brief description of the book…" value={form.description} onChange={up("description")}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-600 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {saving
                  ? <><span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />Saving…</>
                  : editBook ? "Save Changes" : "Add Book"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
