const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// Global array to store fetched data
let globalArray = [];

// Middleware for serving static files
app.use(express.static("public"));
app.set("view engine", "ejs");

// Fetch real-time local data (example: public API or dummy data)
const fetchData = async () => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=10"); // Replace with your local data API
    globalArray = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Home route
app.get("/", (req, res) => {
  res.render("list", { items: globalArray });
});

// Fetch data periodically
setInterval(fetchData, 60000); // Fetch every 60 seconds

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  fetchData(); // Initial fetch
});
