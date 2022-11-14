/* eslint-disable no-useless-catch */
const jwt = require("jsonwebtoken");
const express = require("express");
const usersRouter = express.Router();
const { JWT_SECRET } = process.env;
const { createUser, getUserByUsername } = require("../db");
const { requireUser } = require("./utils");

// POST /api/users/login
// GETTING 500 ERROR WHEN LOGGING IN USER IN THUNDERCLIENT
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    if (user && user.password == password) {
      const token = jwt.sign({ id: user.id, username }, JWT_SECRET);
      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (user) {
      next({
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    }

    if (password.length < 8) {
      next({
        error: "password too short",
        message: "Password Too Short!",
        name: "wrong",
      });
    }

    const creatingUser = await createUser({ username, password });

    const token = jwt.sign(
      {
        id: creatingUser.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "thank you for signing up",
      token,
      user: creatingUser,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/me

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
    console.log(req);
  } catch (error) {
    next(error);
  }
});
// GET /api/users/:username/routines

module.exports = usersRouter;
