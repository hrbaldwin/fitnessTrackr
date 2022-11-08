/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  const {
    rows: [user],
  } = await client.query(
    `
        INSERT INTO users(username, password) 
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
    [username, password]
  );
  delete user.password;
  return user;
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username=$1;
    `,
      [username]
    );
    if (user && user.password == password) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
        SELECT id, username
        FROM users
        WHERE "id"=${userId};
  `);
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
