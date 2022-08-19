require("dotenv/config");
require("./db");
const cors = require("cors")
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware"); // <== IMPORT

const app = express();
require("./config")(app);

app.use(cors())

// 👇 MIDDLEWARE MISSING
const allRoutes = require("./routes");
app.use("/colaborator-API", allRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/colaborator-API/auth", authRouter);

const userRouter = require("./routes/user.routes");
app.use("/colaborator-API/users", userRouter);

const projectRoutes = require("./routes/project.routes");
app.use("/colaborator-API/projects",isAuthenticated, projectRoutes);

const cardRoutes = require("./routes/card.routes");
app.use("/colaborator-API/projects",isAuthenticated, cardRoutes);

const chatRoutes = require("./routes/chat.routes");
app.use("/colaborator-API/chat", isAuthenticated, chatRoutes);

const activityRoutes = require("./routes/activity.routes");
app.use("/colaborator-API/activity", isAuthenticated, activityRoutes);

module.exports = app;
