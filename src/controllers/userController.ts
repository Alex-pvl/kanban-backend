import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database";
import fs from "fs";
import path from "path";

export const loginUser = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE login = $1", [login]);
    const user = result.rows[0];

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const privateKeyPath = path.join(__dirname, "../../secret/private.pem");
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const token = jwt.sign({ login: user.login }, privateKey, { algorithm: "RS256" });
    user.token = token;

    await pool.query("UPDATE users SET token = $1 WHERE login = $2", [token, login]);

    return res.json({ token });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, login, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE login = $1", [login]);
    const existingUser = result.rows[0];

    if (existingUser) {
      return res.status(400).json({ error: "Пользователь с таким логином уже существует" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query("INSERT INTO users (name, login, password, token) VALUES ($1, $2, $3, $4)", [
      name,
      login,
      hashedPassword,
      "",
    ]);

    return res.status(201).json({ message: "Пользователь успешно зарегистрирован" });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { login } = req.params;
  const { name, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE login = $1", [login]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    await pool.query("UPDATE users SET name = $1, password = $2 WHERE login = $3", [
      user.name,
      user.password,
      user.login,
    ]);

    return res.json({ message: "Пользователь успешно обновлен" });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const { login } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE login = $1", [login]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    user.token = "";

    await pool.query("UPDATE users SET token = $1 WHERE login = $2", ["", user.login]);

    return res.json({ message: "Пользователь успешно разлогинен" });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
