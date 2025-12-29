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
        } else if (err.message.includes('IP') || err.message.includes('whitelist')) {
            console.error("\n⚠️  MongoDB Atlas IP Whitelist Error:");
            console.error("Your current IP address is not whitelisted in MongoDB Atlas.");
            console.error("\nTo fix this:");
            console.error("1. Go to: https://cloud.mongodb.com/");
            console.error("2. Navigate to: Network Access (or IP Whitelist)");
            console.error("3. Click 'Add IP Address'");
            console.error("4. Choose 'Add Current IP Address' or 'Allow Access from Anywhere' (0.0.0.0/0)");
            console.error("5. Wait a few minutes for changes to take effect");
        }
        process.exit(1);
    });




app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ appliedDate: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/jobs', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


app.patch('/api/jobs/:id', async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(updatedJob);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


app.delete('/api/jobs/:id', async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully', deletedJob });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));