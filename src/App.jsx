import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/common/Navbar";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import BooksPage from "./pages/BooksPage";
import BookDetailsPage from "./pages/BookDetailsPage";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import CartPage from "./pages/student/CartPage";
import CheckoutPage from "./pages/student/CheckoutPage";
import OrdersPage from "./pages/student/OrdersPage";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooksPage from "./pages/admin/AdminBooksPage";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

// Delivery
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryTasksPage from "./pages/delivery/DeliveryTasksPage";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-950">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailsPage />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/student/orders" element={<OrdersPage />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/books" element={<AdminBooksPage />} />
            <Route path="/admin/requests" element={<AdminRequestsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

            {/* Delivery Routes */}
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/delivery/tasks" element={<DeliveryTasksPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}
