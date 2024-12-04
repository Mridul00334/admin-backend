const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const Analytics = require("./models/analyticsModel");
const InformationModel = require("./models/informationModel");
const SectionModel = require('./models/sectionModel');
const cors = require('cors'); 
const app = express();
app.use(cors());
// mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Database connection failed:", err));
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello from Node.js app!');
});
app.get('/get-list',async (req, res) => {
    const sections = await SectionModel.find({});
    console.log('Sections:', sections); 
    const analytics = await Analytics.find({});
    const information = await InformationModel.find({});
    res.json({
            sections,
            analytics,
            information
    })
});
app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
