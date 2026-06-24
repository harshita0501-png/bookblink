/**
 * seed.js  –  BookBlink
 * Creates the admin, delivery staff, two sample students,
 * 8 books, 2 orders, and 1 delivery assignment.
 *
 * Run: node seed.js
 */

require("dotenv").config();
const connectDB = require("./config/db");

const User     = require("./models/User");
const Book     = require("./models/Book");
const Order    = require("./models/Order");
const Review   = require("./models/Review");
const Delivery = require("./models/Delivery");
const Payment  = require("./models/Payment");

/* ── Accounts ───────────────────────────────────────────── */
const ADMIN_EMAIL    = "admin@bookblink.com";
const ADMIN_PASSWORD = "LibAdmin@2024";

const DELIVERY_EMAIL    = "delivery@bookblink.com";
const DELIVERY_PASSWORD = "LibDeliver@2024";

const users = [
  {
    name:     "BookBlink Admin",
    email:    ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role:     "admin",
    phone:    "9000100001",
    isActive: true,
  },
  {
    name:     "Ravi Kumar (Delivery)",
    email:    DELIVERY_EMAIL,
    password: DELIVERY_PASSWORD,
    role:     "delivery",
    phone:    "9000100002",
    isActive: true,
  },
  {
    name:       "Rahul Sharma",
    email:      "rahul@student.com",
    password:   "Student@123",
    role:       "student",
    studentId:  "BCA2024001",
    phone:      "9876543210",
    department: "BCA",
    semester:   5,
    isActive:   true,
  },
  {
    name:       "Priya Patel",
    email:      "priya@student.com",
    password:   "Student@123",
    role:       "student",
    studentId:  "BCA2024002",
    phone:      "9876543211",
    department: "BCA",
    semester:   4,
    isActive:   true,
  },
];

/* ── Books ──────────────────────────────────────────────── */
const books = [
  {
    title: "Data Structures & Algorithms", author: "Narasimha Karumanchi",
    subject: "Data Structures", semester: 3, department: "BCA", category: "Core CS",
    ISBN: "978-8192107462", totalCopies: 5, availableCopies: 5, rentalPrice: 30,
    description: "Comprehensive guide to data structures covering arrays, linked lists, trees, graphs, sorting and searching.",
    imageUrl: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
  },
  {
    title: "Operating System Concepts", author: "Silberschatz & Galvin",
    subject: "Operating Systems", semester: 4, department: "BCA", category: "Core CS",
    ISBN: "978-1118063330", totalCopies: 4, availableCopies: 4, rentalPrice: 35,
    description: "Classic OS textbook covering process management, memory management, file systems, and security.",
    imageUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
  },
  {
    title: "Database Management Systems", author: "Ramakrishnan & Gehrke",
    subject: "DBMS", semester: 4, department: "BCA", category: "Database",
    ISBN: "978-0072465631", totalCopies: 3, availableCopies: 3, rentalPrice: 28,
    description: "DBMS concepts, SQL, normalization, transaction management, and query optimization.",
    imageUrl: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
  },
  {
    title: "Computer Networks", author: "Tanenbaum & Wetherall",
    subject: "Networking", semester: 5, department: "BCA", category: "Networking",
    ISBN: "978-0132126953", totalCopies: 4, availableCopies: 4, rentalPrice: 32,
    description: "TCP/IP protocols, routing, network security, and the modern internet.",
    imageUrl: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
  },
  {
    title: "Web Technology", author: "Uttam K. Roy",
    subject: "Web Development", semester: 5, department: "BCA", category: "Web Dev",
    ISBN: "978-8173717567", totalCopies: 5, availableCopies: 5, rentalPrice: 25,
    description: "HTML, CSS, JavaScript, PHP, and web frameworks for modern web applications.",
    imageUrl: "https://covers.openlibrary.org/b/id/12012251-L.jpg",
  },
  {
    title: "Artificial Intelligence", author: "Stuart Russell & Norvig",
    subject: "AI", semester: 6, department: "BCA", category: "AI/ML",
    ISBN: "978-0136042594", totalCopies: 3, availableCopies: 3, rentalPrice: 38,
    description: "Search algorithms, machine learning, neural networks, and NLP fundamentals.",
    imageUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
  },
  {
    title: "C Programming Language", author: "Kernighan & Ritchie",
    subject: "C Programming", semester: 1, department: "BCA", category: "Programming",
    ISBN: "978-0131103627", totalCopies: 8, availableCopies: 8, rentalPrice: 22,
    description: "The definitive C programming guide by its creators.",
    imageUrl: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
  },
  {
    title: "Java: The Complete Reference", author: "Herbert Schildt",
    subject: "Java Programming", semester: 3, department: "BCA", category: "Programming",
    ISBN: "978-1260440232", totalCopies: 4, availableCopies: 4, rentalPrice: 29,
    description: "OOP concepts, collections, multithreading, and modern Java features.",
    imageUrl: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
  },
];

/* ── Main ───────────────────────────────────────────────── */
const seed = async () => {
  try {
    await connectDB();
    console.log("\n🌱 Starting seed...\n");

    // Clear everything
    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Delivery.deleteMany({}),
      Payment.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Users (passwords hashed by pre-save hook)
    const created = await User.create(users);
    console.log(`✅ Created ${created.length} users`);

    const admin    = created.find((u) => u.role === "admin");
    const staff    = created.find((u) => u.role === "delivery");
    const student1 = created.find((u) => u.email === "rahul@student.com");

    // Books
    const createdBooks = await Book.create(books);
    console.log(`✅ Created ${createdBooks.length} books`);

    const book1 = createdBooks[0]; // DSA
    const book2 = createdBooks[4]; // Web Tech

    // Orders
    // Order 1: already delivered (DSA)
    const order1 = await Order.create({
      userId:          student1._id,
      bookId:          book1._id,
      deliveryAddress: { block: "Hostel Block A", room: "204", phone: "9876543210" },
      slot:            "Morning (9AM-12PM)",
      status:          "Delivered",
      rentalAmount:    book1.rentalPrice,
      paymentStatus:   "Paid",
      requestDate:     new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    });
    // Reduce available copy for this book
    await Book.findByIdAndUpdate(book1._id, { $inc: { availableCopies: -1 } });

    // Order 2: requested, not yet approved (Web Tech)
    const order2 = await Order.create({
      userId:          student1._id,
      bookId:          book2._id,
      deliveryAddress: { block: "Hostel Block A", room: "204", phone: "9876543210" },
      slot:            "Evening (4PM-7PM)",
      status:          "Requested",
      rentalAmount:    book2.rentalPrice,
      paymentStatus:   "Pending",
    });
    await Book.findByIdAndUpdate(book2._id, { $inc: { availableCopies: -1 } });

    console.log("✅ Created 2 sample orders");

    // Delivery assignment for order1
    await Delivery.create({
      orderId:      order1._id,
      staffId:      staff._id,
      status:       "Delivered",
      deliverySlot: order1.slot,
      qrCode:       `BB-${order1._id}-DEMO`,
      deliveredAt:  new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      pickedAt:     new Date(Date.now() - 11.5 * 24 * 60 * 60 * 1000),
    });
    console.log("✅ Created 1 delivery record");

    // Payment for order1
    await Payment.create({
      orderId:  order1._id,
      userId:   student1._id,
      amount:   book1.rentalPrice,
      method:   "upi",
      type:     "rental",
      status:   "Completed",
      paidAt:   new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    });
    console.log("✅ Created 1 payment record");

    // Review
    await Review.create({
      bookId:  book1._id,
      userId:  student1._id,
      rating:  5,
      comment: "Excellent book! Great for DSA exam prep.",
    });
    console.log("✅ Created 1 review");

    console.log("\n══════════════════════════════════════════");
    console.log("🎉 Seed complete!\n");
    console.log("  ADMIN ACCOUNT");
    console.log(`  Email   : ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}\n`);
    console.log("  DELIVERY ACCOUNT");
    console.log(`  Email   : ${DELIVERY_EMAIL}`);
    console.log(`  Password: ${DELIVERY_PASSWORD}\n`);
    console.log("  STUDENT ACCOUNTS");
    console.log("  Email   : rahul@student.com  / Student@123");
    console.log("  Email   : priya@student.com  / Student@123");
    console.log("══════════════════════════════════════════\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();
