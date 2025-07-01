import { Router } from "express";

import { createCar, updateCar,getAllCars } from "../controllers/car.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/add", verifyJWT,upload.single("image"),createCar);
router.put("/cars/:id", verifyJWT, updateCar);
router.get("/all",verifyJWT,getAllCars)
router.patch("/update/:id",verifyJWT,updateCar)

export default router;
