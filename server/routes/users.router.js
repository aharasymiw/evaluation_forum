const express = require('express');
const router = express.Router();
const pool = require("../modules/pool.js");
const { validateUser } = require('../modules/sessionValidator.js')

router.get("/", validateUser, (req, res) => {

  const id = req.user.id;

  const query = `
                  SELECT "first_name" as "firstName", "last_name" as "lastName", "username", "email", "member_number" as "memberNumber", "photo_url" as "photoUrl", "bio"
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

router.patch("/", validateUser, (req, res) => {
  const id = req.user.id;
  const { firstName, lastName, memberNumber, photoUrl, bio } = req.body;

  const query = `
                  UPDATE users
                  SET "first_name" = $1, "last_name" = $2, "member_number" = $3, "photo_url" = $4, "bio" = $5
                  WHERE id = $6;
                `;

  const queryValues = [firstName, lastName, memberNumber, photoUrl, bio, id];

  pool
    .query(query, queryValues)
    .then((dbRes) => {
      console.log('udpated row', dbRes.rows[0])
      res.status(200).json({ message: 'Successfully updated user profile.' });
      return;
    })
    .catch((dbErr) => {
      res.status(500).json({ message: 'Error updating user profile.' });
      return;
    });
});

router.delete("/:id", validateUser, (req, res) => {

  const id = req.users.id;
  res.sendStatus(200);
  return;

});

module.exports = router;
