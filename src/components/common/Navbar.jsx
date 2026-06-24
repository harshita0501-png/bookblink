import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function Navbar() {
  const { role, user, cart, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 border-b border-amber-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-amber-500 text-slate-900 p-1.5 rounded-lg group-hover:bg-amber-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-none">Book</span>
              <span className="text-amber-400 font-bold text-lg leading-none">Blink</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {!role && (
              <>
                <Link to="/" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">Home</Link>
                <Link to="/books" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">Browse Books</Link>
              </>
            )}
            {role === "student" && (
              <>
                <Link to="/student/dashboard" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/books" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">Books</Link>
                <Link to="/student/orders" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">My Orders</Link>
              </>
            )}
            {role === "admin" && (
              <>
                <Link to="/admin/dashboard" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/admin/books" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">Manage Books</Link>
                <Link to="/admin/requests" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">Requests</Link>
              </>
            )}
            {role === "delivery" && (
              <>
                <Link to="/delivery/dashboard" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/delivery/tasks" className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">My Tasks</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {role === "student" && (
              <Link to="/cart" className="relative text-slate-300 hover:text-amber-400 transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {!role ? (
              <Link to="/login" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors">
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-white text-sm font-medium">{user?.name}</div>
                  <div className="text-amber-400 text-xs capitalize">{role}</div>
                </div>
                <button onClick={handleLogout} className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 px-3 py-1.5 rounded-lg text-sm transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
