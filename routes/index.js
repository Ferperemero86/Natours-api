import { Router } from "express";

import { router as tourRoutes } from "../tours/toursRoutes.js";
import { router as userRoutes } from "../users/usersRoutes.js";

const router = Router();

router.use("/tours", tourRoutes);
router.use("/users", userRoutes);

export default router;
