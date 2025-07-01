import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", "http://192.168.61.134:5173"];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

app.use(bodyParser.json());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

import userRoute from "./routes/user.routes.js";
import editorRoute from "./routes/editor.routes.js";
import adminRoute from "./routes/admin.routes.js";
import salespersonRoute from "./routes/salesperson.routes.js";
import carRoute  from "./routes/car.routes.js"

app.use("/api/v1/user", userRoute);
app.use("/api/v1/editor",editorRoute)
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/salesperson", salespersonRoute);
app.use("/api/v1/car",carRoute)

export { app };
