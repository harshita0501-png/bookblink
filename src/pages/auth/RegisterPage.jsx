import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function RegisterPage() {
  const { register, loading, error } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    studentId: "", department: "BCA", semester: "1", phone: ""
  });
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (form.password !== form.confirmPassword) {
      return setLocalError("Passwords do not match");
    }
    const result = await register({
      name: form.name, email: form.email, password: form.password,
      studentId: form.studentId, department: form.department,
      semester: Number(form.semester), phone: form.phone, role: "student",
    });
    if (result.success) navigate("/student/dashboard");
    else setLocalError(result.message);
  };

  const up = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-amber-500 text-slate-900 p-2 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-2xl font-black text-white">Book<span className="text-amber-400">Blink</span></span>
          </Link>
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-slate-400 mt-1">Join as a student to start renting books</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
          {displayError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {displayError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
              <input required type="text" placeholder="Rahul Sharma" value={form.name} onChange={up("name")}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Enrollment Number</label>
              <input type="text" placeholder="BCA2021001" value={form.studentId} onChange={up("studentId")}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Department</label>
                <select value={form.department} onChange={up("department")}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors">
                  {["BCA","BBA","B.Com","BSc IT"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Semester</label>
                <select value={form.semester} onChange={up("semester")}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors">
                  {[1,2,3,4,5,6].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
              <input type="tel" placeholder="9876543210" value={form.phone} onChange={up("phone")}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
              <input required type="email" placeholder="you@college.edu" value={form.email} onChange={up("email")}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
              <input required type="password" placeholder="Min. 6 characters" value={form.password} onChange={up("password")}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Confirm Password</label>
              <input required type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={up("confirmPassword")}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>Creating…</> : "Create Account →"}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
