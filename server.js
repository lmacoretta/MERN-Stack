const express = require('express');
const app = express();

/** Config */
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API RUNNING');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
