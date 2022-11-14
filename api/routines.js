/* eslint-disable no-useless-catch */
const express = require("express");
const routinesRouter = express.Router();
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
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
    if (originalRoutine.creatorId === req.user.id) {
      const updatedRoutine = await updateRoutine({
        id: routineId,
        name,
        goal,
        isPublic,
      });

      res.send(updatedRoutine);
    } else {
      next({
        name: "UnauthorizedUserError",
        message: `User ${req.user.username} is not allowed to update ${originalRoutine.name}`,
      });
    }
  } catch (error) {
    throw error;
  }
});

// DELETE /api/routines/:routineId

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const routine = await getRoutineById(req.params.routineId);

    if (routine && routine.creatorId === req.user.id) {
      const deletedRoutine = await destroyRoutine(routine);
      res.send(deletedRoutine);
    } else {
      next({
        name: "UnauthorizedUserError",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines/:routineId/activities
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { count, duration, activityId } = req.body;
  const { routineId } = req.params;

  try {
    const gettingRoutineActivities = await getRoutineActivitiesByRoutine({
      id: routineId,
    });
    console.log(gettingRoutineActivities, "AA");
    // gettingRoutineAct is an array, need filter around
    if (activityId === gettingRoutineActivities.activityId) {
      // throw error
    } else {
      const addingActivity = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });

      res.send(addingActivity);
    }
  } catch (error) {
    throw error;
  }
});

module.exports = routinesRouter;
