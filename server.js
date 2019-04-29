const express = require('express');
const app = express();
const connectDB = require('./config/db');

/** Config */
const PORT = process.env.PORT || 5000;

/** Middelware */
app.use(express.json({ extended: false }));

/** Connect db */
connectDB();

/** Routes */
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
