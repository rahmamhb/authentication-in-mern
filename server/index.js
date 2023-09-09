require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/passwordReset");
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");



// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

//passport setUp 
app.use(
	cookieSession({
		name: "session",
		keys: ["Rmhb"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));