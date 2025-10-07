import express from "express"
import { loginUser, registeredUser, getUserProfile, updateUserProfile } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register", registeredUser)
userRouter.post("/login", loginUser)
userRouter.post("/profile", authMiddleware, getUserProfile)
userRouter.put("/profile", authMiddleware, updateUserProfile)

export default userRouter;
