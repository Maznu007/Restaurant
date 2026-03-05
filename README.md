# Savour & Stone — Restaurant Reservation System

A modern, full-stack restaurant web application featuring an elegant dark-themed UI, seamless reservation management, and responsive design. Built with React, Node.js, Express, and MongoDB.

![Savour & Stone Preview](preview.png)

## ✨ Features

- **Elegant Dark Theme** — Industrial aesthetic with warm accents, noise textures, and subtle animations
- **Online Reservations** — Real-time table booking with email validation and phone verification
- **Interactive Menu** — Hover-reveal dish cards with detailed recipe modals
- **Responsive Design** — Optimized for desktop, tablet, and mobile devices
- **Team Showcase** — Staff profiles with hover-activated bios and quotes
- **Smooth Animations** — GSAP-quality transitions using pure CSS

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks
- React Router DOM (navigation)
- React Scroll (smooth scrolling)
- React Hot Toast (notifications)
- CSS3 with custom properties & Grid/Flexbox

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- Validator.js (input sanitization)
- CORS enabled
- Dotenv configuration

**Design:**
- Custom dark theme (#0f0f0f base)
- Syne & Space Grotesk typography
- CSS Grid & Flexbox layouts
- Mobile-first responsive approach

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/savour-and-stone.git
   cd savour-and-stone

2. Setup Backend -

```
cd backend
npm install

# Create config.env in backend/config/
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
```

3. Setup Frontend -

```
cd ../frontend
npm install
```

4. Run Development Servers -

```
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```
5 . Open http://localhost:5173
📁 Project Structure
```
savour-and-stone/
├── backend/
│   ├── config/
│   │   └── config.env          # Environment variables
│   ├── controller/
│   │   └── reservation.js      # Reservation CRUD logic
│   ├── database/
│   │   └── dbConnection.js     # MongoDB connection
│   ├── error/
│   │   └── error.js            # Custom error handling
│   ├── models/
│   │   └── reservationSchema.js # Mongoose schema
│   ├── routes/
│   │   └── reservationRoute.js  # API routes
│   ├── app.js                  # Express app configuration
│   └── server.js               # Server entry point
│
├── frontend/
│   ├── public/                 # Static assets (images, SVGs)
│   ├── src/
│   │   ├── components/
│   │   │   ├── About.jsx       # Restaurant story section
│   │   │   ├── Footer.jsx      # Site footer with info
│   │   │   ├── HeroSection.jsx # Landing hero with CTA
│   │   │   ├── Menu.jsx        # Interactive dish cards
│   │   │   ├── Navbar.jsx      # Navigation with smooth scroll
│   │   │   ├── Qualities.jsx   # Value proposition cards
│   │   │   ├── Reservation.jsx # Booking form
│   │   │   ├── Team.jsx        # Staff showcase
│   │   │   └── WhoAreWe.jsx    # Stats section
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   │   └── Home.jsx    # Main landing page
│   │   │   ├── NotFound/
│   │   │   │   └── NotFound.jsx # 404 error page
│   │   │   └── Success/
│   │   │       └── Success.jsx # Post-reservation success
│   │   ├── App.jsx             # Root component with routing
│   │   ├── App.css             # Global styles & theme
│   │   ├── main.jsx            # React entry point
│   │   └── restApi.json        # Static content data
│   ├── index.html
│   └── package.json
│
└── README.md
```

🎨 Design System
Color Palette
| Token                 | Value     | Usage              |
| --------------------- | --------- | ------------------ |
| `--color-bg`          | `#0f0f0f` | Primary background |
| `--color-bg-elevated` | `#1a1a1a` | Cards, sections    |
| `--color-accent`      | `#e63946` | CTAs, highlights   |
| `--color-text`        | `#f5f5f5` | Primary text       |
| `--color-text-muted`  | `#a0a0a0` | Secondary text     |
| `--color-gold`        | `#d4af37` | Special accents    |

Typography

Display: Syne (700/600) — Headings, buttons

Body: Space Grotesk (400/500) — Paragraphs, labels

Key UI Patterns

Cards: 1px border, hover lift (-5px translateY)

Buttons: Sharp corners, uppercase, letter-spacing

Images: Grayscale default, color on hover

Forms: Bottom-border inputs, minimal labels


🔌 API Endpoints

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| POST   | `/api/v1/reservation/send` | Create new reservation       |
| GET    | `/api/v1/reservation/all`  | Get all reservations (admin) |

Reservation Schema

```
{
  "firstName": "String (3-30 chars)",
  "lastName": "String (3-30 chars)",
  "email": "String (valid email)",
  "phone": "String (11 digits)",
  "date": "String (YYYY-MM-DD)",
  "time": "String (HH:MM)"
}
```
<img width="1911" height="812" alt="image" src="https://github.com/user-attachments/assets/e7570f9a-e3f9-4635-b995-9da4b0e95672" />
| -------------------------------------------------------------------------------------------------------------------------------------------- |
<img width="1142" height="255" alt="image" src="https://github.com/user-attachments/assets/1ca7f400-6788-472a-aa12-fd375b0cd86b" />
| -------------------------------------------------------------------------------------------------------------------------------------------- |
<img width="1274" height="860" alt="image" src="https://github.com/user-attachments/assets/71397073-83bc-4628-8c70-fd95461436e3" />
| -------------------------------------------------------------------------------------------------------------------------------------------- |
<img width="1350" height="823" alt="image" src="https://github.com/user-attachments/assets/9282c5cb-bb4d-4a19-a616-3ff87ec4ee9b" />
| -------------------------------------------------------------------------------------------------------------------------------------------- |
<img width="886" height="444" alt="image" src="https://github.com/user-attachments/assets/31d011fd-75ae-4ce0-9b4c-2101305612a7" />
| -------------------------------------------------------------------------------------------------------------------------------------------- |
<img width="1578" height="858" alt="image" src="https://github.com/user-attachments/assets/63c491c4-15b5-4df0-b959-a063085c33f9" />
| -------------------------------------------------------------------------------------------------------------------------------------------- |
