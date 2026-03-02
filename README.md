<div align="center">

<img src="https://img.shields.io/badge/Obsidian-000000?style=for-the-badge&logo=data:image/svg+xml;base64,..." alt="Obsidian Logo" />

# ⌚ Obsidian
### Luxury Watch E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-obsidian--shop.vercel.app-black?style=for-the-badge&logo=vercel)](https://obsidian-shop.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-KunjGupta2006%2FObsidian-181717?style=for-the-badge&logo=github)](https://github.com/KunjGupta2006/Obsidian)
![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)

*A full-stack luxury watch e-commerce experience — crafted with precision.*

</div>

---

## 📸 Preview

> Visit the live store → [obsidian-shop.vercel.app](https://obsidian-shop.vercel.app/)

---

## ✨ Features

### 🛍️ Customer Experience
- **Authentication** — Secure login/signup with JWT + Google OAuth (Passport.js)
- **Featured Items** — Curated homepage showcasing top picks
- **Collections** — Browse the full catalog of luxury watches
- **Search** — Instantly find watches by name or category
- **Wishlist** — Save watches for later
- **Cart & Checkout** — Full checkout flow with mock payment UI for online payments
- **Order Certificate** — Downloadable PDF certificate for each order
- **Profile Dashboard** — View cart, orders, and purchase history

### 🔐 Admin Panel
| Feature | Description |
|---|---|
| 📊 Dashboard | Total sales overview and store analytics |
| 👥 Users | View all users, upgrade roles, delete accounts |
| 📦 Products | Full product listing with stock levels; add new watches |
| 🧾 Orders | View all orders; click into any order for full details |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Redux Toolkit, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT, Passport.js, Google OAuth 2.0 |
| **Deployment** | Vercel (Frontend), Railway (Backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- MongoDB URI
- Google OAuth credentials

### 1. Clone the Repository

```bash
git clone https://github.com/KunjGupta2006/Obsidian.git
cd Obsidian
```

### 2. Setup Environment Variables

**Backend** — create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:5173
```

**Frontend** — create a `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Install Dependencies & Run

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 📁 Project Structure

```
Obsidian/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   ├── store/           # Redux slices & store
│   │   └── utils/           # Helper functions
│   └── ...
│
├── server/                  # Express backend
│   ├── controllers/         # Route handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & error middleware
│   └── ...
```


## ☁️ Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [obsidian-shop.vercel.app](https://obsidian-shop.vercel.app/) |
| Backend | Railway | *(Railway-generated URL)* |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with 🖤 by [Kunj Gupta](https://github.com/KunjGupta2006)

⭐ Star this repo if you like it!

</div>
