const express = require('express');
const usersRouter = require('./routes/users.router');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('dist'));

app.use('/api/users', usersRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
