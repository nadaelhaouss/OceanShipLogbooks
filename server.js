const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

