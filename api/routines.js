/* eslint-disable no-useless-catch */
const express = require("express");
const routinesRouter = express.Router();
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
} = require("../db");
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
routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, goal = "", isPublic = true } = req.body;
  const routinesData = {};

  try {
    routinesData.name = name;
    routinesData.goal = goal;
    routinesData.isPublic = isPublic;
    routinesData.creatorId = req.user.id;
    const routineActivity = await createRoutine(routinesData);
    if (routinesData) {
      res.send(routineActivity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { name, goal, isPublic } = req.body;

  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }
  if (goal) {
    updateFields.goal = goal;
  }
  if (isPublic) {
    updateFields.isPublic = isPublic;
  }
  try {
    const originalRoutine = await getRoutineById(routineId);
    console.log("test");
    if (originalRoutine.creatorId === req.user.id) {
      console.log("test2");
      const updatedRoutine = await updateRoutine(routineId, updateFields);
      console.log("test3");
      console.log(updatedRoutine);
      res.send(updatedRoutine);
    }
  } catch (error) {
    throw error;
  }
});

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
