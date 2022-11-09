/* eslint-disable no-useless-catch */
const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE id = $1;
  `,
      [id]
    );

    if (!routine_activity) {
      throw {
        name: "routineActivityNotFoundError",
        message: "Could not find a routine activity with that id",
      };
    }

    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
            VALUES($1, $2, $3, $4)
            ON CONFLICT ("routineId", "activityId") DO NOTHING
            RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );

    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(
      `
    SELECT routine_activities.*
    FROM routine_activities
    WHERE "routineId"=$1;
  `,
      [id]
    );

    if (!rows) {
      throw {
        name: "routineActivityNotFoundError",
        message: "Could not find a routine activity with that routine",
      };
    }

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      await client.query(
        `
  UPDATE routine_activities
  SET ${setString}
  WHERE id=${id}
  RETURNING *;
  `,
        Object.values(fields)
      );
    }

    return await getRoutineActivityById(id);
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  const {
    rows: [routine_activity],
  } = await client.query(
    `
        DELETE FROM routine_activities 
        WHERE id=$1 RETURNING * ;
        `,
    [id]
  );
  return routine_activity;
}

// START HERE
async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    await client.query(
      `
    SELECT routine.activities."activityId", routines."creatorId"
    FROM routine_activities
    JOIN routines ON routines."creatorId" = routine.activities."activityId"
    WHERE  
    ;
  `,
      [routineActivityId, userId]
    );

    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
