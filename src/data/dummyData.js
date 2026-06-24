export const books = [
  { id: 1, title: "Data Structures & Algorithms", author: "Narasimha Karumanchi", price: 30, cover: "https://covers.openlibrary.org/b/id/8091016-L.jpg", department: "BCA", semester: "3", rating: 4.5, reviews: 128, available: true, description: "A comprehensive guide to data structures and algorithms, covering arrays, linked lists, trees, graphs, sorting, and searching with practical examples.", category: "Core CS" },
  { id: 2, title: "Operating System Concepts", author: "Silberschatz, Galvin", price: 35, cover: "https://covers.openlibrary.org/b/id/8228691-L.jpg", department: "BCA", semester: "4", rating: 4.3, reviews: 95, available: true, description: "Classic OS textbook covering process management, memory management, file systems, and security in modern operating systems.", category: "Core CS" },
  { id: 3, title: "Database Management Systems", author: "Ramakrishnan & Gehrke", price: 28, cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg", department: "BCA", semester: "4", rating: 4.6, reviews: 210, available: false, description: "Comprehensive coverage of DBMS concepts, SQL, normalization, transaction management, and query optimization.", category: "Database" },
  { id: 4, title: "Computer Networks", author: "Tanenbaum & Wetherall", price: 32, cover: "https://covers.openlibrary.org/b/id/8739161-L.jpg", department: "BCA", semester: "5", rating: 4.4, reviews: 156, available: true, description: "A thorough introduction to computer networks and the internet, TCP/IP protocols, routing, and network security.", category: "Networking" },
  { id: 5, title: "Web Technology", author: "Uttam K. Roy", price: 25, cover: "https://covers.openlibrary.org/b/id/12012251-L.jpg", department: "BCA", semester: "5", rating: 4.2, reviews: 88, available: true, description: "Covers HTML, CSS, JavaScript, PHP, and web frameworks for building modern web applications.", category: "Web Dev" },
  { id: 6, title: "Software Engineering", author: "Ian Sommerville", price: 33, cover: "https://covers.openlibrary.org/b/id/8235193-L.jpg", department: "BCA", semester: "6", rating: 4.1, reviews: 74, available: true, description: "Principles and practices of software engineering, SDLC models, requirements engineering, testing, and project management.", category: "Core CS" },
  { id: 7, title: "C Programming Language", author: "Kernighan & Ritchie", price: 22, cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg", department: "BCA", semester: "1", rating: 4.8, reviews: 342, available: true, description: "The definitive guide to C programming by the creators of C, covering fundamentals to advanced topics.", category: "Programming" },
  { id: 8, title: "Python Programming", author: "Mark Lutz", price: 27, cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg", department: "BCA", semester: "2", rating: 4.5, reviews: 189, available: false, description: "Comprehensive Python programming guide covering core language features, OOP, and the Python ecosystem.", category: "Programming" },
  { id: 9, title: "Discrete Mathematics", author: "Kenneth H. Rosen", price: 30, cover: "https://covers.openlibrary.org/b/id/8739161-L.jpg", department: "BCA", semester: "2", rating: 4.0, reviews: 67, available: true, description: "Foundation mathematics for computer science including logic, sets, relations, graph theory, and combinatorics.", category: "Mathematics" },
  { id: 10, title: "Artificial Intelligence", author: "Stuart Russell & Norvig", price: 38, cover: "https://covers.openlibrary.org/b/id/8228691-L.jpg", department: "BCA", semester: "6", rating: 4.7, reviews: 201, available: true, description: "Comprehensive introduction to AI, covering search algorithms, machine learning, neural networks, and natural language processing.", category: "AI/ML" },
  { id: 11, title: "Java: The Complete Reference", author: "Herbert Schildt", price: 29, cover: "https://covers.openlibrary.org/b/id/8091016-L.jpg", department: "BCA", semester: "3", rating: 4.4, reviews: 145, available: true, description: "Complete Java programming reference covering OOP concepts, collections, multithreading, and Java 17 features.", category: "Programming" },
  { id: 12, title: "Computer Architecture", author: "Patterson & Hennessy", price: 34, cover: "https://covers.openlibrary.org/b/id/8235193-L.jpg", department: "BCA", semester: "3", rating: 4.2, reviews: 93, available: true, description: "Classic text on computer organization and design, covering instruction sets, pipelining, memory hierarchy, and parallel processing.", category: "Core CS" },
];

export const orders = [
  { id: "ORD-001", bookId: 1, bookTitle: "Data Structures & Algorithms", bookAuthor: "Narasimha Karumanchi", status: "Delivered", requestDate: "2024-11-10", deliveryDate: "2024-11-11", returnDate: "2024-11-25", price: 30, address: "Hostel Block A, Room 204", deliverySlot: "Morning (9AM–12PM)", paymentMethod: "UPI" },
  { id: "ORD-002", bookId: 5, bookTitle: "Web Technology", bookAuthor: "Uttam K. Roy", status: "Out for Delivery", requestDate: "2024-11-14", deliveryDate: null, returnDate: "2024-11-28", price: 25, address: "Hostel Block B, Room 110", deliverySlot: "Evening (4PM–7PM)", paymentMethod: "Online" },
  { id: "ORD-003", bookId: 10, bookTitle: "Artificial Intelligence", bookAuthor: "Stuart Russell & Norvig", status: "Requested", requestDate: "2024-11-15", deliveryDate: null, returnDate: null, price: 38, address: "Hostel Block C, Room 312", deliverySlot: "Afternoon (1PM–4PM)", paymentMethod: "Cash on Delivery" },
  { id: "ORD-004", bookId: 7, bookTitle: "C Programming Language", bookAuthor: "Kernighan & Ritchie", status: "Returned", requestDate: "2024-10-20", deliveryDate: "2024-10-21", returnDate: "2024-11-03", price: 22, address: "Hostel Block A, Room 204", deliverySlot: "Morning (9AM–12PM)", paymentMethod: "UPI" },
];

export const deliveryTasks = [
  { id: "DEL-001", orderId: "ORD-002", studentName: "Rahul Sharma", bookTitle: "Web Technology", address: "Hostel Block B, Room 110", slot: "Evening (4PM–7PM)", status: "Picked Up", phone: "9876543210", distance: "0.4 km" },
  { id: "DEL-002", orderId: "ORD-003", studentName: "Priya Patel", bookTitle: "Artificial Intelligence", address: "Hostel Block C, Room 312", slot: "Afternoon (1PM–4PM)", status: "Assigned", phone: "9123456780", distance: "0.7 km" },
  { id: "DEL-003", orderId: "ORD-005", studentName: "Amit Verma", bookTitle: "Database Management Systems", address: "Hostel Block A, Room 108", slot: "Morning (9AM–12PM)", status: "Assigned", phone: "9654321087", distance: "0.2 km" },
];

export const adminStats = {
  totalBooks: 248,
  activeRentals: 62,
  pendingRequests: 14,
  totalStudents: 183,
  revenue: 18450,
  deliveriesToday: 9,
};

export const pendingRequests = [
  { id: "REQ-007", studentName: "Sneha Joshi", bookTitle: "Computer Networks", requestDate: "2024-11-15", semester: "5", department: "BCA" },
  { id: "REQ-008", studentName: "Vikram Singh", bookTitle: "Artificial Intelligence", requestDate: "2024-11-15", semester: "6", department: "BCA" },
  { id: "REQ-009", studentName: "Ritu Mehta", bookTitle: "C Programming Language", requestDate: "2024-11-16", semester: "1", department: "BCA" },
];

export const categories = ["All", "Core CS", "Programming", "Database", "Networking", "Web Dev", "Mathematics", "AI/ML"];
export const departments = ["All", "BCA", "BBA", "B.Com", "BSc IT"];
export const semesters = ["All", "1", "2", "3", "4", "5", "6"];
