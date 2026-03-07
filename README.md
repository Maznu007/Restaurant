🍽️ Savour & Stone

------------------

live link - https://restaurant-eosin-pi.vercel.app/

Modern Restaurant Management System (MERN Stack)

A full-stack restaurant management platform built with the MERN stack that enables customers to explore menus, order dishes, book tables, and review meals — while administrators manage restaurant operations through a powerful dashboard.

✨ Live Experience
----------------

The system provides two separate user experiences:

👤 Customer Interface
------------------

Browse menu

Place food orders

Reserve tables

Write dish reviews

Track order history

👨‍🍳 Admin Dashboard
------------------

Manage orders

Manage reservations

Approve or reject reviews

Manage menu items

Monitor restaurant analytics

🧠 System Architecture
------------------
```
           React Frontend
                │
                │ Axios Requests
                ▼
        Express REST API
                │
                │ Mongoose ODM
                ▼
             MongoDB
```
Flow
------------------
1️⃣ User interacts with React UI
2️⃣ Axios sends API request to backend
3️⃣ Express handles route + business logic
4️⃣ MongoDB stores and retrieves data
5️⃣ Response returned to frontend

🚀 Features
------------------
🍔 Customer Features
🔐 Authentication

Secure user registration

Login with JWT authentication

Protected dashboard routes

Persistent login using localStorage

📋 Menu Browsing
------------------
Users can:

Browse all restaurant dishes

View dish details

View ingredients

View chef notes

See preparation time

🛒 Food Ordering
------------------
Customers can:

Select dish

Choose quantity

Add special instructions

Place orders instantly

Each order contains:
```
Customer Info
Ordered Items
Quantity
Total Price
Order Status
Timestamp
```
📅 Table Reservations
------------------
Customers can reserve tables by providing:

Name

Email

Phone

Reservation Date

Reservation Time

Party Size

⭐ Dish Reviews
------------------
Customers can:

Rate dishes (1–5 stars)

Write feedback

Submit reviews

Reviews require admin approval before appearing publicly.

📊 Personal Dashboard
------------------
Users can track:

Order history

Reservations

Reviews

Profile information

🧑‍💼 Admin Dashboard
------------------
Admins have full system control.

📈 Analytics Overview

Admin dashboard shows:
------------------
Total Orders

Total Reservations

Total Reviews

Total Users

🍽 Menu Management
------------------
Admin can:

Add new dishes

Edit dishes

Delete dishes

Toggle availability

Manage ingredients

📦 Order Management
------------------
Admin can:

View all customer orders

Monitor order details

Track order status

📅 Reservation Management
------------------
Admin can:

View reservations

Check guest details

Monitor booking schedules

⭐ Review Moderation
------------------
Admin can:

Approve reviews

Reject inappropriate reviews

👥 User Management
------------------
Admin can view:

Registered users

Contact details

Registration date

🧩 Tech Stack

------------------

Frontend
------------------
React.js

React Router

Axios

React Icons

React Hot Toast

Vite

Custom CSS Design System

Backend
------------------

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

bcrypt password hashing

dotenv

CORS middleware

📂 Project Structure
------------------
```
restaurant-system
│
├── backend
│   ├── middleware
│   │   └── auth.js
│   │
│   ├── models
│   │   ├── menuItemSchema.js
│   │   ├── orderSchema.js
│   │   ├── reservationSchema.js
│   │   ├── reviewSchema.js
│   │   └── userSchema.js
│   │
│   ├── routes
│   │   ├── authRoute.js
│   │   ├── menuRoute.js
│   │   ├── orderRoute.js
│   │   ├── reservationRoute.js
│   │   └── reviewRoute.js
│   │
│   ├── controllers
│   ├── utils
│   ├── app.js
│   └── server.js
│
└── frontend
    └── src
        ├── components
        ├── context
        ├── pages
        ├── App.jsx
        ├── main.jsx
        └── restApi.json
```
🔌 API Endpoints

------------------

Authentication
------------------
```
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```
Menu
------------------
```
GET  /api/v1/menu/all
POST /api/v1/menu
PUT  /api/v1/menu/:id
DELETE /api/v1/menu/:id
```
Orders
------------------
```
POST /api/v1/orders/create
GET  /api/v1/orders/my
GET  /api/v1/orders/all
```
Reservations
------------------
```
POST /api/v1/reservation/send
GET  /api/v1/reservation/my
GET  /api/v1/reservation/all
```
Reviews
------------------
```
POST /api/v1/reviews/create
GET  /api/v1/reviews
PUT  /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
```
🌐 Frontend Routes
------------------
```
/            → Home
/login       → Login Page
/success     → Order success page
/dashboard   → Customer dashboard
/admin       → Admin dashboard
*            → Not found page
```
🔐 Authentication Flow
------------------

1️⃣ User logs in
2️⃣ Backend generates JWT token
3️⃣ Token stored in browser localStorage
4️⃣ Axios attaches token in headers
Protected routes verify authentication before allowing access.

🗄 Database Models
------------------

User
------------------
```
name
email
password
phone
role (user/admin)
createdAt
```
Menu Item
------------------
```
title
category
description
ingredients
price
availability
image
rating
```
Order
------------------
```
user
items
quantity
notes
total
status
createdAt
```
Reservation
------------------
```
name
email
phone
date
time
guests
status
```
Review
------------------
```
user
dish
rating
comment
status
createdAt
```
⚙️ Installation

------------------

Clone repository
------------------
```
git clone https://github.com/yourusername/restaurant-management-system.git
```
Backend Setup
------------------
```
cd backend
npm install
npm start
```
Server runs on
------------------
```
http://localhost:4000
```
Frontend Setup
------------------
```
cd frontend
npm install
npm run dev
```
Frontend runs on
------------------
```
http://localhost:5173
```
🔑 Environment Variables
------------------

Create .env file inside backend.
```
PORT=4000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```
📊 Future Improvements
------------------

Possible upgrades:

Online payment integration

Order tracking system

Email notifications

Real-time updates using WebSockets

Image uploads for dishes

Restaurant analytics dashboard

🖼 Screenshots -

------------------

<img width="1917" height="799" alt="image" src="https://github.com/user-attachments/assets/f2b2ebb5-873f-4b3c-96e4-3271fd2d7891" />

------------------

<img width="1913" height="881" alt="image" src="https://github.com/user-attachments/assets/58d12650-1483-47bc-947a-7b3f86a2baa7" />

------------------

<img width="1910" height="893" alt="image" src="https://github.com/user-attachments/assets/f868fc05-cfa1-4218-b28a-3778171de47e" />

------------------

<img width="1912" height="881" alt="image" src="https://github.com/user-attachments/assets/1f226526-bcc0-4a72-b37d-71ab5a8d0169" />

------------------

<img width="1916" height="782" alt="image" src="https://github.com/user-attachments/assets/06ce4f48-2bbe-4ff2-95b7-50aec9c659ac" />


------------------

<img width="1912" height="888" alt="5" src="https://github.com/user-attachments/assets/89a868aa-b5a1-4d26-8945-ade43e252836" />

------------------

<img width="1919" height="883" alt="6" src="https://github.com/user-attachments/assets/f0f14453-ff7a-45a6-8133-d2712f71ec77" />

------------------

<img width="1919" height="890" alt="7" src="https://github.com/user-attachments/assets/49ba0bf7-861c-45a2-aefa-6ad9626da79b" />

------------------

<img width="1917" height="890" alt="8" src="https://github.com/user-attachments/assets/3a19d1a1-555b-4c6a-8559-93c799628706" />

------------------

<img width="1919" height="877" alt="9" src="https://github.com/user-attachments/assets/662e913f-21ff-4442-9937-8278defab5c2" />

------------------

<img width="1919" height="882" alt="10" src="https://github.com/user-attachments/assets/7885d600-9a7b-43d4-a5d3-f7e0bd26c15b" />

------------------

<img width="1915" height="881" alt="11" src="https://github.com/user-attachments/assets/efc015be-6996-4686-ad86-b56d01fde35a" />

------------------

<img width="1919" height="889" alt="12" src="https://github.com/user-attachments/assets/dc991234-aa73-4528-939b-80a9d2abee8a" />

------------------

<img width="1919" height="890" alt="13" src="https://github.com/user-attachments/assets/0a4938b1-515e-4ab4-b42f-fc30f04f25de" />

------------------

<img width="1918" height="880" alt="14" src="https://github.com/user-attachments/assets/8d3ba1fc-ec30-48ff-b63c-49a2d85a57d8" />

------------------



