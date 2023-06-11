import { Request, Response } from "express";
import pool from "../database";
import { Task, TaskStatus, TaskPriority } from "../models";

export const getTasks = async (req: Request, res: Response) => {
  const userLogin = req.params.login;

  try {
    const userResult = await pool.query("SELECT id FROM users WHERE login = $1", [userLogin]);
    const userId = userResult.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const taskResult = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [userId]);
    const tasks: Task[] = taskResult.rows;

    return res.json(tasks);
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const userLogin = req.params.login;
  const { title, description, priority } = req.body;

  try {
    const userResult = await pool.query("SELECT id FROM users WHERE login = $1", [userLogin]);
    const userId = userResult.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const result = await pool.query(
      "INSERT INTO tasks (title, description, status, priority, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, TaskStatus.TODO, priority || TaskPriority.MEDIUM, userId]
    );
    const createdTask: Task = result.rows[0];

    return res.status(201).json({ message: "Задача успешно создана", task: createdTask });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id, 10);
  const userLogin = req.params.login;
  const { title, description, status, priority } = req.body;

  try {
    const userResult = await pool.query("SELECT id FROM users WHERE login = $1", [userLogin]);
    const userId = userResult.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const result = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [taskId, userId]);
    const task: Task = result.rows[0];

    if (!task) {
      return res.status(404).json({ error: "Задача не найдена" });
    }

    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    if (status) {
      task.status = status;
    }
    if (priority) {
      task.priority = priority;
    }

    await pool.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4 WHERE id = $5",
      [task.title, task.description, task.status, task.priority, task.id]
    );

    return res.json({ message: "Задача успешно обновлена", task });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id, 10);
  const userLogin = req.params.login;

  try {
    const userResult = await pool.query("SELECT id FROM users WHERE login = $1", [userLogin]);
    const userId = userResult.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *", [taskId, userId]);
    const deletedTask: Task = result.rows[0];

    if (!deletedTask) {
      return res.status(404).json({ error: "Задача не найдена" });
    }

    return res.json({ message: "Задача успешно удалена", task: deletedTask });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
