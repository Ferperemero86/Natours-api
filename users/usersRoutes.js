import { Router } from "express";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./usersControllers.js";

const router = Router();

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export { router };
