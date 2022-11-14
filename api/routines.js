/* eslint-disable no-useless-catch */
const express = require("express");
const routinesRouter = express.Router();
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
} = require("../db");
const usersRouter = require("./users");
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
    console.log("test", req.user.username);
    if (originalRoutine.creatorId === req.user.id) {
      console.log("test2");
      console.log(routineId);
      console.log(updateFields);
      const updatedRoutine = await updateRoutine({
        id: routineId,
        name,
        goal,
        isPublic,
      });
      console.log(updatedRoutine);
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

routinesRouter.delete("/:routineId", requireUser, async (req.res.next)=>{
  try{
const routine = await getRoutineById(req.params.routineId);

if (routine && routine.creatorId === req.user.id){
const updatedRoutine = await updateRoutine()
}
  }catch({}){
    next({});
  }
})

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
