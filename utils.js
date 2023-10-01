const stringSimilarity = require('string-similarity');
const pool = require('./db'); // Import your database connection pool

async function findClosestMatch(inputName) {
  try {
    // Retrieve all usernames from your database
    const [rows] = await pool.query('SELECT username FROM gameplayerstats');

    // Initialize variables to keep track of the closest match and its score
    let closestMatch = null;
    let closestScore = -1; // Initialize with a lower value

    // Iterate through the usernames to find the closest match
    rows.forEach(row => {
      // Calculate the similarity score using the 'string-similarity' library
      const score = stringSimilarity.compareTwoStrings(inputName.toLowerCase(), row.username.toLowerCase());
      if (score > closestScore) {
        closestScore = score;
        closestMatch = row.username;
      }
    });

    // You can define a threshold value to consider a match "close"
    const threshold = 0.5; // Adjust as needed

    if (closestScore >= threshold) {
      return closestMatch;
    }

    return null; // No close matches found
  } catch (error) {
    console.error('Error finding closest match:', error);
    throw error;
  }
}

async function getPlayerStats(playerName) {
  try {
    // Acquire a connection from the existing pool
    const connection = await pool.getConnection();

    // Define your SQL query to retrieve player stats for the closest match
    const query = 'SELECT kills, deaths, kdr, headshots FROM gameplayerstats WHERE username = ?';

    // Execute the query with the provided closest matched player name
    const [rows] = await connection.execute(query, [playerName]);

    // Release the connection back to the pool
    connection.release();

    // Check if rows were returned
    if (rows.length === 0) {
      return null; // Player not found
    }

    // Extract and return the player stats
    const { kills, deaths, kdr, headshots } = rows[0];
    return { kills, deaths, kdr, headshots };
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }
}

async function getLeaderboard(page, pageSize) {
  try {
    // Calculate the starting row for the current page
    const startRow = (page - 1) * pageSize;

    // Define your SQL query to retrieve leaderboard data using OFFSET
    const query = `
      SELECT username, kills, deaths
      FROM gameplayerstats
      ORDER BY kills DESC
      LIMIT ${startRow}, ${pageSize};
    `;

    // Acquire a connection from the existing pool
    const connection = await pool.getConnection();

    // Execute the query without placeholders
    const [rows] = await connection.query(query);

    // Log the retrieved rows
    console.log('Retrieved Rows:', rows);

    // Release the connection back to the pool
    connection.release();

    // Return the leaderboard data for the current page
    return rows;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    throw error;
  }
}


module.exports = {
  findClosestMatch,
  getPlayerStats,
  getLeaderboard
};
