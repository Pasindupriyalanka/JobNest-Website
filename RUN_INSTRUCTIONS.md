# How to Run JobNest Application

## Prerequisites
- Node.js installed on your system
- MongoDB Atlas account (or local MongoDB)
- `.env` file in `jobnest-backend/` directory with your MongoDB connection string

---

## Step 1: Start the Backend Server

1. **Open a terminal/PowerShell window**

2. **Navigate to the backend directory**:
   ```bash
   cd jobnest-backend
   ```

3. **Install dependencies** (if not already installed):
   ```bash
   npm install express mongoose cors dotenv
   ```
   Or if dependencies are in the root:
   ```bash
   cd ..
   npm install
   ```

4. **Make sure you have a `.env` file** in `jobnest-backend/` with:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobnest?appName=Cluster0
   ```

5. **Start the backend server**:
   ```bash
   node server.js
   ```
   
   **OR** if you have nodemon installed:
   ```bash
   nodemon server.js
   ```

6. **You should see**:
   ```
   MongoDB Connected
   Server running on port 5000
   ```

   ✅ Backend is now running on `http://localhost:5000`

---

## Step 2: Start the Frontend

1. **Open a NEW terminal/PowerShell window** (keep the backend running)

2. **Navigate to the frontend directory**:
   ```bash
   cd jobnest-frontend
   ```

3. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

4. **Start the React development server**:
   ```bash
   npm start
   ```

5. **The browser should automatically open** to `http://localhost:3000`

   ✅ Frontend is now running!

---

## Quick Start (Both Servers)

**Terminal 1 - Backend:**
```bash
cd jobnest-backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd jobnest-frontend
npm start
```

---

## Troubleshooting

### Backend Issues:

1. **"MongoDB connection error"**:
   - Check your `.env` file has the correct `MONGO_URI`
   - Make sure your IP is whitelisted in MongoDB Atlas
   - Verify your MongoDB credentials are correct

2. **"Port 5000 already in use"**:
   - Change the PORT in `server.js` to another port (e.g., 5001)
   - Update the `API_BASE_URL` in `frontend/src/App.js` accordingly

### Frontend Issues:

1. **"Cannot connect to backend"**:
   - Make sure backend is running on port 5000
   - Check `API_BASE_URL` in `App.js` matches your backend URL

2. **"npm start fails"**:
   - Run `npm install` again in the frontend directory
   - Delete `node_modules` and `package-lock.json`, then `npm install`

---

## API Endpoints

- `GET http://localhost:5000/api/jobs` - Get all jobs
- `POST http://localhost:5000/api/jobs` - Create a new job
- `PATCH http://localhost:5000/api/jobs/:id` - Update a job
- `DELETE http://localhost:5000/api/jobs/:id` - Delete a job

---

## Your Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/jobs

