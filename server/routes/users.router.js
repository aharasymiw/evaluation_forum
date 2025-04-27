const express = require('express');
const router = express.Router();
const pool = require("../modules/pool.js");
const { clearCookieByName, clearSessions, SESSIONS, validateUser } = require('../modules/sessionValidator.js')
const { scrypt, randomInt, randomBytes, timingSafeEqual } = require("node:crypto");

// scrypt values per
const COST = 16384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 5;

router.post("/register", (req, res) => {

  const { firstName, lastName, username, email, password } = req.body;

  // ToDo: could error if not enough entropy.
  const salt = randomBytes(128);

  const normalizedPassword = password.normalize('NFC');
  let password_buffer = Buffer.from(normalizedPassword, 'utf8');

  scrypt(password_buffer, salt, 128, { N: COST, r: BLOCK_SIZE, p: PARALLELIZATION }, (err, hashedSaltedPassword) => {
    if (err) throw err;

    // ToDo: could error, handle with callback.
    let verificationCode = randomInt(1000000);
    verificationCode = verificationCode.toString();
    while (verificationCode.length < 6) {
      verificationCode = '0' + verificationCode;
    }

    const query = `
                    INSERT INTO users
                      (first_name, last_name, username, email, hashed_salted_password, salt, verification_code)
                    VALUES
                      ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING
                      id, "first_name" as "firstName", "last_name" as "lastName", "username", email, photo_url as "photoUrl";
                  `;

    const queryValues = [
      firstName,
      lastName,
      username,
      email,
      hashedSaltedPassword,
      salt,
      verificationCode
    ];

    pool
      .query(query, queryValues)
      .then((dbRes) => {

        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
          to: process.env.ENVIRONMENT = 'dev' ? process.env.SENDGRID_TEST_ADDRESS : email,
          from: 'donotreply@evaluation.forum',
          subject: 'Evaluation Forum registration verification code',
          text: `\n\nYour registration verification code is: '${verificationCode}'.\n\nPlease do not share this code with anyone.\nWe will never ask you for this code over the phone or text message.`,
          html: `
                <div>
                  <p>Your registration verification code is: <strong><em>${verificationCode}</em></strong>.<p>
                  <p>Please do not share this code with anyone.<p>
                  <p>We will never ask you for this code over the phone or text message.<p>
                </div>
                  `,
        }
        sgMail
          .send(msg)
          .then(() => {
            console.log(`\n\nEmail account validation message sent to: ${email}\n`);
          })
          .catch((error) => {
            console.error(error);
          })


        let body = {
          id: dbRes.rows[0].id,
          firstName: dbRes.rows[0].firstName,
          lastName: dbRes.rows[0].lastName,
          username: dbRes.rows[0].username,
          email: dbRes.rows[0].email,
          photoUrl: dbRes.rows[0].photoUrl,
          message: "Registration Successful!"
        };

        // Cache session
        // ToDo: could error if not enough entropy.
        const session_id = randomBytes(32).toString('hex');
        SESSIONS.set(session_id, dbRes.rows[0].id);
        res.cookie('__Secure-id', session_id, { httpOnly: true, path: '/', sameSite: 'strict', secure: true });
        res.status(201).json(body);
      })
      .catch((dbErr) => {
        console.error(`Error registering new user`, dbErr);
        if (dbErr.code === "23505" && dbErr.constraint === "users_email_key") {
          res
            .status(400)
            .json({ message: `Error registering ${email}.  Please try a different email address.` });
        } else if (dbErr.code === "23505" && dbErr.constraint === "users_username_key") {
          res
            .status(400)
            .json({ message: `Error registering ${username}.  Please try a different username.` });
        } else {
          res.status(500).json({ message: "Registration Error" });
        }
      });
  });
});

router.post("/register/verify", validateUser, (req, res) => {

  const id = req.user.id;
  const { attemptedCode } = req.body;

  const query = `
                      UPDATE users
                      SET "is_verified" = now()
                      WHERE id = $1 and "verification_code" = $2;
                     `;

  const queryValues = [id, attemptedCode];

  pool
    .query(query, queryValues)
    .then((dbRes) => {
      res.status(201).json({ message: "Successfully verified!" });
      return;
    })
    .catch((dbErr) => {
      console.log('\n\nError verifying user:\n', dbErr);
      res.status(500).json({ message: 'Verification attempt unsuccesful.' });
      return;
    });
});

router.post("/login", (req, res) => {

  const { username, password } = req.body;

  const query = `
        SELECT id, "first_name" as "firstName", "last_name" as "lastName", "username", email, (is_verified IS NOT NULL) as "isVerified", photo_url as "photoUrl", salt, hashed_salted_password FROM
            users
        WHERE
            username = $1;
    `;

  const queryValues = [username];

  pool
    .query(query, queryValues)
    .then((dbRes) => {

      if (dbRes.rows[0]) {

        let user = dbRes.rows[0];

        const stored_hashed_salted_password = user.hashed_salted_password;
        const salt = user.salt;

        const normalizedPassword = password.normalize('NFC');
        let password_buffer = Buffer.from(normalizedPassword, 'utf8')

        scrypt(password_buffer, salt, 128, { N: COST, r: BLOCK_SIZE, p: PARALLELIZATION }, (err, attempted_hashed_salted_password) => {
          if (err) {

            throw err;
          };

          if (timingSafeEqual(stored_hashed_salted_password, attempted_hashed_salted_password)) {

            let body = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              email: user.email,
              photoUrl: user.photoUrl,
              isVerified: user.isVerified,
              message: "Login Successful!"
            };

            // ToDo: could error if not enough entropy.
            const session_id = randomBytes(32).toString('hex');
            clearSessions(user.id);
            SESSIONS.set(session_id, dbRes.rows[0].id);
            res.cookie('__Secure-id', session_id, { httpOnly: true, path: '/', sameSite: 'strict', secure: true });

            res.status(201).json(body);
            return;

          } else {

            let body = {
              message: "That combination of email and password does not exist",
            };

            res.status(401).json(body);
            return;
          }
        });
      } else {
        let body = {
          message: "That combination of email and password does not exist",
        };

        res.status(401).json(body);
        return;
      }
    })
    .catch((dbErr) => {
      console.error(`Error logging user in`, dbErr);

      res.status(500).json({ message: `Error logging you in.` });
      return;
    });
});

router.post("/logout", validateUser, (req, res) => {

  clearCookieByName(res, '__Secure-id');

  clearSessions(req.user.id);

  res.status(200).json({ message: 'Logout Successful' });

  return;
});

// ToDo: Make a front end and test this
router.put("/password/:id", validateUser, (req, res) => {

  const id = req.user.id;

  const { username, currentPassword, newPassword } = req.body;

  const query = `
        SELECT * FROM
          users
        WHERE
          id = $1
        AND
          username = $2;
    `;

  const queryValues = [id, username];

  pool
    .query(query, queryValues)
    .then((dbRes) => {
      let user = dbRes.rows[0];

      if (user) {


        const stored_hashed_salted_password = user.hashed_salted_password;
        const salt = user.salt;

        const normalizedCurrentPassword = currentPassword.normalize('NFC');
        let current_password_buffer = Buffer.from(normalizedCurrentPassword, 'utf8')

        scrypt(current_password_buffer, salt, { N: COST, r: BLOCK_SIZE, p: PARALLELIZATION }, 128, (err, current_hashed_salted_password) => {
          if (err) throw err;

          if (timingSafeEqual(stored_hashed_salted_password, current_hashed_salted_password)) {

            const newSalt = randomBytes(128);

            const normalizedNewPassword = newPassword.normalize('NFC');
            let new_password_buffer = Buffer.from(normalizedNewPassword, 'utf8')

            scrypt(new_password_buffer, newSalt, 128, (err, new_hashed_salted_password) => {
              if (err) throw err;

              const query = `
                              UPDATE
                                users
                              SET
                                hashed_salted_password = $1,
                                salt = $2
                              WHERE
                                id = $3
                              AND
                                username = $4
                              RETURNING
                                id;
                            `;

              const queryValues = [
                new_hashed_salted_password,
                newSalt,
                id,
                username
              ];

              pool
                .query(query, queryValues)
                .then((dbRes) => {
                  res.status(201).json({ message: `Password Update Successful!`, id: dbRes.rows[0].id });
                  return;
                })
                .catch((dbErr) => {
                  console.error(`Error updating password:`, dbErr);
                  if (dbErr.code === "23505" && dbErr.constraint === "users_email_key") {
                    res
                      .status(400)
                      .json({ message: `Error updating password, please try again.` });
                    return;
                  } else {
                    res.status(500).json({ message: "Password Update Error" });
                    return;
                  }
                });
            });
          } else {
            let body = {
              message: "That combination of username and password does not exist",
            };
            res.status(401).json(body);
            return;
          }
        });
      } else {
        let body = {
          message: "That combination of username and password does not exist",
        };
        res.status(401).json(body);
        return;
      }
    })
    .catch((dbErr) => {
      console.error(`Error updating password`, dbErr);
      res.status(500).json({ message: `Error updating your password.` });
      return;
    });
});

router.get("/", validateUser, (req, res) => {

  const id = req.user.id;

  const query = `
                  SELECT "first_name" as "firstName", "last_name" as "lastName", "username", "email", "phone", "member_number" as "memberNumber", "photo_url" as "photoUrl", "bio"
                  FROM users
                  WHERE id = $1;
                `;

  const queryValues = [id];

  pool
    .query(query, queryValues)
    .then((dbRes) => {
      let userDetails = dbRes.rows[0];
      userDetails.message = "Successfully fetched user data";
      res.status(201).json(userDetails);
      return;
    })
    .catch((dbErr) => {
      res.status(500).json({ message: 'Error fetching user information.' });
      return;
    });
});

router.delete("/:id", validateUser, (req, res) => {

  const id = req.users.id;
  res.sendStatus(200);
  return;

});

module.exports = router;
