# BlogHub: Full-Stack Blogging Platform

BlogHub is a premium, modern full-stack blogging platform built with React, Node.js, Express, and MongoDB. It features a responsive layout with a dark theme, secure authentication, interactive likes, and comment threads.

---

## 🚀 Features

-   **User Authentication**: Secure JWT-based registration, login, and profile validation. Passwords are encrypted using `bcryptjs`.
-   **Avatar Generation**: Automated, customized user profile avatars powered by the DiceBear API.
-   **Blog CRUD**: Authoring system allowing registered creators to write, update, and delete their own articles.
-   **Comments Section**: Interactive comment feeds on every article, fostering discussion within the community.
-   **Like System**: Support for users to like/unlike articles to highlight popular content.
-   **Article Search & Categorization**: Robust search indexing filters by keywords, categories, and tags, sorted dynamically.
-   **Vibrant Dark Theme**: Responsive glassmorphism interface styled using Tailwind CSS v4.

---

## 🛠️ Technology Stack

### Frontend
-   **React** (Vite-powered single-page application)
-   **Tailwind CSS v4** (Advanced modern design engine)
-   **React Router v7** (Declarative route manager)
-   **Lucide React** (Consistent icon library)
-   **Axios** (Client-side API requests)

### Backend
-   **Node.js & Express** (Server framework)
-   **MongoDB & Mongoose** (Database and object data modeling)
-   **JSON Web Tokens (JWT)** (Token-based auth system)
-   **Bcrypt.js** (Password hashing)

---

## ⚙️ Project Setup & Installation

### Prerequisites
-   **Node.js** (v18+)
-   A **MongoDB Atlas** account (or local MongoDB database service running)

### 1. Clone & Install Dependencies

In the project root directory, install backend and frontend node packages:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Seed Database Records (Optional)

To reset the database and pre-seed mock users, posts, and comments, run the seed script from the backend directory:

```bash
cd backend
node seed.js
```

---

## 💻 Running the Application

Both frontend and backend must be running simultaneously in development mode.

### Start the Backend Server (Port 5000)
```bash
cd backend
npm run dev
```

### Start the Frontend Server (Port 3000)
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) in your web browser to access the application.
