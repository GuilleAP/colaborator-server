require("dotenv/config");
require("./db");
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware"); // <== IMPORT


const app = express();
require("./config")(app);


// 👇 MIDDLEWARE MISSING
const allRoutes = require("./routes");
app.use("/colaborator-API", allRoutes);

const authRouter = require("./routes/user_routes/auth.routes");
app.use("/colaborator-API/auth", authRouter);

const userRouter = require("./routes/user_routes/user.routes");
app.use("/colaborator-API/users", userRouter);

const projectRoutes = require("./routes/project_routes/project.routes");
app.use("/colaborator-API/projects", projectRoutes);

const cardRoutes = require("./routes/project_routes/card.routes");
app.use("/colaborator-API/projects", cardRoutes);



module.exports = app;
