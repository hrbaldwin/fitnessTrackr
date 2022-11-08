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

  return user;
}

async function getUser({ username, password }) {}

async function getUserById(userId) {
  try{
  const {
    rows: [user],
  } = await client.query(`
    SELECT username, password
    FROM users
    WHERE id = ${userId}
    `);
    return user; 
  }catch(error){
    throw error;
  }
async function getUserByUsername(userName) {}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
