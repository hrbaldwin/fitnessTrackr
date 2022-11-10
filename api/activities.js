const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities } = require("../db");

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
activitiesRouter.post("/activities", async (req, res, next) => {});

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
