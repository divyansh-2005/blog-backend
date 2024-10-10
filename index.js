const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

dotenv.config();

const app = express();

// Middleware
const cors = require('cors');
app.use(cors());

app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('blog backend');
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app;