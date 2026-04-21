# 🚀 CodeMaster - Online Code Editor

A robust, modern, and fully responsive online code editor built with HTML, CSS, JavaScript alongside a powerful Node.js/MongoDB backend. Features an embedded Monaco Editor instance (the same editor powering VS Code), enabling users to write code, see a live preview, manage snippets, and store favorites.

---

## 📸 Screenshots

| Editor Interface | User Dashboard |
| :---: | :---: |
| *![Editor Screenshot](https://via.placeholder.com/600x350?text=Editor+Screenshot)* | *![Dashboard Screenshot](https://via.placeholder.com/600x350?text=Dashboard+Screenshot)* |

*Replace placeholders with actual project screenshots!*

---

## ✨ Key Features
- **Integrated Monaco Editor**: Best-in-class syntax highlighting and formatting.
- **Real-time Live Preview**: View changes securely in an isolated iframe.
- **Secure Authentication**: JWT-based auth via HttpOnly Cookies with CSRF and XSS protection.
- **Full Snippet CRUD**: Create, read, update, delete, duplicate, and favorite code snippets.
- **Responsive Dashboard**: Modern UI using Bootstrap 5 to browse snippets and view stats.
- **Dark & Light Mode**: Accessible to all preferences.
- **Zip Download**: Save your full project instantly to your local machine.

---

## 🛠️ Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Monaco Editor, Bootstrap 5.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (via Mongoose).
- **Security:** Helmet, Rate Limit, MongoDB Sanitize, XSS Clean, Bcrypt.js, JSONWebToken.

---

## ⚙️ Environment Variables (`.env`)
To run this project securely, you must establish an environment variable file in the `backend` directory named `.env`. See `.env.example` for the exact keys required:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/codemaster?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
FRONTEND_URL=http://127.0.0.1:5500
```

---

## 🚀 Deployment Guide

### 1. Database Deployment (MongoDB Atlas)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Build a new Cluster and set up a Database User with a secure password.
3. Whitelist IP addresses (use `0.0.0.0/0` for universal access if connecting via Render/Vercel).
4. Click **Connect** -> **Connect your application** and copy the Connection String URI.
5. Replace `<username>` and `<password>` in the URI with your credentials. This is your `MONGO_URI`.

### 2. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign up on [Render.com](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Configure the settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` (or `npm start`)
5. Click **Advanced** and add your Environment Variables matching your `.env` file. Note: Set `NODE_ENV` to `production` and `FRONTEND_URL` to your final Vercel frontend URL.
6. Click **Deploy**. Copy the backend URL once live.

### 3. Frontend Deployment (Vercel)
1. Sign up on [Vercel.com](https://vercel.com).
2. Click **Add New Project** and import your GitHub repository.
3. Configure the settings:
   - **Root Directory:** `frontend` (Click Edit to select the frontend folder).
   - **Framework Preset:** `Other` (Static HTML)
4. Before deploying, ensure you update any `API_URL` constants in `frontend/js/api/client.js` to point to your new Render backend URL instead of `http://localhost:5000/api`.
5. Click **Deploy**.

---

## 📖 API Documentation

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user and receive a JWT cookie | Public |
| POST | `/login` | Authenticate user and receive a JWT cookie | Public |
| GET | `/me` | Get current logged-in user details | Private |
| PUT | `/updatedetails` | Update name/email | Private |
| PUT | `/updatepassword` | Change password | Private |
| GET | `/logout` | Clear auth cookie | Private |

### Snippet Routes (`/api/snippets`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all user snippets (accepts `search`, `language`, `sort`) | Private |
| POST | `/` | Create a new snippet | Private |
| GET | `/:id` | Get a single snippet by ID | Private |
| PUT | `/:id` | Update a snippet | Private |
| DELETE| `/:id` | Delete a snippet | Private |
| POST | `/:id/duplicate` | Duplicate an existing snippet | Private |
| PUT | `/:id/favorite` | Toggle favorite status | Private |

---

## 🔒 Security Implementations
- **Helmet**: Sets various HTTP headers to help protect the app.
- **Express Rate Limit**: Guards against brute-force attacks and DDoS by limiting IP request rates.
- **Express Mongo Sanitize**: Prevents NoSQL script injections.
- **XSS Clean**: Sanitizes user input against Cross-Site Scripting (XSS).
- **HPP**: Protects against HTTP Parameter Pollution attacks.
- **Secure Cookies (HttpOnly, SameSite, Secure)**: Tokens are transmitted securely prohibiting JavaScript extraction on the client-side.

---

**Built with ❤️ for Developers** Web App

## Overview
A scalable and professional Online Code Editor built with Node.js, Express, MongoDB on the backend, and Vanilla JavaScript on the frontend.

## Architecture & Folder Structure
- **`/backend`**: Node.js and Express application.
  - `/config`: Database and environment configurations.
  - `/controllers`: Business logic for handling API requests.
  - `/models`: Mongoose schemas and database models.
  - `/routes`: API endpoint definitions.
  - `/middleware`: Custom middleware (e.g., error handling, auth).
- **`/frontend`**: Vanilla JS frontend.
  - `/css`: Styling and layout.
  - `/js/components`: Reusable UI components.
  - `/js/api`: API client utilities.
- **Deployment**: Dockerized setup and configuration files.

## Getting Started
1. Navigate to `/backend` and run `npm install`.
2. Copy `backend/.env.example` to `backend/.env` and update the variables.
3. Start the backend with `npm start` or `npm run dev`.
4. Serve the `/frontend` directory using any static file server (e.g., Live Server or Nginx).

## Deployment
Use the included `docker-compose.yml` to spin up the application along with a MongoDB instance orchestrating the backend and frontend seamlessly.
