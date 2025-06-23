import "dotenv/config";
import connectDB from "./src/config/db.config.js";

import { app } from "./src/app.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(` Server is running on port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDb connection failed !!!", err);
    });
