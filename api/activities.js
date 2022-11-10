const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities, createActivity } = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines

// GET /api/activities
activitiesRouter.get("/activities", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    const activities = allActivities.filter((activity) => {
      return activity.name && activity.description;
    });

    res.send({
      activities,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/activities
activitiesRouter.post("/activities", requireUser, async (req, res, next) => {
  const { name, description = "" } = req.body;

  const activityData = {};

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
