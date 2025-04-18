const pool = require("./pool.js");

const SESSIONS = new Map();

const cookieValidator = (cookie) => {

  let session_id;

  session_id = cookie.substring(12);

  return session_id;
};

async function sessionValidator(req, res, next) {

  try {
    const session_id = cookieValidator(req.headers.cookie);

    const user_id = SESSIONS.get(session_id);

    const query = `
        SELECT id, "username" FROM
            users
        WHERE
            id = $1;
    `;

    const result = await pool.query(query, [user_id]);

    if (result.rowCount === 1) {
      req.user = result.rows[0];
    }

    next();
  }

  catch (error) {
    if (req.headers.cookie !== undefined) {
      console.log('session validation error:', error);
      res.clearCookie('__Secure-id', { httpOnly: true, path: '/', sameSite: true, secure: true });
      res.status(404).json({ message: 'Something is wrong with your session, please try logging back in.' });
    }
    else {
      next();
    }
  }
}

function validateUser(req, res, next) {

  if (req.user === undefined) {
    res.status(403).json({message: 'You must be logged in to access this'});
  } else {
    next();
  }
}

function clearSessions(userId) {

  // Contain the session ids to remove
  let session_ids = [];

  // Iterate over all sessions, looking for entries where the payload matches the userId.
  for (let session of SESSIONS) {
    // If there is a match, add the session id to the list.
    if (session[1] = userId) {
      session_ids.push(session[0]);
    }
  }

  // Iterate over the collected session ids, and remove each matching session.
  for (let session of session_ids) {
    SESSIONS.delete(session);
  }

}

module.exports = { clearSessions: clearSessions, SESSIONS: SESSIONS, sessionValidator: sessionValidator, validateUser: validateUser};

