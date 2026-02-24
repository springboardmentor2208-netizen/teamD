const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err.message));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/votes", require("./routes/votes"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/admin", require("./routes/admin"));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


