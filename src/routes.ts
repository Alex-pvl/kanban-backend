import express from "express";
import { loginUser, registerUser, updateUser, logoutUser } from "./controllers/userController";
import { getTasks, createTask, updateTask, deleteTask } from "./controllers/taskController";

const router = express.Router();

router.post("/users/login", loginUser);
router.post("/users/register", registerUser);
router.put("/users/:login", updateUser);
router.post("/users/:login/logout", logoutUser);

router.get("/users/:login/tasks", getTasks);
router.post("/users/:login/tasks", createTask);
router.put("/users/:login/tasks/:id", updateTask);
router.delete("/users/:login/tasks/:id", deleteTask);

export default router;
