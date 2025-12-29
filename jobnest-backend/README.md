# JobNest Backend

## Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- `.env` file with `MONGO_URI`

## Setup & Run

1. **Install dependencies** (if not already installed):
   ```bash
   cd jobnest-backend
   npm install express mongoose cors dotenv
   ```

2. **Create `.env` file** (if not exists):
   ```
   MONGO_URI=your_mongodb_connection_string_here
   ```

3. **Run the server**:
   ```bash
   node server.js
   ```

   The server will start on `http://localhost:5000`

4. **Verify it's working**:
   - You should see: "MongoDB Connected" and "Server running on port 5000"

