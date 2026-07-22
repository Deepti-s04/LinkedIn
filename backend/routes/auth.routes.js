import { logout, signup } from "../controllers/auth.controllers.js";
import { login } from "../controllers/auth.controllers.js";
import express from "express"
let router=express.Router();
router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)


export default router;