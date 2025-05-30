import { Router } from "express";

import {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} from "./tourControllers.js";

const router = Router();

router.route("/").get(getTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export { router };
