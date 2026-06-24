# BookBlink – Smart Book Delivery System
> BCA Final Year Project 2024–25 | MERN Stack | Role-Based Access | JWT Auth

---

## 🔑 Login Credentials (seeded by `node seed.js`)

| Role          | Email                          | Password          |
|---------------|--------------------------------|-------------------|
| **Admin**     | admin@bookblink.com        | LibAdmin@2024     |
| **Delivery**  | delivery@bookblink.com     | LibDeliver@2024   |
| **Student 1** | rahul@student.com              | Student@123       |
| **Student 2** | priya@student.com              | Student@123       |

Students can also **self-register** at `/register`.

---

## 🚀 Quick Start

### 1. Backend

```bash
cd bookblink/server
cp .env.example .env          # fill in MONGO_URI and JWT_SECRET
npm install
node seed.js                  # creates all accounts + 8 books
npm run dev                   # → http://localhost:5000
```

### 2. Frontend

```bash
cd library-to-home            # root folder
npm install
npm run dev                   # → http://localhost:5173
```

---

## 🛠️ Admin Capabilities
- Add, edit, and delete books (live, visible to students immediately)
- View all student orders by status (Requested / Approved / Delivered / Returned)
- Approve or cancel pending orders
- Assign delivery staff to approved orders
- View analytics

## 🚴 Delivery Capabilities
- View assigned deliveries (only tasks assigned to that account)
- Update status: Assigned → Picked Up → Delivered

## 🎓 Student Capabilities
- Browse and search books (fetched live from DB)
- Add to cart and place orders
- Track order status in real-time
- Leave reviews on books they have rented

---

## 📡 API Reference

| Method | Route                       | Access         |
|--------|-----------------------------|----------------|
| POST   | /api/auth/register          | Public         |
| POST   | /api/auth/login             | Public         |
| GET    | /api/books                  | Public         |
| POST   | /api/books                  | Admin          |
| PUT    | /api/books/:id              | Admin          |
| DELETE | /api/books/:id              | Admin          |
| POST   | /api/orders                 | Student        |
| GET    | /api/orders                 | Admin          |
| GET    | /api/orders/user/:userId    | Student/Admin  |
| PUT    | /api/orders/:id/status      | Admin          |
| POST   | /api/delivery               | Admin          |
| GET    | /api/delivery               | Admin/Delivery |
| PUT    | /api/delivery/:id           | Admin/Delivery |
| GET    | /api/admin/analytics        | Admin          |
