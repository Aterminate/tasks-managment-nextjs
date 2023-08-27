const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

// Initialize PostgreSQL database connection
const pool = new Pool({
  connectionString: "postgres://postgres:123456789@localhost:5432/projectdb", // Use your PostgreSQL database URL here
  ssl: false, // Disable SSL
 /*  ssl: {
    rejectUnauthorized: false,
  }, */
});

// JWT Utilities
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Bcrypt utilities
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// User table name
const userTableName = "users";

// Function to query the database
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function findUser(username) {
  const queryText = "SELECT * FROM " + userTableName + " WHERE username = $1";
  const result = await query(queryText, [username]);
  return result.rows[0];
}
// This is a simplified example and should be adapted to your database setup
export async function findProjectsByUserId(userId) {
  const queryText = `SELECT * FROM projects WHERE user_id = $1`;
  const projects = await query(queryText, [userId]);
  return projects.rows;
}


export async function isUserExists(username) {
  const user = await findUser(username);
  return !!user;
}

export async function login(username, password) {
  if (!username || !password) {
    return errorMessage("WRONG_CREDENTIAL", "Both Username and Password are required.");
  }

  const user = await findUser(username);

  if (!user) {
    return errorMessage("USER_NOT_FOUND", `${username} is not defined, make sure the user is registered before.`);
  }

  if (!checkPassword(password, user.password)) {
    return errorMessage("WRONG_CREDENTIAL", "Your Password is wrong. Shame on you!(^_^)");
  }

  /*
    console.log('new checks ');
    console.log(user);
  */
  const token = jwt.sign({ username: user.username, email: user.email, id: user.id }, jwtSecretKey, {
    expiresIn: "50m", // 50 minutes
  });
  console.log(token);
  return {
    payload: {
      token,
    },
  };
}

export async function register({ username, password, email }) {
  if (!username || !password || !email) {
    return errorMessage("WRONG_CREDENTIAL", "Username, password and email are required.");
  }

  // Check if the username already exists
  if (await isUserExists(username)) {
    return errorMessage(
      "DUPLICATE_USER",
      `${username} has already registered. Try another username(But never mind, don't do this.)`
    );
  }

  const hashedPassword = hashPassword(password);

  const queryText = "INSERT INTO " + userTableName + "(username, password, email) VALUES ($1, $2, $3)";
  await query(queryText, [username, hashedPassword, email]);

  return {
    isSuccessful: true,
    payload: {},
  };
}

export async function whoAmI(username) {
  const user = await findUser(username);

  if (!user) {
    return errorMessage("USER_NOT_FOUND", `${username} is not defined, make sure the user is registered before.`);
  }

  const projects = await findProjectsByUserId(user.id);
  console.log('------------');
  console.log(projects);

  return {
    isSuccessful: true,
    payload: {

    },
  };
}


async function checkPassword(currentPassword, hashedPassword) {
  return bcrypt.compare(currentPassword, hashedPassword);
}

export function verifyToken(token) {
  return jwt.verify(token, jwtSecretKey);
}

function hashPassword(password) {
  return bcrypt.hashSync(password, salt);
}

function errorMessage(error, message) {
  return {
    isSuccessful: false,
    error,
    message,
  };
}
