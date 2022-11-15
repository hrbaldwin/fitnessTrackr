/* eslint-disable no-useless-catch */
const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  // getPublicRoutinesByActivity
});

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
  const activityData = {};

  // just running error from getActivityByName

  try {
    activityData.name = name;
    activityData.description = description;
    console.log(activityData);
    const _activity = await getActivityByName(name);

    if (_activity) {
      next({
        error: "activity already exists",
        message: "An activity with name Push Ups already exists",
        name: "activity already in use",
      });
    } else {
      const postActivity = await createActivity(
        activityData.name,
        activityData.description
      );
      console.log(postActivity);

      res.send(postActivity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }
  if (description) {
    updateFields.description = description;
  }
  try {
    // need to map over all activity ids and compare to activityId

    const originalActivity = await getActivityByName(name);
    console.log(originalActivity);
    const activity = getActivityById(originalActivity.id);
    console.log(activity);
    if (originalActivity.name === name) {
      next({
        name: "NameExistsError",
        message: "An activity with name Aerobics already exists",
      });
    }
    if (!activity) {
      next({
        name: "ActivityDoesNotExistError",
        message: "An activity with that id does not exist",
      });
    } else {
      const updatedActivity = await updateActivity({
        id: activityId,
        name,
        description,
      });

      res.send(updatedActivity);
    }
  } catch (error) {
    throw error;
  }
});

module.exports = activitiesRouter;
