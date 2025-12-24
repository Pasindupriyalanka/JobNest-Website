const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Job = require('./models/job');
const app = express();


app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err.message);
        if (err.code === 8000) {
            console.error("\n⚠️  MongoDB Atlas authentication failed. Common causes:");
            console.error("1. Password contains special characters - URL encode them (e.g., @ → %40, # → %23, % → %25)");
            console.error("2. Incorrect username or password");
            console.error("3. Check your MONGO_URI format in .env file");
        }
        process.exit(1);
    });




app.get('/api/jobs', async (req, res) => {
    const jobs = await Job.find().sort({ appliedDate: -1 });
    res.json(jobs);
});


app.post('/api/jobs', async (req, res) => {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.json(savedJob);
});


app.patch('/api/jobs/:id', async (req, res) => {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));