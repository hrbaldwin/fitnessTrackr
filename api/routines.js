const express = require("express");
const routinesRouter = express.Router();
const { getAllRoutines, createRoutine } = require("../db");
const { requireUser } = require("./utils");

// GET /api/routines
routinesRouter.get("/", async (req, res, next) => {
  try {
    const allRoutines = await getAllRoutines();

    const routines = allRoutines.filter((routines) => {
      return (
        routines.creatorId &&
        routines.isPublic &&
        routines.name &&
        routines.goal
      );
    });

    res.send(routines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines
routinesRouter.post("/routines", requireUser, async (req, res, next) => {
  const { name, description = "" } = req.body;

  const routinesData = {};

  try {
    routinesData.name = name;
    routinesData.description = description;
    const routineActivity = await createRoutine(routinesData);
    if (routineActivity) {
      res.send({ routineActivity });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
