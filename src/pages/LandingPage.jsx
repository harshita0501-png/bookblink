import { Link } from "react-router-dom";

const features = [
  { icon: "📚", title: "Vast Book Catalog", desc: "Browse thousands of academic books filtered by department, semester, and subject." },
  { icon: "🚚", title: "Home Delivery", desc: "Get books delivered to your hostel block with flexible morning, afternoon, or evening slots." },
  { icon: "💳", title: "Easy Payments", desc: "Pay rental fees online via UPI, net banking or cash on delivery — fully transparent pricing." },
  { icon: "📦", title: "Real-time Tracking", desc: "Track your book delivery with live status updates and QR-based tracking." },
  { icon: "⭐", title: "Reviews & Ratings", desc: "Rate books, leave helpful reviews, and get semester-based recommendations." },
  { icon: "📊", title: "Admin Analytics", desc: "Powerful admin dashboard with inventory management, approvals, and usage insights." },
];

const steps = [
  { step: "01", title: "Browse & Select", desc: "Search books by subject, semester, or department from our digital catalog." },
  { step: "02", title: "Place Request", desc: "Add to cart and choose a convenient delivery slot for your hostel block." },
  { step: "03", title: "Get Delivered", desc: "Our delivery staff brings the book right to your door within the chosen slot." },
  { step: "04", title: "Return & Review", desc: "Return the book after use and leave a review to help fellow students." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-slate-900/50 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            <span className="text-amber-400 text-sm font-medium">BCA Final Year Project — 2024–25</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tight leading-none">
            Book<span className="text-amber-400">Blink</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A Smart Book Delivery System that brings your college library to your hostel doorstep. Browse, rent, track — all online.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/20">
              Get Started →
            </Link>
            <Link to="/books" className="border border-slate-600 hover:border-amber-500/50 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:text-amber-400">
              Browse Books
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto">
            {[["248+", "Books Available"], ["183+", "Active Students"], ["500+", "Books Delivered"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-amber-400">{num}</div>
                <div className="text-slate-400 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Everything You Need</h2>
            <p className="text-slate-400 text-lg">A complete ecosystem for digital library management</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/20 hover:bg-slate-800 transition-all group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Simple 4-step process to get books at your doorstep</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <div className="text-4xl font-black text-amber-500/20 mb-3">{s.step}</div>
                <h3 className="text-white font-bold mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">3 Roles, 1 Platform</h2>
          <p className="text-slate-400 text-lg mb-12">Role-based access for students, admins, and delivery staff</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { role: "Student", icon: "🎓", desc: "Browse, rent, track deliveries and manage your account" },
              { role: "Admin", icon: "⚙️", desc: "Manage inventory, approve requests, view analytics" },
              { role: "Delivery Staff", icon: "🚴", desc: "View assigned tasks, update delivery status in real-time" },
            ].map((r) => (
              <div key={r.role} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
                <div className="text-5xl mb-4">{r.icon}</div>
                <h3 className="text-white font-bold text-xl mb-2">{r.role}</h3>
                <p className="text-slate-400 text-sm">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">Join hundreds of students already using BookBlink</p>
          <Link to="/register" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105 inline-block">
            Create Account — It's Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 px-4 text-center text-slate-500 text-sm">
        <p>BookBlink — Smart Book Delivery System | BCA Final Year Project 2024–25</p>
        <p className="mt-1 text-slate-600">MERN Stack | Role-Based Access | QR Tracking</p>
      </footer>
    </div>
  );
}
