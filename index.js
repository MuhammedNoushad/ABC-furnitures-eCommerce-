const path = require("path");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoutes");
const userController = require("./controllers/userController")

const app = express();
const port = process.env.PORT || 3000;

// connecting to mongo db database
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB Atlas connection error:', err);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "./views/userViews");

app.use("/", userRoute);
app.use("/admin", adminRoute);


// to load the error page 
app.get("*",userController.loadErrorPage)

app.listen(port, () => {
  console.log(`Server is running on the http://127.0.0.1:${port}`);
});
