import express from "express";
import {
  getUsersOnQueryController,
  userLoginController,
  userRegisterController,
} from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/userMiddleware.js";

const router = express.Router();

// USER REGISTERATION || METHOD : POST
router.post("/register", userRegisterController);

// USER LOGIN || METHOD : POST
router.post("/login", userLoginController);

// USER LOGIN || METHOD : POST
router.get("/users", requireSignIn, getUsersOnQueryController);

// USER AUTHORIZATION || METHOD : GET
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});
export default router;
