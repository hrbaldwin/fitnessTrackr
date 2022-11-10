const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityByName,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    const activities = allActivities.filter((activity) => {
      return activity.name && activity.description;
    });

    res.send(activities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {
  const { name, description = "" } = req.body;
  console.log("hifdgfgd");
  const activityData = {};
  const _activity = await getActivityByName(name);

  if (_activity) {
    next({
      error: "activity already exists",
      message: "An activity with name Push Ups already exists",
      name: "activity already in use",
    });
  }

  try {
    activityData.name = name;
    activityData.description = description;
    const postActivity = await createActivity(activityData);
    if (postActivity) {
      res.send({ postActivity });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
